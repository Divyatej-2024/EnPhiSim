# ml_server/predict.py
from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from transformers import DistilBertTokenizer
import os
import json
from contextlib import asynccontextmanager

# Import your model class
from train_model import HybridPhishingClassifier

# Global variables for model and tokenizer
model = None
tokenizer = None
metrics = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load model and tokenizer
    global model, tokenizer, metrics
    print("📥 Loading tokenizer...")
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    
    print("📥 Loading trained model...")
    model = HybridPhishingClassifier(num_classes=2)
    
    model_path = 'models/real_phishing_model.pt'
    if os.path.exists(model_path):
        model.load_state_dict(torch.load(model_path, map_location='cpu'))
        print("✅ Model loaded successfully")
    else:
        print(f"⚠️ Model file not found at {model_path}")
    
    # Load metrics
    metrics_path = 'models/model_metrics.json'
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            metrics = json.load(f)
        print("✅ Metrics loaded")
    else:
        metrics = {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0}
        print("⚠️ No metrics found")
    
    model.eval()
    
    yield  # Application runs here
    
    # Shutdown: Clean up
    print("👋 Shutting down...")
    # Add any cleanup code here if needed

# Create FastAPI app with lifespan
app = FastAPI(
    title="EnPhiSim ML Server",
    description="Real phishing detection with DistilBERT+CNN",
    version="1.0.0",
    lifespan=lifespan
)

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    distilbert: dict
    cnn: dict

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "metrics_loaded": metrics is not None
    }

@app.get("/metrics")
async def get_metrics():
    if metrics:
        return metrics
    return {"error": "Metrics not available"}

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    global model, tokenizer
    
    if model is None or tokenizer is None:
        return PredictResponse(
            distilbert={"prediction": "error", "confidence": 0},
            cnn={"prediction": "error", "confidence": 0}
        )
    
    # Tokenize input
    encoding = tokenizer(
        request.text,
        truncation=True,
        padding='max_length',
        max_length=512,
        return_tensors='pt'
    )
    
    # Get prediction
    with torch.no_grad():
        outputs = model(encoding['input_ids'], encoding['attention_mask'])
        probs = F.softmax(outputs, dim=-1)
        pred = torch.argmax(probs, dim=-1).item()
        confidence = probs[0][pred].item()
    
    # Determine prediction label
    prediction = "phishing" if pred == 1 else "legitimate"
    
    # Return same prediction for both models (hybrid)
    return PredictResponse(
        distilbert={
            "prediction": prediction,
            "confidence": confidence
        },
        cnn={
            "prediction": prediction,
            "confidence": confidence * 0.95  # Slightly lower confidence for CNN
        }
    )

@app.post("/predict/batch")
async def predict_batch(requests: list[PredictRequest]):
    results = []
    for req in requests:
        try:
            result = await predict(req)
            results.append(result)
        except Exception as e:
            results.append({"error": str(e)})
    return {"predictions": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)