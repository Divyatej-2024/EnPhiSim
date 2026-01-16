"""
train.py

Fetches training data from your live ML server (ML_SERVER_URL env),
encodes texts with DistilBERT, trains a simple 1D-CNN classifier,
and saves model + meta.

Requirements:
  pip install transformers torch tensorflow scikit-learn requests

Environment:
  ML_SERVER_URL (optional) - default: https://enphisim-ml.onrender.com
"""

import os
import json
import time
from typing import Tuple, List, Dict, Any

import numpy as np
import requests
from transformers import DistilBertTokenizerFast, DistilBertModel
import torch
from tensorflow import keras
from keras.models import Model
from keras.layers import Input, Conv1D, GlobalMaxPool1D, Dense, Dropout
from keras.optimizers import Adam
from keras.utils import to_categorical
from sklearn.model_selection import train_test_split

# -------- CONFIG --------
ML_SERVER_URL = os.environ.get("ML_SERVER_URL", "https://enphisim-ml.onrender.com")
# endpoints to try (common patterns)
ENDPOINT_CANDIDATES = [
    "/dataset",
    "/api/dataset",
    "/training-data",
    "/api/training-data",
    "/data",
    "/api/data"
]
REQUEST_TIMEOUT = 10  # seconds
BATCH_SIZE_ENCODE = 16  # BERT encode batch size (adjust by GPU/CPU memory)

# model/save paths
OUT_DIR = "./models"
os.makedirs(OUT_DIR, exist_ok=True)


# -------- Helpers to fetch dataset from live server --------
def try_fetch(url_base: str) -> Tuple[List[str], List[int]]:
    """
    Try multiple candidate endpoints at url_base to fetch the dataset.
    Support returns:
      - list of dicts: [{"text":..., "label":...}, ...]
      - dict with "texts" and "labels": {"texts":[...], "labels":[...]}
    """
    last_exception = None
    for endpoint in ENDPOINT_CANDIDATES:
        url = url_base.rstrip("/") + endpoint
        print(f"Trying {url} ...")
        try:
            r = requests.get(url, timeout=REQUEST_TIMEOUT)
            if r.status_code != 200:
                print(f"  -> status {r.status_code}, skipping")
                continue
            data = r.json()
            texts, labels = normalize_data_shape(data)
            print(f"  -> fetched {len(texts)} samples from {url}")
            return texts, labels
        except Exception as e:
            last_exception = e
            print(f"  -> error: {e}")
            continue

    # final fallback: try root url (maybe endpoint is the root)
    try:
        r = requests.get(url_base, timeout=REQUEST_TIMEOUT)
        if r.status_code == 200:
            data = r.json()
            texts, labels = normalize_data_shape(data)
            print(f"  -> fetched {len(texts)} samples from root {url_base}")
            return texts, labels
    except Exception as e:
        last_exception = e

    raise RuntimeError(f"Could not fetch dataset from {url_base}. Last error: {last_exception}")


def normalize_data_shape(data: Any) -> Tuple[List[str], List[int]]:
    """
    Accepts several shapes and normalizes to (texts, labels).
    - list of {"text":..., "label":...}
    - {"texts":[...], "labels":[...]}
    - {"data":[{"text":..., "label":...}, ...]}
    """
    if isinstance(data, list):
        # list of objects
        if len(data) == 0:
            raise ValueError("Fetched dataset is empty list")
        first = data[0]
        if isinstance(first, dict) and "text" in first and "label" in first:
            texts = [str(x["text"]) for x in data]
            labels = [int(x["label"]) for x in data]
            return texts, labels
        # maybe it's a list of strings and labels come separately? reject
        raise ValueError("Fetched list JSON does not contain dicts with 'text' and 'label' keys")
    elif isinstance(data, dict):
        # common form: {"texts": [...], "labels": [...]}
        if "texts" in data and "labels" in data:
            texts = [str(t) for t in data["texts"]]
            labels = [int(l) for l in data["labels"]]
            if len(texts) != len(labels):
                raise ValueError("Length mismatch between texts and labels")
            return texts, labels
        # maybe nested "data" key
        if "data" in data and isinstance(data["data"], list):
            return normalize_data_shape(data["data"])
        raise ValueError("Fetched JSON dict didn't contain expected keys (texts/labels or data)")
    else:
        raise ValueError("Unexpected JSON shape for training dataset")


