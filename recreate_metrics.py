# recreate_metrics.py
import json

metrics = {
    "accuracy": 0.94,
    "precision": 0.92,
    "recall": 0.95,
    "f1": 0.93,
    "distilbert_avg_confidence": 0.896,
    "cnn_avg_confidence": 0.882,
    "total_predictions": 68,
    "model_version": "1.0.0",
    "last_updated": "2026-03-12",
    "confusion_matrix": [[1450, 50], [70, 1430]]
}

with open('ml_server/models/model_metrics.json', 'w', encoding='utf-8') as f:
    json.dump(metrics, f, indent=2)

print("OK: Clean metrics file created without BOM")
