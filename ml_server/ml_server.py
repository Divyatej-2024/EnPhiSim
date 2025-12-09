from flask import Flask, request, jsonify
from transformers import DistilBertTokenizer, DistilBertModel
import tensorflow as tf
import torch
import numpy as np

app = Flask(__name__)

# ===== LOAD DISTILBERT =====
tokenizer = DistilBertTokenizer.from_pretrained("./distilbert")
distilbert = DistilBertModel.from_pretrained("./distilbert")

# ===== LOAD CNN MODEL =====
cnn_model = tf.keras.models.load_model("cnn_model.h5")

def extract_features(text_list):
    inputs = tokenizer(
        text_list,
        padding=True,
        truncation=True,
        return_tensors="pt"
    )

    with torch.no_grad():
        outputs = distilbert(**inputs)

    cls_embeddings = outputs.last_hidden_state[:, 0, :].numpy()

    # You can now feed embeddings to CNN or concatenate with engineered features
    return cls_embeddings

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json.get("data", [])

    texts = [d["email_content"] for d in data]

    # 1. Extract embeddings from DistilBERT
    features = extract_features(texts)

    # 2. Run CNN predictions on top of embeddings
    predictions = cnn_model.predict(features)

    # 3. Convert to probabilities & accuracy
    probabilities = predictions.tolist()
    risk_score = float(np.mean(predictions))

    return jsonify({
        "probabilities": probabilities,
        "risk_score": risk_score
    })

app.run(host="0.0.0.0", port=8080)