# -------- DistilBERT encoder (batched) --------
tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
bert = DistilBertModel.from_pretrained("distilbert-base-uncased")
bert.eval()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
bert.to(device)


def encode_texts_batched(texts: List[str], max_length: int = 128, batch_size: int = BATCH_SIZE_ENCODE) -> np.ndarray:
    """
    Encode a list of texts into DistilBERT last_hidden_state arrays.
    Returns concatenated numpy array of shape (n_samples, seq_len, hidden_size).
    Processes texts in batches to avoid OOM.
    """
    all_embeddings = []
    n = len(texts)
    for i in range(0, n, batch_size):
        batch_texts = texts[i:i + batch_size]
        enc = tokenizer(
            batch_texts,
            padding="max_length",
            truncation=True,
            max_length=max_length,
            return_tensors="pt"
        ).to(device)

        with torch.no_grad():
            out = bert(**enc)
        # move to CPU then numpy
        emb = out.last_hidden_state.cpu().numpy()
        all_embeddings.append(emb)
        print(f"Encoded batch {i // batch_size + 1}/{(n + batch_size - 1)//batch_size}")
    return np.vstack(all_embeddings)


# -------- Main training flow --------
def main():
    print(f"ML_SERVER_URL = {ML_SERVER_URL}")
    texts, labels = try_fetch(ML_SERVER_URL)

    if len(texts) < 2:
        raise RuntimeError("Not enough samples to train")

    # split BEFORE encoding so stratify works on raw labels
    texts_train, texts_val, labels_train, labels_val = train_test_split(
        texts, labels, test_size=0.12, random_state=42, stratify=labels
    )
    print(f"Train/Val sizes: {len(texts_train)}/{len(texts_val)}")

    # encode both sets (batched)
    print("Encoding train set...")
    X_train = encode_texts_batched(texts_train)
    print("Encoding val set...")
    X_val = encode_texts_batched(texts_val)

    # convert labels to categorical
    y_train = to_categorical(np.array(labels_train), num_classes=3)
    y_val = to_categorical(np.array(labels_val), num_classes=3)

    # build model (keeps your original architecture)
    seq_len = X_train.shape[1]
    hidden = X_train.shape[2]

    inp = Input(shape=(seq_len, hidden))
    x = Conv1D(filters=128, kernel_size=3, activation="relu", padding="same")(inp)
    x = Conv1D(filters=64, kernel_size=3, activation="relu", padding="same")(x)
    x = GlobalMaxPool1D()(x)
    x = Dropout(0.4)(x)
    x = Dense(64, activation="relu")(x)
    out = Dense(3, activation="softmax")(x)

    model = Model(inputs=inp, outputs=out)
    model.compile(optimizer=Adam(learning_rate=1e-4), loss="categorical_crossentropy", metrics=["accuracy"])

    # train
    print("Starting training...")
    model.fit(X_train, y_train, validation_data=(X_val, y_val), batch_size=16, epochs=8)

    # save
    out_model_path = os.path.join(OUT_DIR, "cnn_model.h5")
    model.save(out_model_path)
    val_acc = float(model.evaluate(X_val, y_val, verbose=0)[1])

    meta = {"labels": ["correct", "neutral", "wrong"], "accuracy": val_acc}
    with open(os.path.join(OUT_DIR, "meta.json"), "w") as f:
        json.dump(meta, f, indent=4)

    print("Training complete.")
    print(f"Saved model -> {out_model_path}")
    print(f"Validation accuracy: {val_acc:.4f}")


if __name__ == "__main__":
    main()
