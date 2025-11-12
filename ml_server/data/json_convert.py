import pandas as pd

# Load the Excel file
df = pd.read_excel("EnPhiSim_dataset.xlsx")

# Convert to JSON
df.to_json("EnPhiSim_dataset.json", orient="records", indent=2)
