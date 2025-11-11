import pandas as pd

df = pd.read_excel("data/Enphisim_dataset.xlsx")
print(df.shape)
print(df.columns)
print(df.head(45).to_string())
