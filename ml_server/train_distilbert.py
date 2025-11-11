from transformers import DistilBertTokenizer, TFDistilBertForSequenceClassification
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from tf_keras.optimizers import Adam
import tensorflow as tf
import pandas as pd
import numpy as np

# -----------------------------
# 1️⃣ Load and preprocess data
# -----------------------------
df = pd.read_excel("data/Enphisim_dataset.xlsx")

df["__text_raw"] = (
    df["page_title"].fillna("") + " " +
    df["Hint"].fillna("") + " " +
    df["level_text"].fillna("")
)

data_rows = []
for _, row in df.iterrows():
    # ✅ Each append must be INSIDE the loop
    data_rows.append({
        "text": f"[TEXT] {row['__text_raw']} [OPTION] {row['correct_option']}",
        "label": "correct"
    })
    data_rows.append({
        "text": f"[TEXT] {row['__text_raw']} [OPTION] {row['neutral_option']}",
        "label": "neutral"
    })
    data_rows.append({
        "text": f"[TEXT] {row['__text_raw']} [OPTION] {row['wrong_option']}",
        "label": "wrong"
    })

dataset = pd.DataFrame(data_rows)

# ✅ Encode labels
label_map = {"correct": 0, "neutral": 1, "wrong": 2}
dataset["label"] = dataset["label"].map(label_map)

# -----------------------------
# 2️⃣ Train-test split
# -----------------------------
train_texts, test_texts, train_labels, test_labels = train_test_split(
    dataset["text"], dataset["label"], test_size=0.2, random_state=42
)

# -----------------------------
# 3️⃣ Tokenization
# -----------------------------
tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")

train_encodings = tokenizer(
    list(train_texts),
    truncation=True,
    padding=True,
    max_length=128,
    return_tensors="tf"
)

test_encodings = tokenizer(
    list(test_texts),
    truncation=True,
    padding=True,
    max_length=128,
    return_tensors="tf"
)

train_dataset = tf.data.Dataset.from_tensor_slices((dict(train_encodings), train_labels)).batch(8)
test_dataset = tf.data.Dataset.from_tensor_slices((dict(test_encodings), test_labels)).batch(8)

# -----------------------------
# 4️⃣ Model setup and training
# -----------------------------
model = TFDistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=3
)

model.compile(
    optimizer=Adam(learning_rate=2e-5),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.fit(train_dataset, validation_data=test_dataset, epochs=5)

# -----------------------------
# 5️⃣ Save model and tokenizer
# -----------------------------
model.save_pretrained("models/distilbert_options_model")
tokenizer.save_pretrained("models/distilbert_options_model")

# -----------------------------
# 6️⃣ Evaluate model
# -----------------------------
preds = model.predict(test_dataset)

# ✅ `preds` from TF models is a dict with logits key
pred_labels = np.argmax(preds.logits, axis=1)
true_labels = np.array(list(test_labels))

print("\nClassification Report:")
print(classification_report(true_labels, pred_labels, target_names=["correct", "neutral", "wrong"]))
