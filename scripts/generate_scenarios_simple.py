# Sections: imports, configuration, helpers, main

import json
import random
from datetime import datetime

class SingleUserScenarioGenerator:
    """Generate simplified scenarios for single-user game"""
    
    def __init__(self):
        self.scenarios = []
        self.variation_count = 50  # Reduced from 200 for single-user
    
    def generate_for_level(self, level, level_num):
        """Generate 50 variations for one level"""
        level_scenarios = []
        
        for i in range(self.variation_count):
            scenario = self._create_variation(level, i, level_num)
            level_scenarios.append(scenario)
        
        return level_scenarios
    
    def _create_variation(self, level, var_id, level_num):
        """Create one scenario variation"""
        
        # Base template variations
        templates = {
            "mail": [
                f"From: {level.get('phish_email', 'sender@example.com')}\n"
                f"To: you@company.com\n"
                f"Subject: {self._vary_subject(level.get('subj', 'Important'))}\n\n"
                f"{self._vary_text(level.get('level_text', ''), var_id)}\n\n"
                f"{self._random_signature(var_id)}",
                
                f"SUBJECT: {level.get('subj', 'Notification')}\n"
                f"FROM: {level.get('phish_email', 'noreply@example.com')}\n\n"
                f"{self._vary_text(level.get('level_text', ''), var_id)}\n"
                f"Click: {self._random_link(var_id)}",
                
                f"URGENT MESSAGE\n"
                f"Sender: {level.get('phish_email', 'alert@example.com')}\n\n"
                f"{self._make_urgent(level.get('level_text', ''), var_id)}\n\n"
                f"Action required within 24 hours."
            ],
            "message": [
                f"ðŸ“± SMS: {self._vary_text(level.get('level_text', ''), var_id)}",
                f"ðŸ”” App Notification: {level.get('level_text', '')}",
                f"ðŸ’¬ WhatsApp: {self._vary_text(level.get('level_text', ''), var_id)}\n"
                f"From: +44{random.randint(700000000, 799999999)}"
            ]
        }
        
        # Get appropriate template
        template_type = level.get('template_type', 'mail')
        template_list = templates.get(template_type, templates['mail'])
        content = random.choice(template_list)
        
        # Apply grammar variations based on var_id
        content = self._apply_grammar(content, var_id)
        
        return {
            "id": f"{level['Level_no']}_v{var_id:03d}",
            "level_id": level["id"],
            "level_no": level["Level_no"],
            "content": content,
            "difficulty": level.get("difficulty", 0.5) + (var_id % 10 * 0.01),
            "correct_action": level["correct_option"],
            "incorrect_actions": [
                level["wrong_option"],
                level.get("neutral_option", "Ignore")
            ],
            "hint": level.get("Hint", ""),
            "variation_type": self._get_variation_type(var_id),
            "created": datetime.now().isoformat()
        }
    
    def _vary_subject(self, subject):
        """Vary subject line"""
        variations = [
            subject,
            f"IMPORTANT: {subject}",
            f"URGENT: {subject}",
            f"ACTION REQUIRED: {subject}",
            f"RE: {subject}",
            f"FW: {subject}"
        ]
        return random.choice(variations)
    
    def _vary_text(self, text, var_id):
        """Vary the text content"""
        if var_id % 5 == 0:
            return f"Hello,\n\n{text}\n\nBest regards"
        elif var_id % 5 == 1:
            return f"Hi there,\n\n{text}\n\nThanks"
        elif var_id % 5 == 2:
            return f"Dear User,\n\n{text}\n\nSincerely"
        elif var_id % 5 == 3:
            return f"Attention,\n\n{text}\n\nRegards"
        else:
            return f"Hey,\n\n{text}\n\nCheers"
    
    def _random_signature(self, var_id):
        """Generate random signature"""
        signatures = [
            "IT Support Team",
            "Security Department",
            "Accounts Department",
            "HR Department",
            "The Admin Team",
            "Customer Service"
        ]
        return f"- {random.choice(signatures)}"
    
    def _random_link(self, var_id):
        """Generate random link"""
        domains = ["secure-login", "verify-account", "update-info", "confirm-action"]
        extensions = [".com", ".net", ".org", ".co"]
        
        return f"https://{random.choice(domains)}-{var_id}{random.choice(extensions)}"
    
    def _make_urgent(self, text, var_id):
        """Make text more urgent"""
        urgent_prefixes = [
            "ðŸš¨ URGENT: ",
            "âš ï¸ IMMEDIATE ACTION: ",
            "â— IMPORTANT: ",
            "ðŸ”¥ TIME-SENSITIVE: "
        ]
        return f"{random.choice(urgent_prefixes)}{text}"
    
    def _apply_grammar(self, text, var_id):
        """Apply grammar quality variations"""
        # Every 10th variation has poor grammar
        if var_id % 10 == 0:
            text = text.replace("your", "ur")
            text = text.replace("you", "u")
            text = text.replace("please", "plz")
            text = text.replace("thank you", "thx")
        return text
    
    def _get_variation_type(self, var_id):
        """Get variation type"""
        types = ["standard", "urgent", "casual", "formal", "grammar_poor"]
        return types[var_id % len(types)]
    
    def generate_all_scenarios(self, levels_file="data/levels_complete.json"):
        """Generate scenarios for all levels"""
        with open(levels_file, 'r') as f:
            levels = json.load(f)
        
        all_scenarios = []
        
        print(f"Generating 50 scenarios for each level...")
        
        for level in levels:
            # Only generate for phishing levels (l1-l32, f)
            if level['Level_no'].startswith(('l', 'f')):
                scenarios = self.generate_for_level(level, level['id'])
                all_scenarios.extend(scenarios)
                print(f"  âœ… {level['Level_no']}: {len(scenarios)} scenarios")
        
        print(f"\nðŸ“Š Total scenarios generated: {len(all_scenarios)}")
        return all_scenarios
    
    def save_scenarios(self, scenarios, filename="data/scenarios_simplified.json"):
        """Save scenarios to file"""
        with open(filename, 'w') as f:
            json.dump(scenarios, f, indent=2)
        print(f"ðŸ’¾ Saved {len(scenarios)} scenarios to {filename}")
        
        # Also create ML dataset
        self._create_ml_dataset(scenarios)
        
        return filename
    
    def _create_ml_dataset(self, scenarios):
        """Create CSV for ML training"""
        import csv
        
        with open('data/ml_dataset.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['id', 'text', 'label', 'level', 'category', 'difficulty'])
            
            for scenario in scenarios:
                writer.writerow([
                    scenario['id'],
                    scenario['content'][:500],  # Limit length
                    1,  # All are phishing
                    scenario['level_no'],
                    'phishing',
                    scenario['difficulty']
                ])
        
        print("ðŸ’¾ Created ml_dataset.csv")

# Run the generator
if __name__ == "__main__":
    print("ðŸš€ Generating Single-User EnPhiSim Dataset")
    print("=" * 50)
    
    generator = SingleUserScenarioGenerator()
    
    # Generate scenarios
    scenarios = generator.generate_all_scenarios()
    
    # Save to file
    generator.save_scenarios(scenarios)
    
    # Print sample
    print("\nðŸ“„ Sample Scenario:")
    print(json.dumps(scenarios[0], indent=2))
