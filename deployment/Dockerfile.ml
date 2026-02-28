FROM python:3.11-slim

WORKDIR /app

COPY ml_server/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY ml_server/ ./

ENV MODEL_DIR=./models
EXPOSE 8000

CMD ["uvicorn", "ml_server:app", "--host", "0.0.0.0", "--port", "8000"]
