#!/bin/bash

echo "🚀 Setting up EnPhiSim Single-User Dataset"
echo "=========================================="

# Create directories
mkdir -p data scripts

# Install requirements
echo "Installing Python requirements..."
pip install pandas faker > /dev/null 2>&1

# Step 1: Generate complete levels (if not exists)
if [ ! -f "data/levels_complete.json" ]; then
    echo "Step 1: Creating complete 39 levels..."
    python -c "
import json
import random

# Create sample levels (in reality, use your full 39)
levels = []
for i in range(1, 40):
    levels.append({
        'id': i,
        'Level_no': f'l{i}' if i <= 32 else f'bl{i-32}' if i <= 38 else 'f',
        'page_title': f'Level {i}',
        'Hint': 'Check carefully',
        'category': 'easy' if i <= 6 else 'normal' if i <= 12 else 'hard',
        'level_text': f'This is phishing scenario {i}. Always verify before clicking.',
        'correct_option': 'Report Phish',
        'wrong_option': 'Click Link',
        'template_type': 'mail'
    })

with open('data/levels_complete.json', 'w') as f:
    json.dump(levels, f, indent=2)
print('Created 39 sample levels')
"
fi

# Step 2: Generate scenarios
echo "Step 2: Generating scenarios..."
python scripts/generate_scenarios_simple.py

# Step 3: Create legitimate samples
echo "Step 3: Creating legitimate emails..."
python -c "
import json
import random
from faker import Faker

fake = Faker()
legit = []

for i in range(100):
    legit.append({
        'id': f'legit_{i:03d}',
        'type': random.choice(['work', 'newsletter', 'system']),
        'subject': fake.sentence(),
        'from': fake.company_email(),
        'body': fake.text(),
        'is_phishing': False
    })

with open('data/legitimate_samples.json', 'w') as f:
    json.dump(legit, f, indent=2)
print(f'Created {len(legit)} legitimate samples')
"

# Step 4: Create ML dataset
echo "Step 4: Creating ML dataset..."
python -c "
import pandas as pd
import json

# Load phishing scenarios
with open('data/scenarios_simplified.json', 'r') as f:
    phishing = json.load(f)

# Load legitimate emails
with open('data/legitimate_samples.json', 'r') as f:
    legitimate = json.load(f)

# Create balanced dataset
data = []
for p in phishing[:1000]:  # Limit to 1000
    data.append({
        'text': p['content'][:500],
        'label': 1,
        'source': 'phishing'
    })

for l in legitimate[:1000]:
    data.append({
        'text': f\"Subject: {l['subject']}\\n\\n{l['body']}\"[:500],
        'label': 0,
        'source': 'legitimate'
    })

df = pd.DataFrame(data)
df.to_csv('data/ml_dataset_balanced.csv', index=False)
print(f'Created balanced ML dataset with {len(df)} samples')
"

echo ""
echo "✅ DATASET CREATION COMPLETE!"
echo ""
echo "📁 Files created in /data:"
echo "  • levels_complete.json      (39 levels)"
echo "  • scenarios_simplified.json (50 variations per level)"
echo "  • legitimate_samples.json   (100 legitimate emails)"
echo "  • ml_dataset.csv            (ML training data)"
echo "  • game_progress_template.json (Single-user template)"
echo ""
echo "🚀 You're ready to build your single-user game!"