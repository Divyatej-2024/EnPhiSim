import pandas as pd
import re
from sklearn.preprocessing import LabelEncoder

# Load your custom dataset
df = pd.read_csv("data/Enphisim_dataset.xlsx")

# Clean the text
def clean_text(text):
    text = re.sub(r"http\S+", "", text)  # remove links
    text = re.sub(r"[^a-zA-Z ]", "", text)  # keep letters
    return text.lower().strip()

df["text"] = df["text"].apply(clean_text)

# Encode labels (phishing=1, legitimate=0)
encoder = LabelEncoder()
df["label"] = encoder.fit_transform(df["label"])

# Save processed data
df.to_csv("data/emails_clean.csv", index=False)
print("Custom dataset is finally, cleaned and saved as data/emails_clean.csv")
