# EnPhiSim

EnPhiSim is a hybrid walkthrough phishing simulator with machine learning.
It combines:
- A level-based phishing awareness simulator (React frontend).
- A backend API for levels, scenarios, actions, and analytics (Node/Express + MongoDB).
- An ML inference service for real-time text-based phishing classification (FastAPI + DistilBERT + CNN).

## Project Objectives (from FYP proposal)

- Build a walkthrough phishing simulation with level-based modules.
- Integrate real-time ML phishing detection in simulation flow.
- Provide dashboard-style user progress tracking.
- Use a hybrid DistilBERT + CNN pipeline for phishing text classification.
- Deploy frontend, backend, and ML services with scalable cloud setup.

## Architecture

- `frontend/`:
  - React app for simulator UI, levels, and dashboard.
  - Sends prediction and action events to backend.
- `backend/`:
  - Express API, MongoDB integration, action persistence.
  - Proxies prediction requests to ML service.
  - Aggregates ML analysis for user actions.
- `ml_server/`:
  - FastAPI inference service.
  - Loads DistilBERT embeddings + CNN classifier.
  - Exposes `/predict`, `/predict/batch`, `/health`.

## Key Runtime Flow

1. User acts on a level in frontend.
2. Frontend calls backend `/api/predict` with level content + user action context.
3. Backend forwards to ML server and returns prediction/confidence/probabilities.
4. Frontend shows ML detection feedback in the action dialog.
5. Frontend records action locally and persists action text to backend `/api/actions`.
6. Backend `/api/analysis/:UserID` uses stored actions and ML service for aggregated risk/accuracy views.

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB Atlas URI or local MongoDB

### 1) Backend

Create `backend/.env`:

```env
PORT=4000
MONGO_URI=MongoDB_URL
ML_SERVER_URL=http://localhost:8000
```

Run:

```bash
cd backend
npm install
npm start
```

### 2) ML Server

Create `ml_server/.env` (optional):

```env
MODEL_DIR=./models
```

Run:

```bash
cd ml_server
pip install -r requirements.txt
uvicorn ml_server:app --host 0.0.0.0 --port 8000
```

### 3) Frontend

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:4000
```

Run:

```bash
cd frontend
npm install
npm start
```

## Deployment Summary

- Frontend: Vercel
- Backend API: Render/Railway
- ML service: Render
- Database: MongoDB Atlas

Detailed deployment steps are in `deployment/README_DEP.md`.




You can Access live github through the link given here: https://github.com/Divyatej-2024/Enphisim/
