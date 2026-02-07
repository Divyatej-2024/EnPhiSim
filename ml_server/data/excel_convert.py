import pandas as pd

# Load the Excel file
df = pd.read_json("scenarios_simplified.json")

# Convert to JSON
df.to_excel("scenarios_simplified.xlsx", index=False)
