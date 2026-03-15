# Sections: imports, configuration, helpers, main

import pandas as pd

# Load the Excel file
df = pd.read_json("EnPhiSim_dataset.json")

# Convert to JSON
df.to_excel("EnPhiSim_dataset.xlsx", index=False)
