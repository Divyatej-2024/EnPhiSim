import pandas as pd
import os

# Path setup
DATA_PATH = os.path.join("data", "Enphisim_dataset.xlsx")
OUTPUT_PATH = os.path.join("data", "processed_dataset.csv")

def preprocess_dataset():
    # 1. Load Excel file
    print("Loading dataset...")
    df = pd.read_excel(DATA_PATH)

    print(f"Initial shape: {df.shape}")

    # 2. Clean column names
    df.columns = [c.strip().lower() for c in df.columns]

    # 3. Handle missing values
    df = df.fillna({
        "page_title": "unknown",
        "screenshot_path": "missing",
        "html_path": "missing",
        "confidence": 0.0,
        "level_type": "unknown",
        "random_level": "no"
    })

    # 4. Convert level_no to string
    df["level_no"] = df["level_no"].astype(str)

    # 5. Normalize text fields (remove extra spaces, lowercase)
    text_cols = ["page_title", "level_type", "random_level"]
    for col in text_cols:
        df[col] = df[col].astype(str).str.strip().str.lower()

    # 6. Remove duplicates (if any)
    df = df.drop_duplicates()

    # 7. Save processed version
    os.makedirs("data", exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Processed dataset saved to {OUTPUT_PATH}")
    print(df.head())

if __name__ == "__main__":
    preprocess_dataset()
