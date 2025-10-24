<<<<<<< HEAD
from fastapi import FastAPI
from pydantic import BaseModel
import torch
from model import DistilBERT_CNN
from utils import tokenizer

app = FastAPI()
model = DistilBERT_CNN()
model.load_state_dict(torch.load("distilbert_cnn_phish.pth", map_location="cpu"))
model.eval()

class InputText(BaseModel):
    text: str

@app.post("/predict")
def predict(data: InputText):
    inputs = tokenizer(data.text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        output = model(inputs["input_ids"], inputs["attention_mask"])
        pred = torch.argmax(output, dim=1).item()
    label = "Phishing" if pred == 1 else "Legitimate"
    return {"prediction": label}
=======
# ml-server/app.py
from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
from utils.preprocess import preprocess_text
import numpy as np

app = FastAPI()

MODEL_PATH = 'model/phishing_model.pkl'
VEC_PATH = 'model/vectorizer.pkl'

model = None
vectorizer = None

if os.path.exists(MODEL_PATH) and os.path.exists(VEC_PATH):
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VEC_PATH)
else:
    print("Model files not found. Please train model first (train_model.py)")

class InputText(BaseModel):
    text: str

@app.get("/")
def root():
    return {"message": "ML server running"}

@app.post("/predict")
def predict(item: InputText):
    if model is None or vectorizer is None:
        return {"prediction": "unknown", "confidence": 0.0}
    clean = preprocess_text(item.text)
    X = vectorizer.transform([clean])
    proba = model.predict_proba(X)[0]
    pred = int(model.predict(X)[0])
    confidence = float(np.max(proba))
    return {"prediction": "phishing" if pred == 1 else "legitimate", "confidence": confidence}
>>>>>>> 622a2f58a21cb608242fa59b8e4c35dfb00d67b0
