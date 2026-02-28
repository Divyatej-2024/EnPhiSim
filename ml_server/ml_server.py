# mlserver.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import json
import os
from keras.models import load_model
import torch
from transformers import DistilBertTokenizerFast, DistilBertModel

# ---- CONFIG ----
MODEL_DIR = os.getenv("MODEL_DIR", "./models")   # folder containing cnn_model.h5 & meta.json
MODEL_CANDIDATES = [
    os.path.join(MODEL_DIR, "cnn_model.h5"),
    os.path.join(MODEL_DIR, "cnn_options_model.h5"),
]
META_PATH = os.path.join(MODEL_DIR, "meta.json")
MAX_TEXT_CHARS = int(os.getenv("MAX_TEXT_CHARS", "4000"))

# ---- FASTAPI APP ----
app = FastAPI(title="EnPhiSim ML Server - DistilBERT + CNN")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---- LOAD MODELS ----
try:
    print("Loading tokenizer and DistilBERT...")
    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
    bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
    bert.eval()  # inference mode

    print("Loading CNN classifier...")
    CNN_MODEL_PATH = next((path for path in MODEL_CANDIDATES if os.path.exists(path)), None)
    if not CNN_MODEL_PATH:
        raise FileNotFoundError(f"No CNN model found in {MODEL_DIR}")
    cnn_model = load_model(CNN_MODEL_PATH)

    print("Loading meta...")
    meta = {}
    if os.path.exists(META_PATH):
        with open(META_PATH, "r") as f:
            meta = json.load(f)
    LABELS = meta.get("labels", ["correct", "neutral", "wrong"])  # ordering
    MODEL_ACCURACY = meta.get("accuracy", None)

except Exception as e:
    print("ERROR loading models:", e)
    raise

# ---- Pydantic request model ----
class PredictRequest(BaseModel):
    userId: str | None = "user_001"  # single-user mode default
    levelId: str | int | None = None
    text: str

class BatchPredictRequest(BaseModel):
    items: list[dict]  # [{"userId":"u","levelId":1,"text":"..."}]

# ---- Helper: get embeddings from DistilBERT ----
def get_embeddings(texts, max_length=128):
    """
    Returns numpy array shape (n_texts, seq_len, hidden_size)
    or collapsed to (n_texts, seq_len, hidden_size) depending on CNN design.
    Here we return token embeddings for the sequence to feed a 1D CNN.
    """
    # tokenizer returns PyTorch tensors
    enc = tokenizer(texts, padding="max_length", truncation=True, max_length=max_length, return_tensors="pt")
    with torch.no_grad():
        out = bert(**enc)
    # out.last_hidden_state => (batch, seq_len, hidden)
    emb = out.last_hidden_state.numpy()
    return emb  # shape (n, seq_len, hidden_size)

# ---- API: single prediction ----
@app.post("/predict")
def predict(req: PredictRequest):
    text = req.text
    if not text or not isinstance(text, str):
        raise HTTPException(status_code=400, detail="text is required")
    text = text.strip()[:MAX_TEXT_CHARS]
    if not text:
        raise HTTPException(status_code=400, detail="text is empty")

    try:
        # get token-level embeddings
        emb = get_embeddings([text])  # shape (1, seq_len, hidden)
        # the CNN was trained to expect shape (batch, seq_len, hidden)
        preds = cnn_model.predict(emb, verbose=0)  # shape (1, n_classes)
        probs = preds[0].tolist()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"inference_failed: {exc}")

    # prepare response
    width = min(len(LABELS), len(probs))
    if width == 0:
        raise HTTPException(status_code=500, detail="invalid_model_output")
    top_idx = int(np.argmax(probs[:width]))
    label = LABELS[top_idx]
    confidence = float(probs[top_idx])

    response = {
        "levelId": req.levelId,
        "userId": req.userId,
        "prediction": label,
        "probabilities": { LABELS[i]: float(probs[i]) for i in range(width) },
        "confidence": confidence,
        "model_accuracy": MODEL_ACCURACY  # may be null if not provided
    }
    return response

# ---- API: batch prediction (optional) ----
@app.post("/predict/batch")
def predict_batch(req: BatchPredictRequest):
    items = req.items
    texts = [str(it.get("text", "")).strip()[:MAX_TEXT_CHARS] for it in items]
    if not texts:
        raise HTTPException(status_code=400, detail="items required")

    try:
        emb = get_embeddings(texts)
        preds = cnn_model.predict(emb, verbose=0)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"batch_inference_failed: {exc}")
    results = []
    for i, p in enumerate(preds):
        width = min(len(LABELS), len(p))
        if width == 0:
            continue
        top_idx = int(np.argmax(p[:width]))
        label = LABELS[top_idx]
        confidence = float(p[top_idx])
        results.append({
            "levelId": items[i].get("levelId"),
            "userId": items[i].get("userId"),
            "prediction": label,
            "probabilities": { LABELS[j]: float(p[j]) for j in range(width) },
            "confidence": confidence
        })
    return {"results": results, "model_accuracy": MODEL_ACCURACY, "model_path": CNN_MODEL_PATH}

# ---- Health ---
@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "labels": LABELS,
        "model_accuracy": MODEL_ACCURACY,
        "model_path": CNN_MODEL_PATH,
    }
