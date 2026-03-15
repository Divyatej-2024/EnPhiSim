# Sections: imports, configuration, helpers, main

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

# =================== HELPER FUNCTIONS ===================
def generate_email_content(title, hint, ref_num):
    """Generate realistic email content with proper fields"""
    domains = ["company.com", "organization.org", "service.net", "portal.info"]
    fake_domains = ["company.co", "org-secure.com", "service-login.net", "verify-portal.info"]
    
    sender_name = random.choice(["Security Team", "IT Support", "Admin", "Notification Service"])
    sender_domain = random.choice(domains)
    fake_domain = random.choice(fake_domains)
    
    return {
        "from_address": f"\"{sender_name}\" <{sender_name.lower().replace(' ', '.')}@{sender_domain}>",
        "reply_to": f"support@{fake_domain}",
        "to_address": "employee@company.com",
        "crct_mail": f"support@{sender_domain}",
        "phish_email": f"support@{fake_domain}",
        "body_html": f"<p><strong>URGENT:</strong> {hint}. <a href='http://{fake_domain}/verify'>Click here to verify</a></p>",
        "body_text": f"URGENT: {hint}. Click here to verify: http://{fake_domain}/verify",
        "links": [f"http://{fake_domain}/verify"],
        "has_attachment": random.choice([True, False]),
        "attachments": [{"name": "invoice.pdf", "type": "application/pdf", "size": "124KB"}] if random.choice([True, False]) else []
    }

def generate_browser_content(title, hint, ref_num):
    """Generate realistic browser redirect content"""
    shorteners = ["bit.ly", "tinyurl.com", "short.link", "goo.gl"]
    fake_domains = ["secure-login.com", "account-verify.net", "document-share.ai"]
    
    short_service = random.choice(shorteners)
    fake_domain = random.choice(fake_domains)
    short_code = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=8))
    
    return {
        "from_address": None,
        "reply_to": None,
        "to_address": None,
        "crct_mail": "support@enphisim.vercel.app",
        "phish_email": "supp0rt@enphisim.vercel.app",
        "body_html": None,
        "body_text": f"You are being redirected to: http://{short_service}/{short_code}",
        "links": [f"http://{short_service}/{short_code}"],
        "has_attachment": False,
        "attachments": [],
        "redirect_url": f"http://{fake_domain}/login",
        "display_url": f"http://{short_service}/{short_code}",
        "shortener_service": short_service
    }

def generate_message_content(title, hint, ref_num):
    """Generate realistic SMS/message content"""
    shorteners = ["bit.ly", "tinyurl.com", "short.link"]
    companies = ["FedEx", "USPS", "UPS", "Amazon", "Bank of America", "Wells Fargo"]
    
    company = random.choice(companies)
    short_service = random.choice(shorteners)
    short_code = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=6))
    
    return {
        "from_address": f"\"{company}\" <+1-800-{random.randint(100,999)}-{random.randint(1000,9999)}>",
        "reply_to": f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
        "to_address": f"+1-{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
        "crct_mail": "support@enphisim.vercel.app",
        "phish_email": "supp0rt@enphisim.vercel.app",
        "body_html": None,
        "body_text": f"{company}: {hint}. Track here: http://{short_service}/{short_code}",
        "links": [f"http://{short_service}/{short_code}"],
        "has_attachment": False,
        "attachments": [],
        "redirect_url": f"http://tracking-{company.lower()}.com/login",
        "display_url": f"http://{short_service}/{short_code}",
        "shortener_service": short_service
    }

def generate_notification_content(title, hint, ref_num):
    """Generate realistic social media notification content"""
    platforms = ["LinkedIn", "Facebook", "Twitter", "Instagram", "Snapchat"]
    fake_domains = ["linkedin.com.verify.co", "facebook-secure.net", "twitter-login.info"]
    
    platform = random.choice(platforms)
    fake_domain = random.choice(fake_domains)
    
    return {
        "from_address": f"\"{platform}\" <notifications@{platform.lower()}.com>",
        "reply_to": f"notifications@{platform.lower()}.com",
        "to_address": "user@email.com",
        "crct_mail": "support@enphisim.vercel.app",
        "phish_email": "supp0rt@enphisim.vercel.app",
        "body_html": f"<div><img src='https://{platform.lower()}.com/icon.png'/><p>{hint}. <a href='http://{fake_domain}/login'>Click here</a></p></div>",
        "body_text": f"{platform}: {hint}. Click here: http://{fake_domain}/login",
        "links": [f"http://{fake_domain}/login"],
        "has_attachment": False,
        "attachments": [],
        "redirect_url": f"http://{fake_domain}/login",
        "display_url": f"http://{fake_domain}/login",
        "shortener_service": None
    }

def generate_bonus_content(title, hint, ref_num):
    """Generate bonus level content"""
    return {
        "from_address": None,
        "reply_to": None,
        "to_address": None,
        "crct_mail": "support@enphisim.vercel.app",
        "phish_email": "supp0rt@enphisim.vercel.app",
        "body_html": None,
        "body_text": f"Bonus Challenge: {title} - {hint}",
        "links": [],
        "has_attachment": False,
        "attachments": [],
        "redirect_url": None,
        "display_url": None,
        "shortener_service": None
    }

