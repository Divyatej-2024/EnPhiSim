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
