import os
import pandas as pd
import numpy as np
import tensorflow as tf
from transformers import DistilBertTokenizerFast, TFDistilBertForSequenceClassification
from sklearn.model_selection import train_test_split

# Config
IN_PATH = os.path.join("data", "Enphisim_dataset.xlsx")
OUT_DIR = os.path.join("models", "distilbert_model")
MODEL_NAME = "distilbert-base-uncased"
MAX_LEN = 128
BATCH_SIZE = 8
EPOCHS = 3
LEARNING_RATE = 3e-5
SEED = 42

os.makedirs(OUT_DIR, exist_ok=True)
tf.random.set_seed(SEED)


def find_columns(df):
    text_candidates = [c for c in df.columns if any(k in c.lower() for k in (
        "text", "email", "body", "message", "level_text", "content", "msg",
        "message_text", "level", "description", "page_title"
    ))]
    label_candidates = [c for c in df.columns if any(k in c.lower() for k in (
        "label", "class", "target", "category", "confidence", "type", "status"
    ))]
    text_col = text_candidates[0] if text_candidates else None
    label_col = label_candidates[0] if label_candidates else None
    return text_col, label_col


def normalize_label_series(s):
    s = s.astype(str).str.lower().str.strip()
    mapping = {
        'phish': 1, 'phishing': 1, 'spam': 1, 'malicious': 1, 'scam': 1, 'fake': 1,
        'spear-phishing': 1, 'spear': 1, 'smishing': 1, 'vishing': 1, 'quishing': 1,
        'credential-harvest': 1, 'credential': 1, 'invoice': 1, 'survey': 1, 'attachment': 1,
        'bec': 1, 'business email compromise': 1, 'whaling': 1, 'url': 1, 'typo': 1, 'homograph': 1,
        # safe / legit
        'legitimate': 0, 'ham': 0, 'safe': 0, 'benign': 0, 'not_phish': 0, 'clean': 0
    }

    def map_val(v):
        v = str(v).strip().lower()
        if v in ("1", "0"):
            return int(v)
        if v.isdigit():
            return int(v)
        if v in mapping:
            return mapping[v]
        for k, val in mapping.items():
            if k in v:
                return val
        return None

    return s.map(map_val)


def load_and_prepare():
    df = pd.read_excel(IN_PATH)
    print("Raw dataset shape:", df.shape)
    print("Columns:", df.columns.tolist())

    # choose text column: prefer level_text, fallback to page_title
    text_col = "level_text" if "level_text" in df.columns else None
    if not text_col and "page_title" in df.columns:
        text_col = "page_title"

    # label column detection
    label_col = None
    for c in df.columns:
        if any(k in c.lower() for k in ("label", "class", "target", "category", "confidence", "type", "status")):
            label_col = c
            break

    # Extract text safely
    df['__text_raw'] = df[text_col].astype(str).str.strip() if text_col else ""
    if "page_title" in df.columns:
        empty_mask = df['__text_raw'].replace("", np.nan).isna()
        df.loc[empty_mask, '__text_raw'] = df.loc[empty_mask, 'page_title'].astype(str).str.strip()

    # Label logic
    if label_col:
        labels = normalize_label_series(df[label_col])
        df['__label'] = labels
    else:
        phishing_keywords = [
            'phish', 'phishing', 'scam', 'fake', 'malicious', 'invoice', 'credential',
            'survey', 'attachment', 'spear', 'spoof', 'vishing', 'smishing', 'quish',
            'qrcode', 'url', 'typo', 'homograph', 'bec', 'whaling', 'account takeover',
            'deepfake', 'exfiltration'
        ]
        baseline_names = {'eagle', 'monkey', 'turtle', 'shark', 'elephant', 'honeybee', 'advanced persistent phishing'}

        def auto_label(row):
            title = str(row.get('page_title', '') or "").lower()
            text = str(row.get('__text_raw', '') or "").lower()

            if not title and not text:
                return np.nan

            if any(b in title for b in baseline_names):
                return 0

            if any(kw in title or kw in text for kw in phishing_keywords):
                return 1

            if 'persistent' in title or 'final' in title:
                return 1

            # default to legitimate if nothing matches
            return 0

        df['__label'] = df.apply(auto_label, axis=1)

    # Clean up rows
    df = df[df['__text_raw'].replace("", np.nan).notna()].copy()
    df = df[df['__label'].notnull()].copy()
    df['__label'] = df['__label'].astype(int)

    texts = df['__text_raw'].astype(str).tolist()
    labels = df['__label'].tolist()

    print(df[['page_title', '__text_raw', '__label']].head(15))
    print(f"After preprocessing: {len(df)} samples ({df['__label'].sum()} phishing / {len(df) - df['__label'].sum()} legitimate)")

    out_path = os.path.join("data", "Enphisim_dataset_labeled.xlsx")
    try:
        df[['id', 'Level_no', 'page_title', '__text_raw', '__label']].to_excel(out_path, index=False)
        print("Saved auto-labelled preview to:", out_path)
    except Exception as e:
        print("Could not save preview file:", e)

    return texts, labels


def make_dataset(texts, labels, tokenizer, max_len, batch_size, shuffle=True):
    enc = tokenizer(texts, truncation=True, padding='max_length', max_length=max_len)
    dataset = tf.data.Dataset.from_tensor_slices((dict(enc), labels))
    if shuffle:
        dataset = dataset.shuffle(2048, seed=SEED)
    return dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)


def main():
    print("Loading data from:", IN_PATH)
    texts, labels = load_and_prepare()
    print("Total samples:", len(texts))

    if len(texts) == 0:
        print("No data available after preprocessing. Check your dataset or labelling logic.")
        return

    train_texts, val_texts, train_labels, val_labels = train_test_split(
        texts, labels, test_size=0.1, random_state=SEED, stratify=labels
    )

    print("Loading tokenizer and model:", MODEL_NAME)
    tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_NAME)
    model = TFDistilBertForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=2)

    train_ds = make_dataset(train_texts, np.array(train_labels, dtype=np.int32), tokenizer, MAX_LEN, BATCH_SIZE, shuffle=True)
    val_ds = make_dataset(val_texts, np.array(val_labels, dtype=np.int32), tokenizer, MAX_LEN, BATCH_SIZE, shuffle=False)

    optimizer = tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE)
    loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
    metrics = [tf.keras.metrics.SparseCategoricalAccuracy(name='accuracy')]

    model.compile(optimizer=optimizer, loss=loss, metrics=metrics)

    print("Starting training...")
    history = model.fit(train_ds, validation_data=val_ds, epochs=EPOCHS)

    print("Saving model to:", OUT_DIR)
    model.save_pretrained(OUT_DIR)
    tokenizer.save_pretrained(OUT_DIR)
    print("DistilBERT model saved.")


if __name__ == "__main__":
    main()
