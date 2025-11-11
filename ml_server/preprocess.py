import pandas as pd

def preprocess_txt(fil="data/Enphisim_dataset.xlsx"):
    # Load Excel file
    df = pd.read_excel(fil)

    # Combine all text info into a single column
    df["__text_raw"] = (
        df["page_title"].fillna("") + " " +
        df["Hint"].fillna("") + " " +
        df["level_text"].fillna("")
    )

    # Create training samples for each option
    data_rows = []
    for _, row in df.iterrows():
        # Each option becomes a separate training sample
        data_rows.append({"text": row["__text_raw"] + " " + str(row["correct_option"]), "label": "correct"})
        data_rows.append({"text": row["__text_raw"] + " " + str(row["neutral_option"]), "label": "neutral"})
        data_rows.append({"text": row["__text_raw"] + " " + str(row["wrong_option"]), "label": "wrong"})

    dataset = pd.DataFrame(data_rows)
    print("Training samples created:", len(dataset))
    print(dataset.head())

    return dataset
