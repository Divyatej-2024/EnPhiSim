from fastapi import FastAPI
import joblib

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to EnPhiSim ML Server"}

@app.post("/predict")
def predict(text: str):
    # Example placeholder — replace with real model prediction
    return {"prediction": "phishing", "confidence": 0.94}
