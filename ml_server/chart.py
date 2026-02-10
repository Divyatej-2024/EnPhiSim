import matplotlib
matplotlib.use("Agg")  # server-safe backend

from matplotlib import pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np
import json
import os

# -----------------------------
# 1. LOAD JSON DATA
# -----------------------------

JSON_FILE = "data/scenarios_simplified.json"

if not os.path.exists(JSON_FILE):
    raise FileNotFoundError(f"{JSON_FILE} not found")

with open(JSON_FILE, "r") as f:
    data = json.load(f)

true_labels = []
pred_labels = []

for item in data:
    # Expected action is always "correct"
    true_labels.append("correct")

    # Map user action to label
    if item["user_action"] == item["correct_action"]:
        pred_labels.append("correct")
    elif item["user_action"] == item["neutral_action"]:
        pred_labels.append("neutral")
    else:
        pred_labels.append("wrong")

true_labels = np.array(true_labels)
pred_labels = np.array(pred_labels)

classes = ["correct", "neutral", "wrong"]

assert len(true_labels) == len(pred_labels), "Label count mismatch"

# -----------------------------
# 2. CLASSIFICATION REPORT
# -----------------------------

report = classification_report(
    true_labels,
    pred_labels,
    labels=classes,
    output_dict=True,
    zero_division=0
)

precision = [report[c]["precision"] for c in classes]
recall = [report[c]["recall"] for c in classes]
f1 = [report[c]["f1-score"] for c in classes]

# -----------------------------
# 3. METRICS BAR CHART
# -----------------------------

x = np.arange(len(classes))
width = 0.25

plt.figure(figsize=(10, 6))
plt.bar(x - width, precision, width, label="Precision")
plt.bar(x, recall, width, label="Recall")
plt.bar(x + width, f1, width, label="F1-score")

plt.xticks(x, classes)
plt.ylabel("Score")
plt.ylim(0, 1)
plt.title("User Response Classification Performance")
plt.legend()
plt.grid(axis="y", linestyle="--")
plt.tight_layout()
plt.savefig("metrics_bar.png")
plt.close()

# -----------------------------
# 4. CONFUSION MATRIX
# -----------------------------

cm = confusion_matrix(true_labels, pred_labels, labels=classes)

plt.figure(figsize=(6, 5))
plt.imshow(cm)
plt.colorbar()
plt.xticks(range(len(classes)), classes)
plt.yticks(range(len(classes)), classes)

for i in range(len(classes)):
    for j in range(len(classes)):
        plt.text(j, i, cm[i, j], ha="center", va="center")

plt.xlabel("Predicted Action")
plt.ylabel("Expected Action")
plt.title("Confusion Matrix – Phishing Response")
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.close()

print("Charts generated successfully from scenario JSON.")
