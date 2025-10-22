# ml-server/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
from utils.preprocess import preprocess_text

DATA_PATH = 'data/processed/cleaned_dataset.csv'  # ensure you create this

os.makedirs('model', exist_ok=True)

df = pd.read_csv(DATA_PATH)
df['text'] = df['text'].fillna('').apply(preprocess_text)
df['label_num'] = df['label'].map({'phishing':1,'legitimate':0})

X_train, X_test, y_train, y_test = train_test_split(df['text'], df['label_num'], test_size=0.2, random_state=42, stratify=df['label_num'])

vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

clf = RandomForestClassifier(n_estimators=200, random_state=42, n_jobs=-1)
clf.fit(X_train_vec, y_train)

preds = clf.predict(X_test_vec)
print("Accuracy:", accuracy_score(y_test, preds))
print(classification_report(y_test, preds))

joblib.dump(clf, 'model/phishing_model.pkl')
joblib.dump(vectorizer, 'model/vectorizer.pkl')
print("Saved model and vectorizer")
