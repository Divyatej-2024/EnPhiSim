# EnPhiSim ML Server

FastAPI inference service for phishing classification using DistilBERT embeddings and a CNN classifier.

## Endpoints

- `POST /predict`
  - Body: `{ "userId": "user_x", "levelId": "l1", "text": "..." }`
  - Response: prediction, confidence, probabilities, model_accuracy
- `POST /predict/batch`
  - Body: `{ "items": [{ "userId": "...", "levelId": "...", "text": "..." }] }`
- `GET /health`

## Environment

```env
MODEL_DIR=./models
```

Expected files under `MODEL_DIR`:
- `cnn_model.h5`
- `meta.json` (contains labels/accuracy metadata)

## Run

```bash
pip install -r requirements.txt
uvicorn ml_server:app --host 0.0.0.0 --port 8000
```

## Deploy (Render)

Procfile entry:

```txt
web: uvicorn ml_server:app --host 0.0.0.0 --port=$PORT
```
