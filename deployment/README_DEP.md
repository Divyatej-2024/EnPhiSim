# Deployment Guide (EnPhiSim)

This repository is designed for:
- Frontend on Vercel
- Backend on Render/Railway
- ML server on Render
- MongoDB Atlas

## 1) Backend Service

Set env vars:

```env
PORT=4000
MONGO_URI=your_mongodb_atlas_uri
ML_SERVER_URL=https://your-ml-service.onrender.com
```

Start command:

```bash
npm start
```

## 2) ML Service

Set env vars:

```env
MODEL_DIR=./models
```

Start command:

```bash
uvicorn ml_server:app --host 0.0.0.0 --port=$PORT
```

## 3) Frontend (Vercel)

Set env var:

```env
REACT_APP_API_URL=https://your-backend-service.onrender.com
```

Build command:

```bash
npm run build
```

## 4) Smoke Test Checklist

- `GET <backend>/health` returns `status: OK`
- `GET <ml>/health` returns `model_loaded: true`
- Frontend loads levels from backend
- Playing a level triggers:
  - `/api/predict` (ML response visible in dialog)
  - `/api/actions` (action persisted)
- `GET /api/analysis/:UserID` returns aggregated analysis
