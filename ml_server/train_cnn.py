import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout

# Load dataset
df = pd.read_excel("data/Enphisim_dataset.xlsx")
df["__text_raw"] = (
    df["page_title"].fillna("") + " " +
    df["Hint"].fillna("") + " " +
    df["level_text"].fillna("")
)

data_rows = []
for _, row in df.iterrows():
    data_rows.append({"text": row["__text_raw"] + " " + str(row["correct_option"]), "label": "correct"})
    data_rows.append({"text": row["__text_raw"] + " " + str(row["neutral_option"]), "label": "neutral"})
    data_rows.append({"text": row["__text_raw"] + " " + str(row["wrong_option"]), "label": "wrong"})

dataset = pd.DataFrame(data_rows)

label_map = {"correct": 0, "neutral": 1, "wrong": 2}
dataset["label"] = dataset["label"].map(label_map)

# Split
train_texts, test_texts, train_labels, test_labels = train_test_split(
    dataset["text"], dataset["label"], test_size=0.2, random_state=42
)

# Tokenize
tokenizer = Tokenizer(num_words=5000, oov_token="<OOV>")
tokenizer.fit_on_texts(train_texts)
train_sequences = pad_sequences(tokenizer.texts_to_sequences(train_texts), maxlen=128)
test_sequences = pad_sequences(tokenizer.texts_to_sequences(test_texts), maxlen=128)

# CNN model
model = Sequential([
    Embedding(input_dim=5000, output_dim=128, input_length=128),
    Conv1D(128, 5, activation='relu'),
    GlobalMaxPooling1D(),
    Dropout(0.5),
    Dense(64, activation='relu'),
    Dense(3, activation='softmax')
])

model.compile(loss="sparse_categorical_crossentropy", optimizer="adam", metrics=["accuracy"])
model.fit(train_sequences, train_labels, validation_data=(test_sequences, test_labels), epochs=5, batch_size=8)

model.save("models/cnn_options_model.h5")
print("CNN model saved successfully.")
