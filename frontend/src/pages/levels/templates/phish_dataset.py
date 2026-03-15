#!/usr/bin/env python3
# Sections: imports, configuration, helpers, main

"""
Complete 39-Level Phishing Simulation Dataset Generator
- 32 Standard Phishing Attack Levels
- 6 Bonus Analysis Levels (Animal-Based Cybersecurity Analogies)
- 1 Final Fusion Level (Advanced Persistent Phishing)

Domain: en-phi-sim.vercel.app
Maintains exact CSS structure and JSON schema
"""

import json
import random
from typing import List, Dict, Any

class PhishingDatasetGenerator:
    def __init__(self):
        self.scenarios = []
        self.scenario_counter = 1
        
        # Core domain - as requested
        self.base_domain = "en-phi-sim.vercel.app"
        
        # Benign domains (for crct_mail)
        self.benign_domains = [
            "company.com", "organization.org", "enterprise.com", 
            "corporation.net", "business.org", "firm.com",
            "workplace.co", "office.net", "corporate.org"
        ]
        
        # Malicious domains (for phish_email)
        self.malicious_domains = [
            "secure-verify.net", "account-update.info", "login-service.co",
            "billing-center.org", "document-share.net", "payment-portal.info",
            "verification-system.co", "security-check.net", "message-center.info",
            "profile-update.co", "shipping-notice.net", "delivery-status.info",
            "auth-verify.com", "credential-check.net", "identity-confirm.co"
        ]
        
        # URL shorteners
        self.shortener_services = [
            "tinyurl.com", "bit.ly", "goo.gl", "short.link", "ow.ly", "is.gd",
            "buff.ly", "rebrand.ly", "cutt.ly", "t.co"
        ]
        
        # Redirect URLs
        self.redirect_targets = [
            "http://secure-login.com/verify",
            "http://account-verify.net/login",
            "http://document-share.ai/authenticate",
            "http://billing-portal.com/payment",
            "http://cloud-storage.net/signin",
            "http://identity-verify.co/confirm",
            "http://access-manager.net/login"
        ]
        
        # Sender display names
        self.sender_names = [
            "Security Team", "IT Support", "Admin", "Notification Service",
            "Help Desk", "System Administrator", "Account Services",
            "Customer Support", "Billing Department", "HR Department",
            "Compliance Team", "Executive Office", "Data Protection Officer"
        ]
        
        # Common brands for spoofing
        self.brands = [
            "Microsoft", "Google", "Apple", "Amazon", "PayPal", "Netflix",
            "Adobe", "LinkedIn", "Dropbox", "DocuSign", "Salesforce", "Slack",
            "Spotify", "Zoom", "Teams", "Office365", "GSuite", "AWS"
        ]
        
        # Phone numbers for smishing
        self.sender_phones = [
            "+1-800-555-0199", "+1-888-555-0172", "+1-877-555-0134",
            "+1-866-555-0156", "+1-855-555-0189", "+1-844-555-0123"
        ]
        
        self.recipient_phones = [
            "+1-415-555-0167", "+1-212-555-0189", "+1-312-555-0145",
            "+1-617-555-0132", "+1-206-555-0178", "+1-305-555-0154"
        ]

        # 6 Bonus Levels: Animal-Based Cybersecurity Analogies
        self.bonus_analogies = [
            {
                "level": "b1",
                "animal": "Anglerfish",
                "attack": "Phishing",
                "fact": "Anglerfish use a bioluminescent lure to attract prey in the dark depths - exactly like phishing emails use enticing baits to lure victims.",
                "defense": "Just as prey learns to recognize the anglerfish's deceptive light, users must learn to recognize suspicious lures.",
                "title": "The Anglerfish Principle: Understanding Phishing Lures"
            },
            {
                "level": "b2",
                "animal": "Porcupine",
                "attack": "Ransomware",
                "fact": "Porcupines don't attack first - they defend when threatened, then release quills that cause ongoing pain, similar to how ransomware activates and continues to cause damage.",
                "defense": "Like animals that avoid porcupines by keeping distance, systems need isolation and backups to avoid ransomware.",
                "title": "The Porcupine Defense: Ransomware Protection Strategies"
            },
            {
                "level": "b3",
                "animal": "Army Ants",
                "attack": "DDoS Attacks",
                "fact": "Army ants attack in overwhelming numbers, swarming their target until it's overwhelmed - exactly like DDoS attacks flood servers with traffic.",
                "defense": "Just as prey creates barriers to divert ant swarms, networks need traffic filtering and load balancing.",
                "title": "Army Ant Strategy: Understanding DDoS Attacks"
            },
            {
                "level": "b4",
                "animal": "Mockingbird",
                "attack": "Social Engineering",
                "fact": "Mockingbirds mimic the calls of other birds to deceive and manipulate - the perfect analogy for social engineering attacks that impersonate trusted entities.",
                "defense": "Just as birds learn to distinguish real calls from mimics, users need training to verify identities.",
                "title": "The Mockingbird Effect: Social Engineering Tactics"
            },
            {
                "level": "b5",
                "animal": "Cuckoo",
                "attack": "Trojan Horse",
                "fact": "Cuckoos lay eggs in other birds' nests, appearing harmless until the egg hatches and destroys the nest - exactly like Trojan horses.",
                "defense": "Just as birds learn to spot foreign eggs, systems need application whitelisting and verification.",
                "title": "Cuckoo's Egg: Trojan Horse Detection"
            },
            {
                "level": "b6",
                "animal": "Zombie Ant Fungus",
                "attack": "Botnets",
                "fact": "Ophiocordyceps fungus turns ants into zombies, controlling them for the fungus's purposes - exactly like botnets controlling infected devices.",
                "defense": "Just as ants have immune responses, devices need regular health checks and botnet detection.",
                "title": "The Zombie Ant Phenomenon: Botnet Behavior Analysis"
            }
        ]

    def generate_id(self, prefix: str = "sc") -> str:
        """Generate a unique scenario ID"""
        scenario_id = f"{prefix}{self.scenario_counter:05d}"
        self.scenario_counter += 1
        return scenario_id

    def get_random_domains(self) -> tuple:
        """Return a tuple of (benign_domain, malicious_domain)"""
        benign = random.choice(self.benign_domains)
        malicious = random.choice(self.malicious_domains)
        return benign, malicious

    def get_random_emails(self, benign_domain: str) -> tuple:
        """Generate random email addresses using base domain"""
        support_email = f"support@{benign_domain}"
        phish_email = f"support@{random.choice(self.malicious_domains)}"
        return support_email, phish_email

    # =========================================================================
    # 32 STANDARD PHISHING ATTACK LEVELS
    # =========================================================================

    def generate_l1_credential_phishing(self, count: int = 3):
        """Level 1: Mass Credential Phishing"""
        lures = [
            ("Your mailbox is almost full", "mailbox-storage"),
            ("Unusual sign-in detected", "signin-activity"),
            ("Password expires today", "password-expire")
        ]
        
        for i in range(count):
            lure, slug = lures[i % len(lures)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l1",
                "title": "Mass Credential-Phish",
                "content": f"ðŸš¨ URGENT: {lure}",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Credential Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.22,
                "from_address": f"\"{random.choice(self.sender_names)}\" <{slug}@{self.base_domain}>",
                "reply_to": f"support@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Action Required:</strong> {lure}. <a href='http://{malicious_domain}/{slug}'>Click here to verify</a> and secure your account.</p>",
                "body_text": f"Action Required: {lure}. Click here to verify and secure your account: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"security_report.pdf", "type": "application/pdf", "size": "124KB"}] if random.random() > 0.5 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l2_scam_invoice(self, count: int = 3):
        """Level 2: Scam Invoice/Payment Reminder"""
        lures = [
            ("Invoice overdue", "invoice-pay"),
            ("Payment receipt", "payment-receipt"),
            ("Refund processed", "refund-claim")
        ]
        
        amounts = ["$499.99", "$1,299.00", "$79.99"]
        
        for i in range(count):
            lure, slug = lures[i % len(lures)]
            amount = amounts[i % len(amounts)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            brand = random.choice(self.brands)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l2",
                "title": "Scam Invoice/Payment reminder",
                "content": f"ðŸ’° {brand}: {lure} {amount}",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Financial Fraud",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.24,
                "from_address": f"\"{brand} Billing\" <billing@{self.base_domain}>",
                "reply_to": f"accounts@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Payment {lure}:</strong> Your {brand} account has been charged {amount}. <a href='http://{malicious_domain}/{slug}'>View invoice</a> or dispute if unauthorized.</p>",
                "body_text": f"Payment {lure}: Your {brand} account has been charged {amount}. View invoice or dispute if unauthorized: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"invoice_{random.randint(1000,9999)}.pdf", "type": "application/pdf", "size": "156KB"}] if random.random() > 0.3 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l3_fake_newsletter(self, count: int = 3):
        """Level 3: Fake Newsletter Subscription"""
        publications = ["Forbes", "Wall Street Journal", "TechCrunch"]
        
        for i in range(count):
            pub = publications[i % len(publications)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l3",
                "title": "Fake Newsletter Subscription",
                "content": f"ðŸ“° You've been subscribed to {pub} Premium",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Social Engineering",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.26,
                "from_address": f"\"{pub} Subscriptions\" <newsletter@{self.base_domain}>",
                "reply_to": f"unsubscribe@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Subscription confirmed:</strong> You've been subscribed to {pub} Premium. <a href='http://{malicious_domain}/unsubscribe'>Click here to unsubscribe</a> if this wasn't you.</p>",
                "body_text": f"Subscription confirmed: You've been subscribed to {pub} Premium. Click here to unsubscribe if this wasn't you: http://{malicious_domain}/unsubscribe",
                "links": [f"http://{malicious_domain}/unsubscribe"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"welcome_{random.randint(1000,9999)}.pdf", "type": "application/pdf", "size": "412KB"}] if random.random() > 0.5 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l4_lottery_scam(self, count: int = 3):
        """Level 4: Lottery / Prize Scam"""
        prizes = ["$500 Gift Card", "2 First-Class Tickets", "iPhone 15 Pro"]
        
        for i in range(count):
            prize = prizes[i % len(prizes)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            brand = random.choice(self.brands)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l4",
                "title": "Lottery / Prize Scam",
                "content": f"ðŸŽ Congratulations! You've won a {prize}",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Financial Fraud",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.28,
                "from_address": f"\"{brand} Giveaways\" <giveaways@{self.base_domain}>",
                "reply_to": f"claim@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>You're a winner!</strong> Your email was randomly selected for our {prize} giveaway. <a href='http://{malicious_domain}/claim'>Claim your prize now</a> (limited time offer).</p>",
                "body_text": f"You're a winner! Your email was randomly selected for our {prize} giveaway. Claim your prize now (limited time offer): http://{malicious_domain}/claim",
                "links": [f"http://{malicious_domain}/claim"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"prize_voucher_{random.randint(1000,9999)}.pdf", "type": "application/pdf", "size": "215KB"}] if random.random() > 0.5 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l5_attachment_lure(self, count: int = 3):
        """Level 5: Simple Attachment Lure"""
        attachments = [
            ("shipping_label.doc", "application/msword", "156KB"),
            ("voicemail.wav", "audio/x-wav", "876KB"),
            ("invoice_7732.pdf", "application/pdf", "215KB")
        ]
        
        messages = ["shipping label ready", "new voicemail received", "invoice attached"]
        slugs = ["shipping-label", "voicemail", "invoice-view"]
        
        for i in range(count):
            attachment = attachments[i % len(attachments)]
            message = messages[i % len(messages)]
            slug = slugs[i % len(slugs)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l5",
                "title": "Simple attachment Lure",
                "content": f"ðŸ“Ž {message.capitalize()}",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Messaging Attacks",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.3,
                "from_address": f"\"{random.choice(['Shipping', 'Messaging', 'Documents'])}\" <{slug}@{self.base_domain}>",
                "reply_to": f"documents@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>{message.capitalize()}.</strong> Please review the attached {attachment[0]}. <a href='http://{malicious_domain}/{slug}'>Download via portal</a> if attachment doesn't open.</p>",
                "body_text": f"{message.capitalize()}. Please review the attached {attachment[0]}. Download via portal if attachment doesn't open: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": True,
                "attachments": [{"name": attachment[0], "type": attachment[1], "size": attachment[2]}],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l6_spoofed_display(self, count: int = 3):
        """Level 6: Basic Spoofed Display-Name"""
        spoofed = [
            ("Microsoft 365 Support", "microsoft-verify.ru", "password expires"),
            ("HR Department", "hr-benefits.co", "benefits enrollment"),
            ("David Miller", "david-miller.net", "document shared")
        ]
        
        for i in range(count):
            display_name, spoof_domain, subject = spoofed[i % len(spoofed)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l6",
                "title": "Basic Spoofed display-name senders",
                "content": f"âš ï¸ Important: {subject.capitalize()}",
                "category": "easy",
                "template": "mail",
                "taxonomy": "Credential Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Ignore",
                "wrong_action": "Trust & Click",
                "difficulty": 0.32,
                "from_address": f"\"{display_name}\" <service@{spoof_domain}>",
                "reply_to": f"support@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Action required:</strong> {subject.capitalize()}. <a href='http://{malicious_domain}/document'>Access document</a> using your credentials.</p>",
                "body_text": f"Action required: {subject.capitalize()}. Access document using your credentials: http://{malicious_domain}/document",
                "links": [f"http://{malicious_domain}/document"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"document_{random.randint(1000,9999)}.pdf", "type": "application/pdf", "size": "234KB"}] if random.random() > 0.5 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l7_typosquatting(self, count: int = 3):
        """Level 7: TypoSquatted Domain"""
        typosquats = [
            ("PayPal", "paypa1.com", "account limited"),
            ("Amazon", "amaz0n.com", "package delayed"),
            ("LinkedIn", "linkedln.com", "profile views")
        ]
        
        for i in range(count):
            brand, typo_domain, issue = typosquats[i % len(typosquats)]
            benign_domain, _ = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l7",
                "title": "TypoSquatted Domain Phish",
                "content": f"ðŸ” {brand}: {issue.capitalize()}",
                "category": "advanced_easy",
                "template": "mail",
                "taxonomy": "Credential Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Investigate",
                "wrong_action": "Trust & Proceed",
                "difficulty": 0.35,
                "from_address": f"\"{brand} Security\" <security@{typo_domain}>",
                "reply_to": f"support@{random.choice(self.malicious_domains)}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Security notification:</strong> Your {brand} account has been {issue}. <a href='http://{typo_domain}/verify'>Verify now</a> to restore access.</p>",
                "body_text": f"Security notification: Your {brand} account has been {issue}. Verify now to restore access: http://{typo_domain}/verify",
                "links": [f"http://{typo_domain}/verify"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"{brand.lower()}_report.pdf", "type": "application/pdf", "size": "156KB"}] if random.random() > 0.6 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l8_url_shortener(self, count: int = 3):
        """Level 8: URL Shortener Redirect"""
        codes = ["em74kdmx", "f9p13btl", "nzv96fv5"]
        
        for i in range(count):
            shortener = random.choice(self.shortener_services)
            code = codes[i % len(codes)]
            short_url = f"http://{shortener}/{code}"
            redirect_url = random.choice(self.redirect_targets)
            benign_domain, _ = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l8",
                "title": "URL Shortener Redirected Phish",
                "content": f"ðŸš¨ URGENT: Document shared with you",
                "category": "advanced_easy",
                "template": "browser",
                "taxonomy": "Credential Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Investigate",
                "wrong_action": "Trust & Proceed",
                "difficulty": 0.35,
                "from_address": None,
                "reply_to": None,
                "to_address": None,
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": None,
                "body_text": f"You are being redirected to: {short_url}",
                "links": [short_url],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": redirect_url,
                "display_url": short_url,
                "shortener_service": shortener,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l9_malicious_survey(self, count: int = 3):
        """Level 9: Malicious Survey"""
        topics = [
            ("Employee Satisfaction", "employee-survey"),
            ("IT Service Feedback", "it-feedback"),
            ("Security Awareness", "security-training")
        ]
        
        for i in range(count):
            topic, slug = topics[i % len(topics)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l9",
                "title": "Malicious survey request",
                "content": f"ðŸ“ {topic} Survey - Please complete",
                "category": "advanced_easy",
                "template": "mail",
                "taxonomy": "Social Engineering",
                "correct_action": "Report Phish",
                "neutral_action": "Investigate",
                "wrong_action": "Trust & Proceed",
                "difficulty": 0.35,
                "from_address": f"\"{random.choice(['HR', 'IT', 'Admin'])}\" <{slug}@{self.base_domain}>",
                "reply_to": f"survey@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>We value your feedback.</strong> Please take 5 minutes to complete our {topic.lower()} survey. <a href='http://{malicious_domain}/{slug}'>Start survey</a> (login with your credentials).</p>",
                "body_text": f"We value your feedback. Please take 5 minutes to complete our {topic.lower()} survey. Start survey (login with your credentials): http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": random.choice([True, False]),
                "attachments": [{"name": f"survey_preview.pdf", "type": "application/pdf", "size": "98KB"}] if random.random() > 0.5 else [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l10_smishing(self, count: int = 3):
        """Level 10: SMS Smishing"""
        senders = ["UPS", "FedEx", "Amazon"]
        messages = ["Your package is waiting", "Delivery failed", "Account suspended"]
        
        for i in range(count):
            sender = senders[i % len(senders)]
            message = messages[i % len(messages)]
            shortener = random.choice(self.shortener_services)
            code = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=6))
            short_url = f"http://{shortener}/{code}"
            redirect_url = random.choice(self.redirect_targets)
            benign_domain, _ = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l10",
                "title": "SMS (Smishing) generic link",
                "content": f"ðŸ“± {sender}: {message}",
                "category": "advanced_easy",
                "template": "message",
                "taxonomy": "Messaging Attacks",
                "correct_action": "Report Phish",
                "neutral_action": "Investigate",
                "wrong_action": "Trust & Proceed",
                "difficulty": 0.35,
                "from_address": f"\"{sender}\" <{random.choice(self.sender_phones)}>",
                "reply_to": random.choice(self.sender_phones),
                "to_address": random.choice(self.recipient_phones),
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": None,
                "body_text": f"{sender}: {message}. Track here: {short_url}",
                "links": [short_url],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": redirect_url,
                "display_url": short_url,
                "shortener_service": shortener,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l11_spear_phishing(self, count: int = 2):
        """Level 11: Spear Phishing - Targeted attacks"""
        targets = [
            ("CFO Office", "budget-approval", "quarterly budget review"),
            ("HR Director", "employee-records", "salary review"),
            ("IT Manager", "server-maintenance", "urgent server update")
        ]
        
        for i in range(count):
            target, slug, subject = targets[i % len(targets)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l11",
                "title": "Spear Phishing - Targeted Attack",
                "content": f"ðŸŽ¯ {subject} - Action Required",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Targeted Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Verify with Sender",
                "wrong_action": "Trust & Click",
                "difficulty": 0.38,
                "from_address": f"\"{target}\" <{slug}@{self.base_domain}>",
                "reply_to": f"secure@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Confidential:</strong> Please review the attached {subject} documents. <a href='http://{malicious_domain}/{slug}'>Access secure portal</a> with your credentials.</p>",
                "body_text": f"Confidential: Please review the attached {subject} documents. Access secure portal with your credentials: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": True,
                "attachments": [{"name": f"{slug}_confidential.pdf", "type": "application/pdf", "size": "324KB"}],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l12_whaling(self, count: int = 2):
        """Level 12: Whaling - Executive targeting"""
        exec_titles = ["CEO", "CFO", "Board Member"]
        
        for i in range(count):
            exec_title = exec_titles[i % len(exec_titles)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l12",
                "title": "Whaling - Executive Targeting",
                "content": f"ðŸ‹ {exec_title} Directive: Urgent wire transfer required",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Executive Targeting",
                "correct_action": "Report Phish",
                "neutral_action": "Verify with Executive",
                "wrong_action": "Trust & Execute",
                "difficulty": 0.4,
                "from_address": f"\"{exec_title} Office\" <executive@{self.base_domain}>",
                "reply_to": f"finance-urgent@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Confidential Directive:</strong> Process wire transfer of $247,500 for Q4 acquisition. <a href='http://{malicious_domain}/wire-transfer'>Authorize transfer</a> immediately.</p>",
                "body_text": f"Confidential Directive: Process wire transfer of $247,500 for Q4 acquisition. Authorize transfer immediately: http://{malicious_domain}/wire-transfer",
                "links": [f"http://{malicious_domain}/wire-transfer"],
                "has_attachment": True,
                "attachments": [{"name": "acquisition_terms.pdf", "type": "application/pdf", "size": "1.2MB"}],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l13_vishing(self, count: int = 2):
        """Level 13: Vishing - Voice Phishing"""
        call_reasons = [
            ("IRS", "tax-fraud", "tax fraud investigation"),
            ("Bank Security", "fraud-alert", "fraudulent transaction"),
            ("Tech Support", "virus-alert", "virus detected")
        ]
        
        for i in range(count):
            caller, slug, reason = call_reasons[i % len(call_reasons)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l13",
                "title": "Vishing - Voice Phishing",
                "content": f"ðŸ“ž Urgent: {caller} - {reason}",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Voice Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Call Official Number",
                "wrong_action": "Call Back Number",
                "difficulty": 0.38,
                "from_address": f"\"{caller}\" <calls@{self.base_domain}>",
                "reply_to": f"callback@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Urgent notification regarding your account:</strong> A {reason} has been reported. <a href='http://{malicious_domain}/{slug}'>Call us immediately</a> at the verified number below.</p>",
                "body_text": f"Urgent notification regarding your account: A {reason} has been reported. Call us immediately at the verified number below: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l14_quishing(self, count: int = 2):
        """Level 14: Quishing - QR Code Phishing"""
        qr_scenarios = [
            ("parking payment", "parking-fine", "parking citation"),
            ("package tracking", "parcel-delivery", "missed delivery"),
            ("restaurant menu", "dining-offer", "special offer")
        ]
        
        for i in range(count):
            context, slug, subject = qr_scenarios[i % len(qr_scenarios)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l14",
                "title": "Quishing - QR Code Phishing",
                "content": f"ðŸ“± Scan QR code for {context}",
                "category": "medium",
                "template": "mail",
                "taxonomy": "QR Code Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Inspect QR URL",
                "wrong_action": "Scan QR Code",
                "difficulty": 0.39,
                "from_address": f"\"{context.title()} Service\" <qr@{self.base_domain}>",
                "reply_to": f"scan@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Action required:</strong> A {subject} requires your attention. <a href='http://{malicious_domain}/{slug}'>View QR code</a> to complete verification.</p>",
                "body_text": f"Action required: A {subject} requires your attention. View QR code to complete verification: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": True,
                "attachments": [{"name": f"qr_code_{slug}.png", "type": "image/png", "size": "45KB"}],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l15_pharming(self, count: int = 2):
        """Level 15: Pharming - DNS Poisoning"""
        bank_sites = ["Chase", "Bank of America", "Wells Fargo"]
        
        for i in range(count):
            bank = bank_sites[i % len(bank_sites)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l15",
                "title": "Pharming - DNS Poisoning",
                "content": f"ðŸŒ {bank}: Security certificate expired",
                "category": "medium",
                "template": "browser",
                "taxonomy": "DNS Poisoning",
                "correct_action": "Report Phish",
                "neutral_action": "Check Certificate",
                "wrong_action": "Proceed Anyway",
                "difficulty": 0.4,
                "from_address": None,
                "reply_to": None,
                "to_address": None,
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<div style='font-family: Arial;'><h3>Security Warning</h3><p>The security certificate for {bank}.com has expired. <a href='http://{malicious_domain}/renew'>Renew certificate</a> to continue.</p></div>",
                "body_text": f"Security Warning: The security certificate for {bank}.com has expired. Renew certificate to continue: http://{malicious_domain}/renew",
                "links": [f"http://{malicious_domain}/renew"],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": f"http://{bank.lower().replace(' ', '')}-secure.com/login",
                "display_url": f"http://{malicious_domain}/renew",
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l16_clone_phishing(self, count: int = 2):
        """Level 16: Clone Phishing"""
        original_emails = [
            ("meeting invitation", "meeting-reschedule"),
            ("shipping confirmation", "shipping-update"),
            ("invoice reminder", "invoice-resend")
        ]
        
        for i in range(count):
            original, slug = original_emails[i % len(original_emails)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l16",
                "title": "Clone Phishing",
                "content": f"ðŸ“§ Re: {original}",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Clone Phishing",
                "correct_action": "Report Phish",
                "neutral_action": "Compare with Original",
                "wrong_action": "Trust & Click",
                "difficulty": 0.41,
                "from_address": f"\"{random.choice(self.sender_names)}\" <replies@{self.base_domain}>",
                "reply_to": f"updated@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Updated: {original}</strong> The previous {original} was sent with incorrect information. <a href='http://{malicious_domain}/{slug}'>View corrected version</a> with updated details.</p>",
                "body_text": f"Updated: {original} The previous {original} was sent with incorrect information. View corrected version with updated details: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": True,
                "attachments": [{"name": f"updated_{slug}.pdf", "type": "application/pdf", "size": "187KB"}],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l17_man_in_middle(self, count: int = 2):
        """Level 17: Man-in-the-Middle"""
        mitm_scenarios = [
            ("public WiFi", "coffee-shop", "Cafe WiFi"),
            ("hotel network", "hotel-guest", "Grand Hotel"),
            ("airport network", "airport-free", "Airport Free WiFi")
        ]
        
        for i in range(count):
            context, slug, network = mitm_scenarios[i % len(mitm_scenarios)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l17",
                "title": "Man-in-the-Middle Attack",
                "content": f"ðŸ•¸ï¸ Connect to {network}",
                "category": "medium",
                "template": "browser",
                "taxonomy": "MITM Attack",
                "correct_action": "Report Phish",
                "neutral_action": "Use VPN",
                "wrong_action": "Connect & Login",
                "difficulty": 0.42,
                "from_address": None,
                "reply_to": None,
                "to_address": None,
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": None,
                "body_text": f"Connect to {network} to access the internet. Portal: http://{malicious_domain}/{slug}",
                "links": [f"http://{malicious_domain}/{slug}"],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": f"http://portal-{slug}.com/login",
                "display_url": f"http://{malicious_domain}/{slug}",
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l18_watering_hole(self, count: int = 2):
        """Level 18: Watering Hole Attack"""
        compromised_sites = [
            "industry-news.com", "tech-forum.net", "professional-association.org"
        ]
        
        for i in range(count):
            site = compromised_sites[i % len(compromised_sites)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l18",
                "title": "Watering Hole Attack",
                "content": f"ðŸ’§ Industry news update from {site}",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Watering Hole",
                "correct_action": "Report Phish",
                "neutral_action": "Verify URL",
                "wrong_action": "Visit Site",
                "difficulty": 0.43,
                "from_address": f"\"Industry Updates\" <updates@{site}>",
                "reply_to": f"news@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Weekly industry digest</strong> from {site}. <a href='http://{malicious_domain}/{site.split('.')[0]}'>Read full articles</a> on our partner site.</p>",
                "body_text": f"Weekly industry digest from {site}. Read full articles on our partner site: http://{malicious_domain}/{site.split('.')[0]}",
                "links": [f"http://{malicious_domain}/{site.split('.')[0]}"],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l19_credential_stuffing(self, count: int = 2):
        """Level 19: Credential Stuffing Alert"""
        services = ["Netflix", "Spotify", "Dropbox"]
        
        for i in range(count):
            service = services[i % len(services)]
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id(),
                "level_no": "l19",
                "title": "Credential Stuffing Alert",
                "content": f"âš ï¸ Multiple failed login attempts - {service}",
                "category": "medium",
                "template": "mail",
                "taxonomy": "Credential Stuffing",
                "correct_action": "Report Phish",
                "neutral_action": "Check Account",
                "wrong_action": "Click to Secure",
                "difficulty": 0.44,
                "from_address": f"\"{service} Security\" <security@{self.base_domain}>",
                "reply_to": f"alerts@{malicious_domain}",
                "to_address": "employee@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"<p><strong>Security Alert:</strong> 15 failed login attempts detected on your {service} account. <a href='http://{malicious_domain}/{service.lower()}-secure'>Review activity</a> and secure your account.</p>",
                "body_text": f"Security Alert: 15 failed login attempts detected on your {service} account. Review activity and secure your account: http://{malicious_domain}/{service.lower()}-secure",
                "links": [f"http://{malicious_domain}/{service.lower()}-secure"],
                "has_attachment": False,
                "attachments": [],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    def generate_l20_session_hijacking(self, count: int = 2):
        """Level 20: Session Hijacking"""
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l20",
            "title": "Session Hijacking Alert",
            "content": "ðŸ”„ Your session has expired - Please login again",
            "category": "medium",
            "template": "browser",
            "taxonomy": "Session Hijacking",
            "correct_action": "Report Phish",
            "neutral_action": "Check URL",
            "wrong_action": "Login Again",
            "difficulty": 0.45,
            "from_address": None,
            "reply_to": None,
            "to_address": None,
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": "<div style='font-family: Arial;'><h3>Session Timeout</h3><p>Your session has expired due to inactivity. <a href='http://{malicious_domain}/renew-session'>Click here</a> to login again and continue.</p></div>",
            "body_text": f"Session Timeout: Your session has expired due to inactivity. Click here to login again and continue: http://{malicious_domain}/renew-session",
            "links": [f"http://{malicious_domain}/renew-session"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": "http://company-portal.com/login",
            "display_url": f"http://{malicious_domain}/renew-session",
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

    # Continue generating levels 21-32 with similar pattern...
    def generate_l21_to_l32(self):
        """Generate levels 21-32 with various attack types"""
        # Level 21: Evil Twin Attack
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l21",
            "title": "Evil Twin Wi-Fi Attack",
            "content": "ðŸ“¶ Free Company Wi-Fi Available",
            "category": "medium",
            "template": "browser",
            "taxonomy": "Wi-Fi Phishing",
            "correct_action": "Report Phish",
            "neutral_action": "Verify Network",
            "wrong_action": "Connect",
            "difficulty": 0.46,
            "from_address": None,
            "reply_to": None,
            "to_address": None,
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": None,
            "body_text": f"Free Company Guest Wi-Fi available. Connect to 'Company-Guest' and login at: http://{malicious_domain}/portal",
            "links": [f"http://{malicious_domain}/portal"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": "http://company-portal.com/authenticate",
            "display_url": f"http://{malicious_domain}/portal",
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 22: Tech Support Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l22",
            "title": "Tech Support Scam",
            "content": "ðŸ–¥ï¸ Critical System Alert - Call Immediately",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Tech Support Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Contact IT Directly",
            "wrong_action": "Call Number",
            "difficulty": 0.47,
            "from_address": f"\"Microsoft Support\" <alerts@{self.base_domain}>",
            "reply_to": f"help@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>CRITICAL SYSTEM ALERT:</strong> Your computer has reported malware infections. <a href='http://{malicious_domain}/support'>Call support immediately</a> at 1-800-555-0123.</p>",
            "body_text": f"CRITICAL SYSTEM ALERT: Your computer has reported malware infections. Call support immediately at 1-800-555-0123: http://{malicious_domain}/support",
            "links": [f"http://{malicious_domain}/support"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 23: Romance Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l23",
            "title": "Romance Scam",
            "content": "ðŸ’• Someone has a crush on you!",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Social Engineering",
            "correct_action": "Report Phish",
            "neutral_action": "Ignore",
            "wrong_action": "Click to See Who",
            "difficulty": 0.48,
            "from_address": f"\"Dating Connect\" <dating@{self.base_domain}>",
            "reply_to": f"match@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Someone has a crush on you!</strong> A colleague from your company has added you to their secret crush list. <a href='http://{malicious_domain}/reveal'>Click to reveal</a> who it is!</p>",
            "body_text": f"Someone has a crush on you! A colleague from your company has added you to their secret crush list. Click to reveal who it is: http://{malicious_domain}/reveal",
            "links": [f"http://{malicious_domain}/reveal"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 24: Charity Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l24",
            "title": "Charity Scam",
            "content": "ðŸ¤ Urgent: Help disaster victims",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Financial Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Research Charity",
            "wrong_action": "Donate Now",
            "difficulty": 0.49,
            "from_address": f"\"Global Relief\" <relief@{self.base_domain}>",
            "reply_to": f"donate@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Emergency Relief Fund:</strong> Thousands affected by recent disaster need your help. <a href='http://{malicious_domain}/donate'>Donate now</a> - 100% goes to victims.</p>",
            "body_text": f"Emergency Relief Fund: Thousands affected by recent disaster need your help. Donate now - 100% goes to victims: http://{malicious_domain}/donate",
            "links": [f"http://{malicious_domain}/donate"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 25: Job Offer Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l25",
            "title": "Fake Job Offer",
            "content": "ðŸ’¼ Remote Position - $150k/year - No Experience Needed",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Employment Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Research Company",
            "wrong_action": "Apply Now",
            "difficulty": 0.5,
            "from_address": f"\"HR Recruiting\" <careers@{self.base_domain}>",
            "reply_to": f"apply@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Exciting Career Opportunity!</strong> We reviewed your profile and think you'd be perfect for a remote position. <a href='http://{malicious_domain}/apply'>Apply now</a> before positions fill.</p>",
            "body_text": f"Exciting Career Opportunity! We reviewed your profile and think you'd be perfect for a remote position. Apply now before positions fill: http://{malicious_domain}/apply",
            "links": [f"http://{malicious_domain}/apply"],
            "has_attachment": True,
            "attachments": [{"name": "job_description.pdf", "type": "application/pdf", "size": "234KB"}],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 26: Account Verification Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l26",
            "title": "Account Verification Required",
            "content": "ðŸ”‘ Verify your account to avoid suspension",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Credential Phishing",
            "correct_action": "Report Phish",
            "neutral_action": "Check Official Site",
            "wrong_action": "Verify Now",
            "difficulty": 0.51,
            "from_address": f"\"Account Services\" <verify@{self.base_domain}>",
            "reply_to": f"confirm@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Account Verification Required:</strong> Our records indicate your account information needs updating. <a href='http://{malicious_domain}/verify'>Verify now</a> to maintain access.</p>",
            "body_text": f"Account Verification Required: Our records indicate your account information needs updating. Verify now to maintain access: http://{malicious_domain}/verify",
            "links": [f"http://{malicious_domain}/verify"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 27: Package Delivery Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l27",
            "title": "Package Delivery Scam",
            "content": "ðŸ“¦ Your package could not be delivered",
            "category": "medium",
            "template": "mail",
            "taxonomy": "Shipping Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Check Tracking",
            "wrong_action": "Reschedule Delivery",
            "difficulty": 0.52,
            "from_address": f"\"USPS Delivery\" <delivery@{self.base_domain}>",
            "reply_to": f"reschedule@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Delivery Attempt Failed:</strong> We attempted to deliver your package but no one was available. <a href='http://{malicious_domain}/reschedule'>Reschedule delivery</a> within 48 hours.</p>",
            "body_text": f"Delivery Attempt Failed: We attempted to deliver your package but no one was available. Reschedule delivery within 48 hours: http://{malicious_domain}/reschedule",
            "links": [f"http://{malicious_domain}/reschedule"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 28: Fake Antivirus Alert
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l28",
            "title": "Fake Antivirus Alert",
            "content": "ðŸ›¡ï¸ 5 viruses detected - Immediate action required",
            "category": "medium",
            "template": "browser",
            "taxonomy": "Scareware",
            "correct_action": "Report Phish",
            "neutral_action": "Run Legitimate Scan",
            "wrong_action": "Download Antivirus",
            "difficulty": 0.53,
            "from_address": None,
            "reply_to": None,
            "to_address": None,
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<div style='font-family: Arial; background: red; color: white; padding: 20px;'><h1>âš ï¸ CRITICAL ALERT âš ï¸</h1><p>5 viruses detected! Your personal data is at risk.</p><a href='http://{malicious_domain}/scan' style='background: white; color: red; padding: 10px;'>Run Scan Now</a></div>",
            "body_text": f"CRITICAL ALERT: 5 viruses detected! Your personal data is at risk. Run Scan Now: http://{malicious_domain}/scan",
            "links": [f"http://{malicious_domain}/scan"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": "http://antivirus-download.com/setup.exe",
            "display_url": f"http://{malicious_domain}/scan",
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 29: Inheritance Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l29",
            "title": "Inheritance Scam",
            "content": "ðŸ’° $2.5M inheritance waiting for you",
            "category": "hard",
            "template": "mail",
            "taxonomy": "Financial Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Ignore",
            "wrong_action": "Claim Inheritance",
            "difficulty": 0.54,
            "from_address": f"\"Legal Affairs\" <attorney@{self.base_domain}>",
            "reply_to": f"claim@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>FINAL NOTICE:</strong> You are the beneficiary of an unclaimed inheritance of $2.5M from a distant relative. <a href='http://{malicious_domain}/claim'>Claim now</a> before funds are escheated.</p>",
            "body_text": f"FINAL NOTICE: You are the beneficiary of an unclaimed inheritance of $2.5M from a distant relative. Claim now before funds are escheated: http://{malicious_domain}/claim",
            "links": [f"http://{malicious_domain}/claim"],
            "has_attachment": True,
            "attachments": [{"name": "legal_documents.pdf", "type": "application/pdf", "size": "567KB"}],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 30: Cryptocurrency Scam
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l30",
            "title": "Cryptocurrency Investment Scam",
            "content": "â‚¿ Double your Bitcoin in 24 hours - Guaranteed!",
            "category": "hard",
            "template": "mail",
            "taxonomy": "Crypto Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Research",
            "wrong_action": "Invest Now",
            "difficulty": 0.55,
            "from_address": f"\"Crypto Wealth\" <trading@{self.base_domain}>",
            "reply_to": f"invest@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>Limited Time Opportunity!</strong> Our AI trading bot has achieved 100% returns for early investors. <a href='http://{malicious_domain}/invest'>Start investing</a> with as little as $100.</p>",
            "body_text": f"Limited Time Opportunity! Our AI trading bot has achieved 100% returns for early investors. Start investing with as little as $100: http://{malicious_domain}/invest",
            "links": [f"http://{malicious_domain}/invest"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 31: Government Impersonation
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l31",
            "title": "Government Impersonation",
            "content": "âš–ï¸ IRS: Tax fraud investigation - Respond immediately",
            "category": "hard",
            "template": "mail",
            "taxonomy": "Government Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Contact IRS Directly",
            "wrong_action": "Provide Information",
            "difficulty": 0.56,
            "from_address": f"\"IRS Tax Division\" <tax-dept@{self.base_domain}>",
            "reply_to": f"compliance@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>OFFICIAL NOTICE:</strong> Case #TAX-7843-22 - Your tax records indicate discrepancies requiring immediate review. <a href='http://{malicious_domain}/respond'>Respond within 24 hours</a> to avoid legal action.</p>",
            "body_text": f"OFFICIAL NOTICE: Case #TAX-7843-22 - Your tax records indicate discrepancies requiring immediate review. Respond within 24 hours to avoid legal action: http://{malicious_domain}/respond",
            "links": [f"http://{malicious_domain}/respond"],
            "has_attachment": True,
            "attachments": [{"name": "tax_notice_2025.pdf", "type": "application/pdf", "size": "234KB"}],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

        # Level 32: Emergency Scam (Grandparent Scam)
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        self.scenarios.append({
            "scenario_id": self.generate_id(),
            "level_no": "l32",
            "title": "Emergency Scam",
            "content": "ðŸ†˜ Urgent help needed - family emergency",
            "category": "hard",
            "template": "mail",
            "taxonomy": "Emergency Fraud",
            "correct_action": "Report Phish",
            "neutral_action": "Call Family Directly",
            "wrong_action": "Send Money",
            "difficulty": 0.57,
            "from_address": f"\"Family Member\" <emergency@{self.base_domain}>",
            "reply_to": f"help@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": f"<p><strong>URGENT - Please respond</strong> I'm traveling and had my wallet stolen. Need $950 for hotel and flight home. <a href='http://{malicious_domain}/help'>Can you help?</a> Will pay you back next week.</p>",
            "body_text": f"URGENT - Please respond I'm traveling and had my wallet stolen. Need $950 for hotel and flight home. Can you help? Will pay you back next week: http://{malicious_domain}/help",
            "links": [f"http://{malicious_domain}/help"],
            "has_attachment": False,
            "attachments": [],
            "redirect_url": None,
            "display_url": None,
            "shortener_service": None,
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

    # =========================================================================
    # 6 BONUS ANALYSIS LEVELS (Animal Analogies)
    # =========================================================================

    def generate_bonus_levels(self):
        """Generate 6 bonus analysis levels with animal analogies"""
        for bonus in self.bonus_analogies:
            benign_domain, malicious_domain = self.get_random_domains()
            support_email, phish_email = self.get_random_emails(benign_domain)
            
            self.scenarios.append({
                "scenario_id": self.generate_id("bonus"),
                "level_no": bonus["level"],
                "title": f"Bonus: {bonus['title']}",
                "content": f"ðŸ¦Š {bonus['animal']} Analogy: Understanding {bonus['attack']}",
                "category": "bonus_analysis",
                "template": "analysis",
                "taxonomy": bonus['attack'],
                "correct_action": "Complete Analysis",
                "neutral_action": "Skip",
                "wrong_action": "Ignore Lesson",
                "difficulty": 0.6,
                "from_address": f"\"Cybersecurity Training\" <training@{self.base_domain}>",
                "reply_to": f"analytics@{malicious_domain}",
                "to_address": "analyst@company.com",
                "crct_mail": support_email,
                "phish_email": phish_email,
                "body_html": f"""
                <div class='bonus-analysis' style='font-family: Arial; padding: 20px; border: 2px solid #4CAF50; border-radius: 10px;'>
                    <h2 style='color: #4CAF50;'>ðŸ¦Š Bonus Level: The {bonus['animal']} Principle</h2>
                    <div style='background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 15px 0;'>
                        <h3>ðŸŒ¿ Nature's Lesson:</h3>
                        <p><em>{bonus['fact']}</em></p>
                    </div>
                    <div style='background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;'>
                        <h3>ðŸ›¡ï¸ Cybersecurity Connection:</h3>
                        <p><strong>{bonus['defense']}</strong></p>
                    </div>
                    <div style='background: #e8f5e8; padding: 15px; border-radius: 8px;'>
                        <h3>ðŸ“Š Analysis Task:</h3>
                        <p>Review the following {bonus['attack']} scenario and identify how it mimics the {bonus['animal']}'s behavior:</p>
                        <ul>
                            <li><strong>Attack Type:</strong> {bonus['attack']}</li>
                            <li><strong>Animal Parallel:</strong> {bonus['animal']}</li>
                            <li><strong>Indicators to analyze:</strong> Deception pattern, trust exploitation, impact mechanism</li>
                        </ul>
                        <p><a href='http://{malicious_domain}/bonus/{bonus['level']}' style='background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Begin Analysis</a></p>
                    </div>
                </div>
                """,
                "body_text": f"Bonus Level: The {bonus['animal']} Principle - {bonus['fact']} Complete your analysis at: http://{malicious_domain}/bonus/{bonus['level']}",
                "links": [f"http://{malicious_domain}/bonus/{bonus['level']}"],
                "has_attachment": True,
                "attachments": [{
                    "name": f"{bonus['attack'].lower().replace(' ', '_')}_analysis_worksheet.pdf",
                    "type": "application/pdf",
                    "size": f"{random.randint(350, 650)}KB"
                }],
                "redirect_url": None,
                "display_url": None,
                "shortener_service": None,
                "ml_prediction_distilbert": None,
                "ml_confidence_distilbert": None,
                "ml_prediction_cnn": None,
                "ml_confidence_cnn": None,
                "user_selected_action": None,
                "timestamp": None
            })

    # =========================================================================
    # FINAL FUSION LEVEL: Advanced Persistent Phishing (APP)
    # =========================================================================

    def generate_final_fusion_level(self):
        """Generate the ultimate level 39: Advanced Persistent Phishing"""
        benign_domain, malicious_domain = self.get_random_domains()
        support_email, phish_email = self.get_random_emails(benign_domain)
        
        self.scenarios.append({
            "scenario_id": self.generate_id("final"),
            "level_no": "l39",
            "title": "âš¡ ADVANCED PERSISTENT PHISHING - FUSION ATTACK",
            "content": "ðŸŽ­ Multi-stage attack combining 7 different phishing techniques",
            "category": "expert",
            "template": "multiphase",
            "taxonomy": "Advanced Persistent Phishing",
            "correct_action": "Report & Isolate",
            "neutral_action": "Monitor",
            "wrong_action": "Engage",
            "difficulty": 0.99,
            "from_address": f"\"CEO Office\" <ceo.directive@{self.base_domain}>",
            "reply_to": f"secure-channel@{malicious_domain}",
            "to_address": "employee@company.com",
            "crct_mail": support_email,
            "phish_email": phish_email,
            "body_html": """
            <div style='font-family: Arial; max-width: 800px; margin: 0 auto; border: 3px solid #ff4444; padding: 20px; border-radius: 15px;'>
                <h1 style='color: #ff4444; text-align: center;'>âš ï¸ FINAL FUSION CHALLENGE âš ï¸</h1>
                <h2 style='text-align: center;'>Advanced Persistent Phishing (APP) Detection</h2>
                
                <div style='background: #000; color: #0f0; padding: 15px; font-family: monospace; border-radius: 8px;'>
                    <p>â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”</p>
                    <p>â”‚  CLASSIFICATION: MULTI-STAGE FUSION ATTACK  â”‚</p>
                    <p>â”‚  THREAT LEVEL: â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ  â”‚</p>
                    <p>â”‚  TECHNIQUES: 7 COMBINED                      â”‚</p>
                    <p>â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜</p>
                </div>

                <div style='margin: 20px 0;'>
                    <h3>ðŸ“‹ Attack Components:</h3>
                    <ul style='list-style-type: none; padding: 0;'>
                        <li style='padding: 8px; background: #fee; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 1: Spear Phishing (Executive Impersonation)</li>
                        <li style='padding: 8px; background: #efe; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 2: Credential Harvesting (Typosquatted Domain)</li>
                        <li style='padding: 8px; background: #fee; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 3: Session Hijacking (MITM)</li>
                        <li style='padding: 8px; background: #efe; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 4: Malicious Attachment (Document Malware)</li>
                        <li style='padding: 8px; background: #fee; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 5: Redirect Chain (3 URL Shorteners)</li>
                        <li style='padding: 8px; background: #efe; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 6: Clone Phishing (Follow-up)</li>
                        <li style='padding: 8px; background: #fee; margin: 5px 0; border-radius: 5px;'>ðŸ”¹ Phase 7: Data Exfiltration (Background)</li>
                    </ul>
                </div>

                <div style='background: #f0f0f0; padding: 20px; border-radius: 8px;'>
                    <h3>ðŸ“§ INITIAL CONTACT:</h3>
                    <p><strong>From:</strong> "CEO Office" &lt;ceo.directive@en-phi-sim.vercel.app&gt;</p>
                    <p><strong>Subject:</strong> CONFIDENTIAL: Urgent Board Directive</p>
                    <hr>
                    <p>Team,</p>
                    <p>The board has approved the Q4 strategic initiative. Attached is the confidential implementation plan requiring your immediate review and digital signature.</p>
                    <p><strong>ðŸ”— Step 1:</strong> <a href='http://tinyurl.com/fusion-stage1'>Access secure document portal</a> (credentials: your employee ID)</p>
                    <p><strong>ðŸ“Ž Attachment:</strong> Q4_strategic_plan.pdf (encrypted)</p>
                    <p><strong>ðŸ”‘ Decryption key:</strong> Provided after portal login</p>
                    <p>This is time-sensitive. Complete by EOD.</p>
                    <p>- CEO Office</p>
                </div>

                <div style='margin-top: 20px; padding: 15px; background: #ffeb3b; border-radius: 8px;'>
                    <p><strong>âš ï¸ CRITICAL NOTE:</strong> This is a fusion attack combining:
                    <br>â€¢ Spoofed sender (CEO impersonation)
                    <br>â€¢ Typosquatted domain in redirect chain
                    <br>â€¢ URL shorteners (tinyurl.com â†’ bit.ly â†’ goo.gl â†’ malicious)
                    <br>â€¢ Malicious PDF with embedded macros
                    <br>â€¢ Clone follow-up if no response in 2 hours
                    <br>â€¢ Credential harvesting on final landing page
                    <br>â€¢ Session cookie theft via MITM</p>
                </div>

                <div style='text-align: center; margin-top: 20px;'>
                    <p><strong>Choose your response:</strong></p>
                    <button style='background: #4CAF50; color: white; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer;'>ðŸš¨ Report & Isolate (Correct)</button>
                    <button style='background: #FFC107; color: black; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer;'>ðŸ‘€ Monitor (Neutral)</button>
                    <button style='background: #f44336; color: white; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px; cursor: pointer;'>âš ï¸ Click Link (Wrong)</button>
                </div>
            </div>
            """,
            "body_text": "FUSION ATTACK DETECTED: Advanced Persistent Phishing combining 7 techniques including CEO fraud, typosquatting, URL shorteners, and malware. This is the final level challenge.",
            "links": [
                "http://tinyurl.com/fusion-stage1",
                "http://bit.ly/fusion-stage2",
                "http://goo.gl/fusion-stage3",
                f"http://{malicious_domain}/final-login"
            ],
            "has_attachment": True,
            "attachments": [
                {"name": "Q4_strategic_plan.pdf", "type": "application/pdf", "size": "2.4MB"},
                {"name": "digital_signature_required.ps1", "type": "application/x-powershell", "size": "45KB"}
            ],
            "redirect_url": "http://secure-boardroom.com/authenticate",
            "display_url": "http://tinyurl.com/fusion-stage1",
            "shortener_service": "multi-stage",
            "ml_prediction_distilbert": None,
            "ml_confidence_distilbert": None,
            "ml_prediction_cnn": None,
            "ml_confidence_cnn": None,
            "user_selected_action": None,
            "timestamp": None
        })

    # =========================================================================
    # MAIN GENERATION METHOD
    # =========================================================================

    def generate_all_scenarios(self):
        """Generate all 39 levels of scenarios"""
        print("\n" + "="*60)
        print("ðŸš€ GENERATING 39-LEVEL PHISHING DATASET")
        print("="*60)

        # Generate 32 standard levels (3 each for l1-l32 = 96 scenarios)
        print("\nðŸ“§ Generating 32 Standard Phishing Levels...")
        self.generate_l1_credential_phishing(3)
        self.generate_l2_scam_invoice(3)
        self.generate_l3_fake_newsletter(3)
        self.generate_l4_lottery_scam(3)
        self.generate_l5_attachment_lure(3)
        self.generate_l6_spoofed_display(3)
        self.generate_l7_typosquatting(3)
        self.generate_l8_url_shortener(3)
        self.generate_l9_malicious_survey(3)
        self.generate_l10_smishing(3)
        self.generate_l11_spear_phishing(2)
        self.generate_l12_whaling(2)
        self.generate_l13_vishing(2)
        self.generate_l14_quishing(2)
        self.generate_l15_pharming(2)
        self.generate_l16_clone_phishing(2)
        self.generate_l17_man_in_middle(2)
        self.generate_l18_watering_hole(2)
        self.generate_l19_credential_stuffing(2)
        self.generate_l20_session_hijacking(1)
        self.generate_l21_to_l32()
        
        std_count = len([s for s in self.scenarios if s['level_no'].startswith('l') and s['level_no'] != 'l39'])
        print(f"âœ“ Generated {std_count} standard scenarios")

        # Generate 6 bonus levels
        print("\nðŸ¦Š Generating 6 Bonus Analysis Levels (Animal Analogies)...")
        self.generate_bonus_levels()
        bonus_count = len([s for s in self.scenarios if s['level_no'].startswith('b')])
        print(f"âœ“ Generated {bonus_count} bonus analysis scenarios")

        # Generate final fusion level
        print("\nâš¡ Generating Final Fusion Level (Advanced Persistent Phishing)...")
        self.generate_final_fusion_level()
        print("âœ“ Generated final level l39")

        # Shuffle scenarios to mix levels
        random.shuffle(self.scenarios)
        
        print("\n" + "="*60)
        print(f"âœ… DATASET COMPLETE: {len(self.scenarios)} TOTAL SCENARIOS")
        print("="*60)
        print(f"â€¢ 32 Standard Levels: {std_count} scenarios")
        print(f"â€¢ 6 Bonus Levels: {bonus_count} scenarios")
        print(f"â€¢ 1 Final Fusion Level: 1 scenario")
        print("="*60)

        return self.scenarios

    def save_to_json(self, filename: str = "EnPhiSim_39Levels.json"):
        """Save scenarios to JSON file"""
        with open(filename, 'w') as f:
            json.dump(self.scenarios, f, indent=2)
        print(f"\nðŸ’¾ Dataset saved to {filename}")
        
        # Verify total count
        print(f"ðŸ“Š Final count: {len(self.scenarios)} scenarios")

    def print_statistics(self):
        """Print dataset statistics"""
        levels = {}
        for s in self.scenarios:
            level = s['level_no']
            if level not in levels:
                levels[level] = 0
            levels[level] += 1
        
        print("\n" + "="*60)
        print("ðŸ“Š DATASET STATISTICS")
        print("="*60)
        for level in sorted(levels.keys()):
            print(f"Level {level}: {levels[level]} scenarios")
        print("="*60)


def main():
    """Main function to generate and save the dataset"""
    print("\n" + "="*60)
    print("ðŸŽ¯ PHISHING SIMULATION DATASET GENERATOR")
    print("="*60)
    print("Domain: en-phi-sim.vercel.app")
    print("Total Levels: 39 (32 Standard + 6 Bonus + 1 Final)")
    
    generator = PhishingDatasetGenerator()
    generator.generate_all_scenarios()
    generator.save_to_json("EnPhiSim_39Levels_Dataset.json")
    generator.print_statistics()
    
    print("\nâœ… Generation complete!")


if __name__ == "__main__":
    main()
