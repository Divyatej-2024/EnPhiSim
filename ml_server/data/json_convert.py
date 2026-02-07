import pandas as pd

# Load the Excel file
df = pd.read_excel("scenarios_simplified.xlsx")

# Convert to JSON
df.to_json("scenarios_simplified.json", orient="records", indent=2)
