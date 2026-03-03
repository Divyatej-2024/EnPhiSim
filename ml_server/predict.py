# ml_server/predict.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
import torch.nn.functional as F
from transformers import DistilBertTokenizer
import numpy as np
import os
import json
from typing import Optional, List

# Import your model class
from train_real_model import HybridPhishingClassifier

app = FastAPI(title="EnPhiSim Real ML Server")

# Global variables for model and tokenizer
model = None
tokenizer = None
metrics = None

class PredictionRequest(BaseModel):
    text: str
    links: Optional[List[str]] = []

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: dict
    model_version: str

@app.on_event("startup")
async def load_model():
    global model, tokenizer, metrics
    
    print("📥 Loading tokenizer...")
    tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
    
    print("📥 Loading trained model...")
    model = HybridPhishingClassifier(num_classes=2)
    
    try:
        model.load_state_dict(torch.load('models/real_phishing_model.pt', map_location='cpu'))
        print("✅ Model loaded successfully")
    except FileNotFoundError:
        print("⚠️ No trained model found. Using random weights (TRAIN FIRST!)")
    
    try:
        with open('models/model_metrics.json', 'r') as f:
            metrics = json.load(f)
        print("✅ Metrics loaded")
    except FileNotFoundError:
        metrics = {"accuracy": 0, "precision": 0, "recall": 0, "f1": 0}
        print("⚠️ No metrics found")
    
    model.eval()

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "accuracy": metrics.get('accuracy', 0) if metrics else 0
    }

@app.get("/metrics")
async def get_metrics():
    """Return model performance metrics"""
    return metrics or {"error": "No metrics available"}

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    global model, tokenizer
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
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
    
    return PredictionResponse(
        prediction="phishing" if pred == 1 else "legitimate",
        confidence=confidence,
        probabilities={
            "legitimate": float(probs[0][0]),
            "phishing": float(probs[0][1])
        },
        model_version="trained_v1"
    )

@app.post("/predict/batch")
async def predict_batch(requests: List[PredictionRequest]):
    results = []
    for req in requests:
        try:
            result = await predict(req)
            results.append(result)
        except:
            results.append({"error": "Failed"})
    return {"predictions": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)