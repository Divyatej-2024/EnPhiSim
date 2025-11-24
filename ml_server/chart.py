import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import classification_report, confusion_matrix
import numpy as np

# --- 1. SIMULATED CLASSIFICATION DATA ---
# Assuming 'correct', 'neutral', 'wrong' are the classes
classes = ["correct", "neutral", "wrong"]
num_samples = 100

# Create realistic, imbalanced true labels
true_labels = np.random.choice(classes, size=num_samples, p=[0.5, 0.3, 0.2])
# Create predicted labels (simulated with ~80% accuracy)
pred_labels = np.array([
    label if np.random.rand() < 0.8 else np.random.choice(classes)
    for label in true_labels
])

# Generate the classification report dictionary
report = classification_report(true_labels, pred_labels, output_dict=True, zero_division=0)

# --- 2. Bar Chart: Precision, Recall, F1-score per Class ---

precision = [report[c]["precision"] for c in classes]
recall = [report[c]["recall"] for c in classes]
f1 = [report[c]["f1-score"] for c in classes]

x = np.arange(len(classes))
width = 0.25

plt.figure(figsize=(10,6))
plt.bar(x - width, precision, width, label="Precision")
plt.bar(x, recall, width, label="Recall")
plt.bar(x + width, f1, width, label="F1-score")

plt.xticks(x, classes)
plt.ylabel("Score")
plt.ylim(0, 1)
plt.title("Precision, Recall, F1-score per Class")
plt.legend()
plt.grid(axis='y', linestyle='--')
plt.show()

# --- 3. Heatmap: Confusion Matrix ---

cm = confusion_matrix(true_labels, pred_labels, labels=classes)

plt.figure(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt="d",
            xticklabels=classes, yticklabels=classes, cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()

# --- 4. Line Chart: Accuracy over Epochs ---
# Simulated accuracy lists for 10 epochs
epochs = 10
train_acc_list = np.linspace(0.65, 0.95, epochs) + np.random.normal(0, 0.01, epochs)
val_acc_list = np.linspace(0.60, 0.88, epochs) + np.random.normal(0, 0.01, epochs)

plt.figure(figsize=(8,5))
plt.plot(train_acc_list, label="Train Accuracy")
plt.plot(val_acc_list, label="Validation Accuracy")
plt.xlabel("Epoch")
plt.ylabel("Accuracy")
plt.title("Accuracy over Epochs")
plt.legend()
plt.grid(True)
plt.show()

# --- 5. Bar Chart: Model Comparison (F1-scores) ---

models = ["CNN", "DistilBERT", "DistilBERT-CNN"]
f1_scores = [0.78, 0.85, 0.91]

plt.figure(figsize=(8,5))
bars = plt.bar(models, f1_scores, color=['skyblue', 'lightcoral', 'mediumseagreen'])
plt.ylabel("F1-score")
plt.title("Model Comparison")
plt.ylim(0,1)

# Add F1 score value labels on top of bars
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 0.01, round(yval, 2), ha='center', va='bottom')

plt.show()