def generate_final_content(title, hint, ref_num):
    """Generate final challenge content"""
    return {
        "from_address": "\"CEO Office\" <ceo@company.com>",
        "reply_to": "ceo.urgent@gmail.com",
        "to_address": "executive@company.com",
        "crct_mail": "ceo@company.com",
        "phish_email": "ceo.urgent@gmail.com",
        "body_html": f"<p><strong>CONFIDENTIAL</strong></p><p>{hint}. Multiple red flags detected.</p>",
        "body_text": f"CONFIDENTIAL\n\n{hint}. Multiple red flags detected.",
        "links": ["http://secure-docs.company-verify.net/sharepoint"],
        "has_attachment": True,
        "attachments": [
            {"name": "confidential_report.pdf", "type": "application/pdf", "size": "1.2MB"},
            {"name": "payment_schedule.xlsx", "type": "application/vnd.ms-excel", "size": "345KB"}
        ],
        "redirect_url": "http://secure-docs.company-verify.net/sharepoint",
        "display_url": "http://secure-docs.company-verify.net/sharepoint",
        "shortener_service": None
    }

# =================== CREATE UNIFIED DATASET ===================
dataset = []

# Unique scenario counter
scenario_counter = 1

# Helper function to create scenario variations
def create_scenarios(level_info, num_variations=200):
    global scenario_counter
    scenarios = []
    
    for i in range(num_variations):
        ref_num = random.randint(1000, 9999)
        content = f"{level_info['title']} Scenario {i+1}: {level_info['hint']}"
        
        # Add randomness
        if i % 3 == 0:
            content = "ðŸš¨ URGENT: " + content
        if i % 5 == 0:
            content = content.replace("your", "ur").replace("please", "plz")
        if i % 7 == 0:
            content += f" [Ref: {ref_num}]"
        
        # Generate template-specific content
        template_content = {}
        if level_info['template'] == 'mail':
            template_content = generate_email_content(level_info['title'], level_info['hint'], ref_num)
        elif level_info['template'] == 'browser':
            template_content = generate_browser_content(level_info['title'], level_info['hint'], ref_num)
        elif level_info['template'] == 'message':
            template_content = generate_message_content(level_info['title'], level_info['hint'], ref_num)
        elif level_info['template'] == 'notification':
            template_content = generate_notification_content(level_info['title'], level_info['hint'], ref_num)
        elif level_info['template'] == 'image' and level_info['category'] == 'bonus':
            template_content = generate_bonus_content(level_info['title'], level_info['hint'], ref_num)
        elif level_info['template'] == 'mail+browser' and level_info['category'] == 'final':
            template_content = generate_final_content(level_info['title'], level_info['hint'], ref_num)
        else:
            # Default fallback
            template_content = generate_email_content(level_info['title'], level_info['hint'], ref_num)

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
            "from_address": template_content.get('from_address'),
            "reply_to": template_content.get('reply_to'),
            "to_address": template_content.get('to_address'),
            "crct_mail": template_content.get('crct_mail'),
            "phish_email": template_content.get('phish_email'),
            "body_html": template_content.get('body_html'),
            "body_text": template_content.get('body_text'),
            "links": template_content.get('links', []),
            "has_attachment": template_content.get('has_attachment', False),
            "attachments": template_content.get('attachments', []),
            "redirect_url": template_content.get('redirect_url'),
            "display_url": template_content.get('display_url'),
            "shortener_service": template_content.get('shortener_service'),
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
        "title": f"{title} {i-12}",  # Reset numbering for each type
        "hint": hint,
        "category": "complex",
        "template": template,
        "taxonomy": taxonomy,
        "correct_option": "Verify Sender",
        "neutral_option": "Check Carefully",
        "wrong_option": "Open / Trust",
        "difficulty": round(0.5 + ((i-12)*0.02), 2),
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

print(f"âœ… Unified dataset created with {len(dataset)} scenarios")
print("ðŸ“ File: data/enphisim_dataset.json")

# =================== VALIDATION ===================
template_counts = {}
for scenario in dataset:
    template = scenario['template']
    template_counts[template] = template_counts.get(template, 0) + 1

print("\nðŸ“Š Dataset Statistics:")
print(f"   Total scenarios: {len(dataset)}")
print("   Templates used:")
for template, count in template_counts.items():
    print(f"     - {template}: {count} scenarios")

# Show sample from each template type
print("\nðŸ“ Sample scenarios from each template:")
sample_templates = ['mail', 'browser', 'message', 'notification', 'image', 'mail+browser']
for template in sample_templates:
    samples = [s for s in dataset if s['template'] == template]
    if samples:
        sample = samples[0]
        print(f"\n   {template.upper()} Sample (ID: {sample['scenario_id']}):")
        print(f"     Title: {sample['title']}")
        print(f"     Level: {sample['level_no']} | Difficulty: {sample['difficulty']}")
        if sample['from_address']:
            print(f"     From: {sample['from_address']}")
        if sample['links']:
            print(f"     Links: {sample['links'][:2]}")
        if sample.get('redirect_url'):
            print(f"     Redirects to: {sample['redirect_url']}")
        if sample.get('has_attachment') and sample['attachments']:
            print(f"     Attachments: {len(sample['attachments'])} file(s)")
