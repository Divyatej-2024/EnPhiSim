import os
import pandas as pd
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, Conv1D, GlobalMaxPooling1D, Dense, Dropout

# --- Load dataset ---
train = pd.read_excel('data/Enphisim_dataset.xlsx')

# --- Ensure text and label columns are clean ---
# Convert non-string or NaN values in 'level_text' to empty strings
train['level_text'] = train['level_text'].apply(lambda x: str(x) if isinstance(x, str) else "")

# Convert confidence column to numeric (0–1)
# If it's categorical (like "phish"/"safe"), map it accordingly
if train['confidence'].dtype == 'object':
    train['confidence'] = train['confidence'].map({'phish': 1, 'spam': 1, 'safe': 0, 'ham': 0}).fillna(0)
else:
    train['confidence'] = pd.to_numeric(train['confidence'], errors='coerce').fillna(0)

# --- Prepare data ---
max_words = 10000
max_len = 150

tokenizer = Tokenizer(num_words=max_words, oov_token="<UNK>")
tokenizer.fit_on_texts(train['level_text'])
sequences = tokenizer.texts_to_sequences(train['level_text'])
X = pad_sequences(sequences, maxlen=max_len)
y = train['confidence']

# --- Define CNN model ---
model = Sequential([
    Embedding(max_words, 128, input_length=max_len),
    Conv1D(64, 5, activation='relu'),
    GlobalMaxPooling1D(),
    Dense(64, activation='relu'),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

# --- Compile and train ---
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(X, y, epochs=5, batch_size=32, validation_split=0.2)

# --- Save model ---
os.makedirs('models', exist_ok=True)
model.save('models/cnn_model.h5')
print("CNN model trained and saved successfully!")
