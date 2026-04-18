# EnPhiSim Backend

Express + MongoDB API for simulator content, user actions, and ML integration.

## Environment

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=your_mongodb_uri
ML_SERVER_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
# Optional fallback:
# ML_API_URL=http://localhost:8000
```

## Run

```bash
npm install
npm start
```

## Main Routes

- `GET /health`
- `GET /api/levels`
- `GET /api/levels/:category/:level_no`
- `GET /api/scenarios/:category/:level_no`
- `POST /api/actions`
- `POST /api/predict`
- `GET /api/analysis/:UserID`

## ML Integration

- `/api/predict` forwards request to ML server `/predict`.
- `/api/analysis/:UserID` loads stored user actions and calls ML server batch/single prediction to return:
  - `accuracy`
  - `risk_score`
  - `probabilities`
  - `results`
