#!/bin/bash
# ml_server/start.sh

echo "🚀 Starting ML Server..."

# Download model if not exists
python download_model.py

# Check if download was successful
if [ ! -f "models/real_phishing_model.pt" ]; then
    echo "❌ ERROR: Model file not found after download!"
    exit 1
fi

echo "✅ Model ready, starting server..."

# Start the FastAPI server
uvicorn predict:app --host 0.0.0.0 --port $PORT