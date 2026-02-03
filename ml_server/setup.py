"""
FIXED EnPhiSim Dataset Setup for Windows
Simple and guaranteed to work
"""

import json
import os
import random
import csv
from datetime import datetime

print("🚀 EnPhiSim Dataset Setup - Fixed Version")
print("=" * 50)

# Create directory
os.makedirs("data", exist_ok=True)

# =================== STEP 1: CREATE 39 LEVELS ===================

def create_complete_levels():
    """Create all 39 levels - SIMPLIFIED VERSION"""
    levels = []
    
    # ========== EASY LEVELS (1-6) ==========
    easy_levels = [
        {
            "page_title": "Mass Credential-Phish",
            "Hint": "Phish email",
            "from_and_to": "Security team to employee",
            "level_text": "URGENT: Your password expires in 24 hours! Click here to reset: https://secure-login-enphisim.com",
            "subj": "Password Expiry Notification",
            "wrong_option": "Click Link",
            "template": "mail"
        },
        {
            "page_title": "Scam Invoice/Payment reminder",
            "Hint": "Wrong invoice and payment reminder",
            "from_and_to": "Vendor to business",
            "level_text": "Invoice #INV-7842 for £299.99 is overdue. Pay immediately: https://pay-enphisim.com",
            "subj": "OVERDUE INVOICE - Immediate Action Required",
            "wrong_option": "Pay Invoice",
            "template": "mail"
        },
        {
            "page_title": "Fake Newsletter Subscription",
            "Hint": "Subscription you don't recall joining",
            "from_and_to": "Marketing to user",
            "level_text": "Welcome to TechInsider Pro! Confirm subscription: https://confirm-subscription-techinsider.net",
            "subj": "Confirm Your TechInsider Pro Subscription",
            "wrong_option": "Confirm Subscription",
            "template": "mail"
        },
        {
            "page_title": "Lottery / Prize Scam",
            "Hint": "Too good to be true",
            "from_and_to": "Contest to winner",
            "level_text": "CONGRATULATIONS! You've won £50,000! Claim: https://claim-prize-enphisim.net",
            "subj": "YOU ARE A WINNER! £50,000 Prize",
            "wrong_option": "Claim Prize",
            "template": "mail"
        },
        {
            "page_title": "Simple attachment Lure",
            "Hint": "Unexpected attachment",
            "from_and_to": "HR to employee",
            "level_text": "Please review attached policy document. Requires immediate attention.",
            "subj": "Important: Updated Company Policies",
            "wrong_option": "Open Attachment",
            "template": "mail"
        },
        {
            "page_title": "Basic Spoofed display-name senders",
            "Hint": "Mismatched Display Name and Address",
            "from_and_to": "CEO to employee",
            "level_text": "John, need urgent payment processed. I'm in meetings, email confirmation.",
            "subj": "Urgent Payment Request",
            "wrong_option": "Process Payment",
            "template": "mail"
        }
    ]
    
    # Create easy levels (1-6)
    for i, easy_data in enumerate(easy_levels, 1):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": easy_data["page_title"],
            "Hint": easy_data["Hint"],
            "category": "easy",
            "from_and_to": easy_data["from_and_to"],
            "phish_email": f"fake{i}@enphisim-phish.com",
            "crct_email": f"real{i}@enphisim.com",
            "level_text": easy_data["level_text"],
            "subj": easy_data["subj"],
            "correct_option": "Report Phish",
            "neutral_option": "Ignore",
            "wrong_option": easy_data["wrong_option"],
            "template_type": easy_data["template"],
            "difficulty": 0.2 + (i * 0.02)
        })
    
    # ========== ADVANCED EASY (7-12) ==========
    advanced_easy = [
        ("TypoSquatted Domain Phish", "Check domain carefully", "mail"),
        ("URL Shortener Redirected Phish", "Links are obscured", "browser"),
        ("Malicious survey request", "Asks sensitive questions", "mail"),
        ("SMS (Smishing) generic link", "Unsolicited text with link", "message"),
        ("Fake social media notification", "Wrong domain", "notification"),
        ("Clone of public service alert", "Unexpected government notice", "mail")
    ]
    
    for i, (title, hint, template) in enumerate(advanced_easy, 7):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": title,
            "Hint": hint,
            "category": "advanced_easy",
            "from_and_to": "Various to user",
            "phish_email": f"phish{i}@fake-domain.com",
            "crct_email": f"real@enphisim.com",
            "level_text": f"This is {title.lower()}. Always verify before clicking links.",
            "subj": f"Important: {title}",
            "correct_option": "Report Phish",
            "neutral_option": "Investigate",
            "wrong_option": "Trust and Proceed",
            "template_type": template,
            "difficulty": 0.35
        })
    
    # ========== NORMAL (13-18) ==========
    for i in range(13, 19):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": f"Spear-Phishing Attack {i-12}",
            "Hint": "Personalized attack with your details",
            "category": "normal",
            "from_and_to": "Attacker to specific target",
            "phish_email": f"personal{i}@targeted-attack.com",
            "crct_email": f"colleague@enphisim.com",
            "level_text": f"Hi, I noticed you're working on project X. Can you review this document?",
            "subj": "Regarding our project collaboration",
            "correct_option": "Verify Sender",
            "neutral_option": "Check with Team",
            "wrong_option": "Open Document",
            "template_type": "mail",
            "difficulty": 0.5
        })
    
    # ========== PRE-HARD (19-24) ==========
    for i in range(19, 25):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": f"Business Compromise {i-18}",
            "Hint": "Urgent financial request with changed procedures",
            "category": "pre_hard",
            "from_and_to": "Executive to finance",
            "phish_email": f"executive{i}@company-wire.com",
            "crct_email": f"executive@enphisim.com",
            "level_text": "Need urgent wire transfer for acquisition. New bank details attached.",
            "subj": "URGENT: Wire Transfer Required",
            "correct_option": "Call to Confirm",
            "neutral_option": "Forward to Finance",
            "wrong_option": "Process Transfer",
            "template_type": "mail",
            "difficulty": 0.65
        })
    
    # ========== HARD (25-29) ==========
    for i in range(25, 30):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": f"Advanced Attack {i-24}",
            "Hint": "Compromised internal account",
            "category": "hard",
            "from_and_to": "Compromised colleague",
            "phish_email": f"legit.user@enphisim.com",  # Actually compromised
            "crct_email": f"legit.user@enphisim.com",
            "level_text": "Can you check these financial figures? The file is on our secure share.",
            "subj": "Financial review needed",
            "correct_option": "Verify in Person",
            "neutral_option": "Check Share Manually",
            "wrong_option": "Open Shared File",
            "template_type": "mail",
            "difficulty": 0.8
        })
    
    # ========== ADVANCED HARD (30-32) ==========
    for i in range(30, 33):
        levels.append({
            "id": i,
            "Level_no": f"l{i}",
            "page_title": f"AI-Generated Phishing {i-29}",
            "Hint": "Perfect language and strong context",
            "category": "advanced_hard",
            "from_and_to": "AI assistant to user",
            "phish_email": f"assistant{i}@smart-service.com",
            "crct_email": f"assistant@enphisim.com",
            "level_text": "Based on your recent activity, we detected unusual patterns. Please verify: https://security-check-ai.com",
            "subj": "Security Pattern Analysis",
            "correct_option": "Check Official Portal",
            "neutral_option": "Monitor Account",
            "wrong_option": "Verify via Link",
            "template_type": "mail",
            "difficulty": 0.9
        })
    
    # ========== BONUS LEVELS (33-38) ==========
    animals = [
        ("Eagle", "Logo clarity - Spot fake brands"),
        ("Monkey", "Visual bait - Click curiosity"),
        ("Turtle", "Slow review - Check URLs carefully"),
        ("Shark", "Aggressive urgency - Pressure tactics"),
        ("Elephant", "Memory - Brand recognition"),
        ("HoneyBee", "Social proof - Fake testimonials")
    ]
    
    for i, (animal, concept) in enumerate(animals, 1):
        levels.append({
            "id": 32 + i,
            "Level_no": f"bl{i}",
            "page_title": animal,
            "Hint": f"{animal}'s approach to security",
            "category": "bonus",
            "from_and_to": "Nature-Technology analogy",
            "level_text": f"{animal.upper()} LESSON:\n{concept}\n\nLike {animal.lower()}s, good security requires attention to detail.",
            "correct_option": "Next",
            "neutral_option": "Skip",
            "wrong_option": "Download Image",
            "template_type": "image",
            "difficulty": 0.1
        })
    
    # ========== FINAL LEVEL (39) ==========
    levels.append({
        "id": 39,
        "Level_no": "f",
        "page_title": "Advanced Persistent Phishing",
        "Hint": "Multiple sophisticated techniques combined",
        "category": "final",
        "from_and_to": "Advanced attacker to high-value target",
        "phish_email": "security@enphisim-legit.com",  # Looks legitimate
        "crct_email": "security@enphisim.com",
        "level_text": "Critical security update required. Your account shows compromise indicators. Complete verification: https://security-portal-enphisim.com/verify\n\nThis is time-sensitive - failure may result in account suspension.",
        "subj": "CRITICAL: Account Security Breach Detected",
        "correct_option": "Contact Security Directly",
        "neutral_option": "Check Internal Alerts",
        "wrong_option": "Complete Verification",
        "template_type": "mail+browser",
        "difficulty": 0.95
    })
    
    # Save to file
    with open("data/levels_complete.json", "w", encoding="utf-8") as f:
        json.dump(levels, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {len(levels)} complete levels")
    return levels

# =================== STEP 2: CREATE SCENARIOS ===================

def create_scenarios(levels):
    """Create simple scenarios for each level"""
    scenarios = []
    
    print("Creating scenario variations...")
    
    for level in levels:
        # Only create for phishing levels (not bonus)
        if level["Level_no"].startswith(("l", "f")):
            for i in range(200):  # Reduced to 10 variations per level for speed
                # Simple content creation without complex templates
                if level["template_type"] == "mail":
                    content = f"""From: {level["phish_email"]}
To: user@company.com
Subject: {level["subj"]}

{level["level_text"]}

- Support Team"""
                
                elif level["template_type"] == "message":
                    content = f"""📱 Message: {level["level_text"]}
From: +44{random.randint(700000000, 799999999)}"""
                
                elif level["template_type"] == "browser":
                    content = f"""🌐 Website: {level["level_text"]}
URL: https://verify-{level["id"]}.com"""
                
                else:
                    content = level["level_text"]
                
                # Add variations
                if i % 3 == 0:
                    content = "🚨 URGENT: " + content
                if i % 5 == 0:
                    content = content.replace("your", "ur").replace("please", "plz")
                
                scenario = {
                    "id": f"{level['Level_no']}_v{i:03d}",
                    "level_id": level["id"],
                    "level_no": level["Level_no"],
                    "content": content,
                    "correct_action": level["correct_option"],
                    "wrong_action": level["wrong_option"],
                    "neutral_action": level.get("neutral_option", "Ignore"),
                    "difficulty": level["difficulty"],
                    "created": datetime.now().isoformat()
                }
                
                scenarios.append(scenario)
            
            print(f"  ✅ {level['Level_no']}: 10 scenarios")
    
    # Save scenarios
    with open("data/scenarios_simplified.json", "w", encoding="utf-8") as f:
        json.dump(scenarios, f, indent=2, ensure_ascii=False)
    
    print(f"📊 Total scenarios: {len(scenarios)}")
    return scenarios

# =================== STEP 3: CREATE LEGITIMATE EMAILS ===================

def create_legitimate_samples():
    """Create legitimate email samples"""
    print("Creating legitimate emails...")
    
    legitimate = []
    
    # Simple legitimate emails
    for i in range(50):  # Reduced to 50 for speed
        legitimate.append({
            "id": f"legit_{i:03d}",
            "type": "work",
            "subject": f"Meeting notes {i}",
            "from": f"colleague{i}@enphisim.com",
            "body": f"Hi team,\n\nPlease find attached the meeting notes.\n\nBest regards,\nColleague {i}",
            "is_phishing": False
        })
    
    # Save
    with open("data/legitimate_samples.json", "w", encoding="utf-8") as f:
        json.dump(legitimate, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Created {len(legitimate)} legitimate emails")
    return legitimate

# =================== STEP 4: CREATE ML DATASET ===================

def create_ml_dataset(scenarios, legitimate):
    """Create CSV for ML training"""
    print("Creating ML training dataset...")
    
    with open("data/ml_dataset.csv", "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["id", "text", "label"])
        
        # Add phishing scenarios (label = 1)
        for scenario in scenarios[:100]:  # Limit to 100
            writer.writerow([
                scenario["id"],
                scenario["content"][:200],  # First 200 chars
                1  # Phishing
            ])
        
        # Add legitimate emails (label = 0)
        for email in legitimate[:100]:  # Limit to 100
            text = f"Subject: {email['subject']}\n\n{email['body']}"
            writer.writerow([
                email["id"],
                text[:200],
                0  # Legitimate
            ])
    
    print("✅ Created ml_dataset.csv with 200 samples")

# =================== STEP 5: CREATE GAME PROGRESS TEMPLATE ===================

def create_game_template():
    """Create single-user game progress template"""
    template = {
        "game_version": "1.0",
        "current_level": 1,
        "total_score": 0,
        "levels_completed": [],
        "created": datetime.now().isoformat()
    }
    
    with open("data/game_progress_template.json", "w", encoding="utf-8") as f:
        json.dump(template, f, indent=2)
    
    print("✅ Created game progress template")

# =================== MAIN FUNCTION ===================

def main():
    """Main setup function"""
    try:
        print("\n" + "="*50)
        print("STEP 1: Creating 39 levels...")
        levels = create_complete_levels()
        
        print("\n" + "="*50)
        print("STEP 2: Creating scenario variations...")
        scenarios = create_scenarios(levels)
        
        print("\n" + "="*50)
        print("STEP 3: Creating legitimate emails...")
        legitimate = create_legitimate_samples()
        
        print("\n" + "="*50)
        print("STEP 4: Creating ML training dataset...")
        create_ml_dataset(scenarios, legitimate)
        
        print("\n" + "="*50)
        print("STEP 5: Creating game template...")
        create_game_template()
        
        print("\n" + "="*50)
        print("🎉 DATASET CREATION COMPLETE!")
        print("="*50)
        print("\n📁 Files created in /data:")
        print("  • levels_complete.json")
        print("  • scenarios_simplified.json")
        print("  • legitimate_samples.json")
        print("  • ml_dataset.csv")
        print("  • game_progress_template.json")
        print("\n🚀 Ready to build your EnPhiSim game!")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nCreating minimal dataset instead...")
        create_minimal_dataset()

def create_minimal_dataset():
    """Create minimal dataset if main function fails"""
    levels = [
        {
            "id": 1,
            "Level_no": "l1",
            "page_title": "Test Phishing",
            "level_text": "URGENT: Click here to reset password: https://fake-link.com",
            "correct_option": "Report Phish",
            "wrong_option": "Click Link",
            "difficulty": 0.3
        }
    ]
    
    with open("data/levels_complete.json", "w") as f:
        json.dump(levels, f, indent=2)
    
    print("✅ Created minimal dataset with 1 level")
    print("🎯 Now you can start building your game!")

# =================== RUN SCRIPT ===================

if __name__ == "__main__":
    main()
    input("\nPress Enter to exit...")