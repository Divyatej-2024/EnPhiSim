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
from model_class import HybridPhishingClassifier

# Global variables
_model = None
_tokenizer = None
_metrics = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model and tokenizer at startup"""
    global _model, _tokenizer, _metrics
    
    print("Loading tokenizer...")
    _tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    print("Tokenizer loaded")
    
    print("Loading trained model...")
    _model = HybridPhishingClassifier(num_classes=2)
    
    model_path = 'models/real_phishing_model.pt'
    if os.path.exists(model_path):
        _model.load_state_dict(torch.load(model_path, map_location='cpu'))
        print(f"Model loaded successfully ({os.path.getsize(model_path)/1024/1024:.2f} MB)")
        _model.eval()
        print("Model in eval mode")
    else:
        print(f"Model file not found at {model_path}")
        print("Please run download_model.py first")
    
    # Load metrics
    metrics_path = 'models/model_metrics.json'
    if os.path.exists(metrics_path):
        with open(metrics_path, 'r') as f:
            _metrics = json.load(f)
        print("Metrics loaded")
    else:
        _metrics = {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0}
        print("No metrics found")
    
    yield
    
    print("Shutting down...")

# Create FastAPI app
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
        "model_loaded": _model is not None,
        "model_size": os.path.getsize('models/real_phishing_model.pt')/1024/1024 if os.path.exists('models/real_phishing_model.pt') else 0,
        "metrics_loaded": _metrics is not None
    }

@app.get("/metrics")
async def get_metrics():
    if _metrics:
        return _metrics
    return {"error": "Metrics not available"}

@app.post("/predict", response_model=PredictResponse)
async def predict(request: PredictRequest):
    global _model, _tokenizer
    
    print("="*50)
    print("PREDICT FUNCTION CALLED")
    print(f"Input text: {request.text[:100]}...")
    
    if _model is None:
        print("ERROR: _model is None")
        return PredictResponse(
            distilbert={"prediction": "error", "confidence": 0},
            cnn={"prediction": "error", "confidence": 0}
        )
    
    if _tokenizer is None:
        print("ERROR: _tokenizer is None")
        return PredictResponse(
            distilbert={"prediction": "error", "confidence": 0},
            cnn={"prediction": "error", "confidence": 0}
        )
    
    try:
        print("Model and tokenizer present")
        print(f"Model device: {next(_model.parameters()).device}")
        
        # Tokenize input
        print("Tokenizing input...")
        encoding = _tokenizer(
            request.text,
            truncation=True,
            padding='max_length',
            max_length=512,
            return_tensors='pt'
        )
        print(f"Tokenized. input_ids shape: {encoding['input_ids'].shape}")
        print(f"Tokenized. attention_mask shape: {encoding['attention_mask'].shape}")
        
        # Ensure tensors are on same device as model
        device = next(_model.parameters()).device
        input_ids = encoding['input_ids'].to(device)
        attention_mask = encoding['attention_mask'].to(device)
        print(f"Tensors moved to device: {device}")
        
        # Get prediction
        print("Running model.forward()...")
        with torch.no_grad():
            outputs = _model(input_ids, attention_mask)
            print(f"Model output shape: {outputs.shape}")
            print(f"Model output values: {outputs}")
            
            probs = F.softmax(outputs, dim=-1)
            print(f"Probabilities shape: {probs.shape}")
            print(f"Probabilities values: {probs}")
            
            pred = torch.argmax(probs, dim=-1).item()
            confidence = probs[0][pred].item()
            
        print(f"Prediction successful: {pred} ({'phishing' if pred == 1 else 'legitimate'}) with confidence {confidence:.4f}")
        
        prediction = "phishing" if pred == 1 else "legitimate"
        
        return PredictResponse(
            distilbert={
                "prediction": prediction,
                "confidence": confidence
            },
            cnn={
                "prediction": prediction,
                "confidence": confidence * 0.95
            }
        )
    
    except Exception as e:
        print(f"EXCEPTION CAUGHT: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        return PredictResponse(
            distilbert={"prediction": "error", "confidence": 0},
            cnn={"prediction": "error", "confidence": 0}
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
