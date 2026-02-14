"""
Unified EnPhiSim Dataset Generator
Compliant with Teesside University FYP proposal & ethics
Generates one JSON file containing all levels, scenarios, taxonomy, and ML placeholders
"""

import json
import os
import random
from datetime import datetime

# Ensure data folder exists
os.makedirs("data", exist_ok=True)

# =================== PHISHING TAXONOMY ===================
taxonomies = [
    "Credential Phishing",
    "Financial Fraud",
    "Social Engineering",
    "Messaging Attacks",
    "AI-Based Attacks",
]

# =================== LEVEL DEFINITIONS ===================
base_levels = [
    {"title": "Mass Credential-Phish", "hint": "Phish email", "template": "mail", "category": "easy", "taxonomy": "Credential Phishing"},
    {"title": "Scam Invoice/Payment reminder", "hint": "Wrong invoice", "template": "mail", "category": "easy", "taxonomy": "Financial Fraud"},
    {"title": "Fake Newsletter Subscription", "hint": "Subscription spam", "template": "mail", "category": "easy", "taxonomy": "Social Engineering"},
    {"title": "Lottery / Prize Scam", "hint": "Too good to be true", "template": "mail", "category": "easy", "taxonomy": "Financial Fraud"},
    {"title": "Simple attachment Lure", "hint": "Unexpected attachment", "template": "mail", "category": "easy", "taxonomy": "Messaging Attacks"},
    {"title": "Basic Spoofed display-name senders", "hint": "Mismatched sender", "template": "mail", "category": "easy", "taxonomy": "Credential Phishing"},
]

advanced_easy = [
    ("TypoSquatted Domain Phish", "Check domain carefully", "mail", "Credential Phishing"),
    ("URL Shortener Redirected Phish", "Links are obscured", "browser", "Credential Phishing"),
    ("Malicious survey request", "Asks sensitive questions", "mail", "Social Engineering"),
    ("SMS (Smishing) generic link", "Unsolicited text", "message", "Messaging Attacks"),
    ("Fake social media notification", "Wrong domain", "notification", "Messaging Attacks"),
    ("Clone of public service alert", "Unexpected notice", "mail", "Social Engineering"),
]

normal_levels = [
    ("Spear-Phishing Attack", "Personalized attack", "mail", "Credential Phishing"),
    ("Business Compromise", "Urgent financial request", "mail", "Financial Fraud"),
    ("Advanced Attack", "Compromised internal account", "mail", "Credential Phishing"),
    ("AI-Generated Phishing", "Perfect language & context", "mail", "AI-Based Attacks"),
]

bonus_levels = [
    ("Eagle", "Spot fake brands"),
    ("Monkey", "Click curiosity"),
    ("Turtle", "Check URLs carefully"),
    ("Shark", "Pressure tactics"),
    ("Elephant", "Brand recognition"),
    ("HoneyBee", "Fake testimonials"),
]

# =================== CREATE UNIFIED DATASET ===================
dataset = []

# Unique scenario counter
scenario_counter = 1

# Helper function to create scenario variations
def create_scenarios(level_info, num_variations=200):
    global scenario_counter
    scenarios = []
    for i in range(num_variations):
        content = f"{level_info['title']} Scenario {i+1}: {level_info['hint']}"
        # Add randomness
        if i % 3 == 0:
            content = "🚨 URGENT: " + content
        if i % 5 == 0:
            content = content.replace("your", "ur").replace("please", "plz")
        if i % 7 == 0:
            content += f" [Ref: {random.randint(1000,9999)}]"

        scenario = {
            "scenario_id": f"sc{scenario_counter:05d}",
            "level_no": level_info['level_no'],
            "title": level_info['title'],
            "content": content,
            "category": level_info['category'],
            "template": level_info['template'],
            "taxonomy": level_info['taxonomy'],
            "correct_action": level_info['correct_option'],
            "neutral_action": level_info['neutral_option'],
            "wrong_action": level_info['wrong_option'],
            "difficulty": level_info['difficulty'],
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None,
        }
        scenarios.append(scenario)
        scenario_counter += 1
    return scenarios

# =================== EASY LEVELS ===================
for i, lvl in enumerate(base_levels, start=1):
    level_no = f"l{i}"
    level_info = {
        "level_no": level_no,
        "title": lvl["title"],
        "hint": lvl["hint"],
        "category": lvl["category"],
        "template": lvl["template"],
        "taxonomy": lvl["taxonomy"],
        "correct_option": "Report Phish",
        "neutral_option": "Ignore",
        "wrong_option": "Trust & Click",
        "difficulty": round(0.2 + i*0.02, 2),
    }
    dataset.extend(create_scenarios(level_info, num_variations=200))

# =================== ADVANCED EASY LEVELS ===================
for i, (title, hint, template, taxonomy) in enumerate(advanced_easy, start=7):
    level_no = f"l{i}"
    level_info = {
        "level_no": level_no,
        "title": title,
        "hint": hint,
        "category": "advanced_easy",
        "template": template,
        "taxonomy": taxonomy,
        "correct_option": "Report Phish",
        "neutral_option": "Investigate",
        "wrong_option": "Trust & Proceed",
        "difficulty": 0.35,
    }
    dataset.extend(create_scenarios(level_info, num_variations=200))

# =================== NORMAL, PRE-HARD, HARD, ADVANCED HARD ===================
all_complex_levels = normal_levels * 5  # duplicate to get enough IDs
for i, (title, hint, template, taxonomy) in enumerate(all_complex_levels, start=13):
    level_no = f"l{i}"
    level_info = {
        "level_no": level_no,
        "title": f"{title} {i}",
        "hint": hint,
        "category": "complex",
        "template": template,
        "taxonomy": taxonomy,
        "correct_option": "Verify Sender",
        "neutral_option": "Check Carefully",
        "wrong_option": "Open / Trust",
        "difficulty": round(0.5 + (i*0.01), 2),
    }
    dataset.extend(create_scenarios(level_info, num_variations=200))

# =================== BONUS LEVELS ===================
for i, (title, hint) in enumerate(bonus_levels, start=1):
    level_no = f"bl{i}"
    level_info = {
        "level_no": level_no,
        "title": title,
        "hint": hint,
        "category": "bonus",
        "template": "image",
        "taxonomy": "Cognitive Reinforcement",
        "correct_option": "Next",
        "neutral_option": "Skip",
        "wrong_option": "Download",
        "difficulty": 0.1,
    }
    dataset.extend(create_scenarios(level_info, num_variations=50))

# =================== FINAL LEVEL ===================
level_info = {
    "level_no": "f",
    "title": "Advanced Persistent Phishing",
    "hint": "Multiple sophisticated techniques combined",
    "category": "final",
    "template": "mail+browser",
    "taxonomy": "AI-Based Attacks",
    "correct_option": "Contact Security Directly",
    "neutral_option": "Monitor Carefully",
    "wrong_option": "Complete Verification",
    "difficulty": 0.95,
}
dataset.extend(create_scenarios(level_info, num_variations=200))

# =================== SAVE UNIFIED DATASET ===================
with open("data/enphisim_dataset.json", "w", encoding="utf-8") as f:
    json.dump(dataset, f, indent=2, ensure_ascii=False)

print(f"✅ Unified dataset created with {len(dataset)} scenarios")
print("📁 File: data/enphisim_dataset.json")