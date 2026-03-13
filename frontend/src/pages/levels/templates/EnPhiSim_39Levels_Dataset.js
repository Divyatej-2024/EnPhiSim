// generate_dataset.js
// Run with: node generate_dataset.js

const fs = require('fs');

// ============================================
// CONFIGURATION
// ============================================

const DOMAINS = {
  LEGIT: {
    company: 'company.com',
    support: 'support.company.com',
    security: 'security.company.com',
    training: 'training.company.com'
  },
  PHISHING: {
    generic: [
      'secure-verify.net',
      'account-update.info',
      'customer-care-center.com',
      'identity-verification.net',
      'security-check.net',
      'document-share.net',
      'payment-portal.info',
      'billing-center.org',
      'shipping-notice.net',
      'message-center.info',
      'login-service.co',
      'verification-system.co',
      'auth-verify.com',
      'profile-update.co',
      'delivery-status.info',
      'credential-check.net',
      'office.net',
      'workplace.co',
      'business.org',
      'enterprise.com',
      'firm.com',
      'organization.org',
      'corporate.org',
      'corporation.net'
    ]
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getRandomPhishingDomain = () => {
  return DOMAINS.PHISHING.generic[Math.floor(Math.random() * DOMAINS.PHISHING.generic.length)];
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateId = (prefix, num) => {
  const paddedNum = num.toString().padStart(5, '0');
  return `${prefix}${paddedNum}`;
};

const formatDate = () => {
  const now = new Date();
  return now.toISOString();
};

// ============================================
// SCENARIO TEMPLATES
// ============================================

const generateMailScenario = (id, level, config) => {
  const phishDomain = getRandomPhishingDomain();
  const legitDomain = DOMAINS.LEGIT.company;
  
  return {
    scenario_id: generateId('sc', id),
    level_no: level,
    title: config.title,
    content: config.content,
    category: config.category,
    template: 'mail',
    taxonomy: config.taxonomy,
    correct_action: 'Report Phish',
    neutral_action: config.neutralAction || 'Ignore',
    wrong_action: config.wrongAction,
    difficulty: config.difficulty,
    from_address: `"${config.fromName}" <${config.fromUser}@${phishDomain}>`,
    reply_to: `${config.replyToUser}@${phishDomain}`,
    to_address: 'employee@company.com',
    crct_mail: `support@${DOMAINS.LEGIT.company}`,
    phish_email: `scam@${phishDomain}`,
    body_html: config.bodyHtml || generateHtmlEmail(config),
    body_text: config.bodyText || generateTextEmail(config),
    links: config.links || [`http://${phishDomain}/${config.linkPath}`],
    has_attachment: config.hasAttachment || false,
    attachments: config.attachments || [],
    redirect_url: `https://${DOMAINS.LEGIT.training}/phishing-awareness/${config.trainingSlug}`,
    display_url: `http://${phishDomain}/${config.linkPath}`,
    shortener_service: config.shortener || null,
    ml_prediction_distilbert: 1,
    ml_confidence_distilbert: Math.min(0.99, 0.95 - (config.difficulty * 0.15)),
    ml_prediction_cnn: 1,
    ml_confidence_cnn: Math.min(0.98, (0.95 - (config.difficulty * 0.15)) * 0.97),
    user_selected_action: null,
    timestamp: null
  };
};

const generateBrowserScenario = (id, level, config) => {
  const phishDomain = getRandomPhishingDomain();
  
  return {
    scenario_id: generateId('sc', id),
    level_no: level,
    title: config.title,
    content: config.content,
    category: config.category,
    template: 'browser',
    taxonomy: config.taxonomy,
    correct_action: 'Report Phish',
    neutral_action: config.neutralAction || 'Check Certificate',
    wrong_action: config.wrongAction,
    difficulty: config.difficulty,
    from_address: null,
    reply_to: null,
    to_address: null,
    crct_mail: `support@${DOMAINS.LEGIT.company}`,
    phish_email: `scam@${phishDomain}`,
    body_html: config.bodyHtml || null,
    body_text: config.bodyText,
    links: config.links || [`http://${phishDomain}/${config.linkPath}`],
    has_attachment: config.hasAttachment || false,
    attachments: config.attachments || [],
    redirect_url: `https://${DOMAINS.LEGIT.training}/phishing-awareness/${config.trainingSlug}`,
    display_url: `http://${phishDomain}/${config.linkPath}`,
    shortener_service: config.shortener || null,
    ml_prediction_distilbert: 1,
    ml_confidence_distilbert: Math.min(0.99, 0.95 - (config.difficulty * 0.15)),
    ml_prediction_cnn: 1,
    ml_confidence_cnn: Math.min(0.98, (0.95 - (config.difficulty * 0.15)) * 0.97),
    user_selected_action: null,
    timestamp: null
  };
};

const generateMessageScenario = (id, level, config) => {
  const phishDomain = getRandomPhishingDomain();
  
  return {
    scenario_id: generateId('sc', id),
    level_no: level,
    title: config.title,
    content: config.content,
    category: config.category,
    template: 'message',
    taxonomy: config.taxonomy,
    correct_action: 'Report Phish',
    neutral_action: config.neutralAction || 'Investigate',
    wrong_action: config.wrongAction,
    difficulty: config.difficulty,
    from_address: `"${config.fromName}" <${config.fromUser}@${phishDomain}>`,
    reply_to: `${config.replyToUser}@${phishDomain}`,
    to_address: '+1-312-555-0145',
    crct_mail: `support@${DOMAINS.LEGIT.company}`,
    phish_email: `scam@${phishDomain}`,
    body_html: null,
    body_text: config.bodyText,
    links: config.links || [`http://${phishDomain}/${config.linkPath}`],
    has_attachment: config.hasAttachment || false,
    attachments: config.attachments || [],
    redirect_url: `https://${DOMAINS.LEGIT.training}/phishing-awareness/${config.trainingSlug}`,
    display_url: `http://${phishDomain}/${config.linkPath}`,
    shortener_service: config.shortener || null,
    ml_prediction_distilbert: 1,
    ml_confidence_distilbert: Math.min(0.99, 0.95 - (config.difficulty * 0.15)),
    ml_prediction_cnn: 1,
    ml_confidence_cnn: Math.min(0.98, (0.95 - (config.difficulty * 0.15)) * 0.97),
    user_selected_action: null,
    timestamp: null
  };
};

const generateBonusScenario = (id, level, config) => {
  const phishDomain = getRandomPhishingDomain();
  
  return {
    scenario_id: generateId('bonus', id),
    level_no: level,
    title: config.title,
    content: config.content,
    category: 'bonus_analysis',
    template: 'analysis',
    taxonomy: config.taxonomy,
    correct_action: 'Complete Analysis',
    neutral_action: 'Skip',
    wrong_action: 'Ignore Lesson',
    difficulty: 0.60,
    from_address: `"Cybersecurity Training" <training@${DOMAINS.LEGIT.training}>`,
    reply_to: `analytics@${phishDomain}`,
    to_address: 'analyst@company.com',
    crct_mail: `support@${DOMAINS.LEGIT.company}`,
    phish_email: `scam@${phishDomain}`,
    body_html: config.bodyHtml,
    body_text: config.bodyText,
    links: [`http://${phishDomain}/bonus/${level}`],
    has_attachment: true,
    attachments: [
      {
        name: `${config.taxonomy.toLowerCase().replace(' ', '_')}_analysis_worksheet.pdf`,
        type: 'application/pdf',
        size: `${getRandomInt(400, 600)}KB`
      }
    ],
    redirect_url: `https://${DOMAINS.LEGIT.training}/bonus-complete`,
    display_url: `http://${phishDomain}/bonus/${level}`,
    shortener_service: null,
    ml_prediction_distilbert: 1,
    ml_confidence_distilbert: 0.95,
    ml_prediction_cnn: 1,
    ml_confidence_cnn: 0.94,
    user_selected_action: null,
    timestamp: null
  };
};

// ============================================
// HTML EMAIL GENERATORS
// ============================================

const generateHtmlEmail = (config) => {
  const styles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px; overflow: hidden; }
      .header { background: #0078d4; color: white; padding: 20px; text-align: center; }
      .content { padding: 30px; }
      .button { display: inline-block; padding: 12px 30px; background: #0078d4; color: white; text-decoration: none; border-radius: 5px; }
      .warning { background: #fff3cd; border-left: 5px solid #ffc107; padding: 15px; margin: 20px 0; }
      .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
  `;

  return `
    <div class="container">
      <div class="header">
        <h2>${config.title}</h2>
      </div>
      <div class="content">
        ${config.bodyHtml || `
          <p>Dear Employee,</p>
          <p>${config.content}</p>
          <div class="warning">
            <strong>⚠️ Action Required:</strong> This requires your immediate attention.
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://${getRandomPhishingDomain()}/${config.linkPath}" class="button">
              ${config.buttonText || 'Click Here'}
            </a>
          </div>
          <p>If you didn't request this, please ignore this message.</p>
        `}
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply.</p>
      </div>
    </div>
  `;
};

const generateTextEmail = (config) => {
  return `${config.title}\n\n${config.content}\n\nAction: ${config.buttonText || 'Click here'}: http://${getRandomPhishingDomain()}/${config.linkPath}`;
};

// ============================================
// SCENARIO CONFIGURATIONS
// ============================================

const scenarios = [];

// ===== LEVEL 1: Easy Credential Phishing =====
scenarios.push(generateMailScenario(1, 'l1', {
  title: '🔐 URGENT: Your Corporate Email Account Requires Verification',
  content: 'Multiple failed login attempts detected from unrecognized device. Verify immediately to prevent account suspension.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'Verify Account',
  difficulty: 0.22,
  fromName: 'IT Security',
  fromUser: 'security',
  replyToUser: 'verify',
  linkPath: 'verify-account',
  buttonText: '🔐 VERIFY ACCOUNT',
  trainingSlug: 'credential-phishing-101',
  hasAttachment: false
}));

scenarios.push(generateMailScenario(2, 'l1', {
  title: '🔐 URGENT: Unusual Sign-in Activity Detected',
  content: 'We detected a sign-in from an unrecognized device in Russia. If this wasn\'t you, your account may be compromised.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'Review Activity',
  difficulty: 0.22,
  fromName: 'Microsoft 365 Security',
  fromUser: 'security',
  replyToUser: 'verify',
  linkPath: 'review-activity',
  buttonText: '🔍 REVIEW ACTIVITY',
  trainingSlug: 'credential-phishing-101'
}));

scenarios.push(generateMailScenario(3, 'l1', {
  title: '🔐 URGENT: Your Password Expires Today',
  content: 'Your corporate password will expire in 24 hours. Update now to maintain access.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'Update Password',
  difficulty: 0.22,
  fromName: 'IT Support',
  fromUser: 'support',
  replyToUser: 'password',
  linkPath: 'update-password',
  buttonText: '🔑 UPDATE PASSWORD',
  trainingSlug: 'credential-phishing-101',
  hasAttachment: true,
  attachments: [{
    name: 'password_guidelines.pdf',
    type: 'application/pdf',
    size: '124KB'
  }]
}));

// ===== LEVEL 2: Financial Fraud =====
scenarios.push(generateMailScenario(4, 'l2', {
  title: '💰 Amazon: Invoice Overdue $499.99',
  content: 'Your Amazon account has an overdue invoice of $499.99. Pay immediately to avoid service interruption.',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Pay Invoice',
  difficulty: 0.24,
  fromName: 'Amazon Billing',
  fromUser: 'billing',
  replyToUser: 'accounts',
  linkPath: 'pay-invoice',
  buttonText: '💳 PAY NOW',
  trainingSlug: 'financial-fraud',
  hasAttachment: true,
  attachments: [{
    name: 'invoice_7229.pdf',
    type: 'application/pdf',
    size: '156KB'
  }]
}));

scenarios.push(generateMailScenario(5, 'l2', {
  title: '💰 LinkedIn: Payment Receipt $1,299.00',
  content: 'Your LinkedIn account has been charged $1,299.00 for Premium Business. Review invoice.',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'View Invoice',
  difficulty: 0.24,
  fromName: 'LinkedIn Billing',
  fromUser: 'billing',
  replyToUser: 'accounts',
  linkPath: 'view-invoice',
  buttonText: '📄 VIEW INVOICE',
  trainingSlug: 'financial-fraud',
  hasAttachment: true,
  attachments: [{
    name: 'invoice_8195.pdf',
    type: 'application/pdf',
    size: '156KB'
  }]
}));

scenarios.push(generateMailScenario(6, 'l2', {
  title: '💰 Office365: Refund Processed $79.99',
  content: 'Your Office365 account has been refunded $79.99. Confirm receipt.',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Confirm Refund',
  difficulty: 0.24,
  fromName: 'Office365 Billing',
  fromUser: 'billing',
  replyToUser: 'refunds',
  linkPath: 'confirm-refund',
  buttonText: '✅ CONFIRM',
  trainingSlug: 'financial-fraud',
  hasAttachment: true,
  attachments: [{
    name: 'refund_9449.pdf',
    type: 'application/pdf',
    size: '156KB'
  }]
}));

// ===== LEVEL 3: Fake Subscriptions =====
scenarios.push(generateMailScenario(7, 'l3', {
  title: '📰 You\'ve Been Subscribed to Forbes Premium',
  content: 'Your subscription to Forbes Premium has been confirmed. Cancel if unauthorized.',
  category: 'easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Ignore',
  wrongAction: 'Cancel Subscription',
  difficulty: 0.26,
  fromName: 'Forbes Subscriptions',
  fromUser: 'subscriptions',
  replyToUser: 'cancel',
  linkPath: 'cancel-forbes',
  buttonText: '🚫 CANCEL',
  trainingSlug: 'social-engineering',
  hasAttachment: true,
  attachments: [{
    name: 'welcome_3902.pdf',
    type: 'application/pdf',
    size: '412KB'
  }]
}));

scenarios.push(generateMailScenario(8, 'l3', {
  title: '📰 You\'ve Been Subscribed to WSJ Premium',
  content: 'Your Wall Street Journal subscription has been confirmed for $389/year.',
  category: 'easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Ignore',
  wrongAction: 'Cancel',
  difficulty: 0.26,
  fromName: 'WSJ Subscriptions',
  fromUser: 'subscriptions',
  replyToUser: 'cancel',
  linkPath: 'cancel-wsj',
  buttonText: '✖️ CANCEL',
  trainingSlug: 'social-engineering'
}));

scenarios.push(generateMailScenario(9, 'l3', {
  title: '📰 You\'ve Been Subscribed to TechCrunch+',
  content: 'Your TechCrunch+ subscription has been confirmed for $99.99/month.',
  category: 'easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Ignore',
  wrongAction: 'Unsubscribe',
  difficulty: 0.26,
  fromName: 'TechCrunch',
  fromUser: 'newsletter',
  replyToUser: 'unsubscribe',
  linkPath: 'unsubscribe-techcrunch',
  buttonText: '🔴 UNSUBSCRIBE',
  trainingSlug: 'social-engineering'
}));

// ===== LEVEL 4: Prize Scams =====
scenarios.push(generateMailScenario(10, 'l4', {
  title: '🎉 Congratulations! You\'ve Won a $500 Gift Card',
  content: 'Your email was selected for our $500 Amazon Gift Card giveaway!',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Claim Prize',
  difficulty: 0.28,
  fromName: 'AWS Giveaways',
  fromUser: 'giveaways',
  replyToUser: 'claim',
  linkPath: 'claim-giftcard',
  buttonText: '🎁 CLAIM NOW',
  trainingSlug: 'prize-scams'
}));

scenarios.push(generateMailScenario(11, 'l4', {
  title: '🎉 Congratulations! You\'ve Won 2 First-Class Tickets',
  content: 'Your LinkedIn profile won 2 first-class tickets to Europe!',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Claim Tickets',
  difficulty: 0.28,
  fromName: 'DocuSign Giveaways',
  fromUser: 'giveaways',
  replyToUser: 'claim',
  linkPath: 'claim-tickets',
  buttonText: '✈️ CLAIM',
  trainingSlug: 'prize-scams',
  hasAttachment: true,
  attachments: [{
    name: 'prize_voucher_7533.pdf',
    type: 'application/pdf',
    size: '215KB'
  }]
}));

scenarios.push(generateMailScenario(12, 'l4', {
  title: '🎉 Congratulations! You\'ve Won an iPhone 15 Pro',
  content: 'Your email was selected for our iPhone 15 Pro giveaway!',
  category: 'easy',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Claim Prize',
  difficulty: 0.28,
  fromName: 'Google Giveaways',
  fromUser: 'giveaways',
  replyToUser: 'claim',
  linkPath: 'claim-iphone',
  buttonText: '📱 CLAIM',
  trainingSlug: 'prize-scams'
}));

// ===== LEVEL 5: Attachment Lures =====
scenarios.push(generateMailScenario(13, 'l5', {
  title: '📎 Shipping Label Ready - Print and Attach',
  content: 'Your shipping label is ready for package #UPS773245.',
  category: 'easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Ignore',
  wrongAction: 'Print Label',
  difficulty: 0.30,
  fromName: 'UPS Shipping',
  fromUser: 'shipping',
  replyToUser: 'documents',
  linkPath: 'shipping-label',
  buttonText: '🖨️ PRINT',
  trainingSlug: 'attachment-warning',
  hasAttachment: true,
  attachments: [{
    name: 'shipping_label.doc',
    type: 'application/msword',
    size: '156KB'
  }]
}));

scenarios.push(generateMailScenario(14, 'l5', {
  title: '📎 New Voicemail Received',
  content: 'You have a new voicemail from an unknown caller.',
  category: 'easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Ignore',
  wrongAction: 'Listen',
  difficulty: 0.30,
  fromName: 'Voicemail System',
  fromUser: 'messages',
  replyToUser: 'voicemail',
  linkPath: 'voicemail',
  buttonText: '▶️ LISTEN',
  trainingSlug: 'attachment-warning',
  hasAttachment: true,
  attachments: [{
    name: 'voicemail.wav',
    type: 'audio/x-wav',
    size: '876KB'
  }]
}));

scenarios.push(generateMailScenario(15, 'l5', {
  title: '📎 Invoice #INV-7823 Ready for Review',
  content: 'Acme Corporation has sent you an invoice for review.',
  category: 'easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Ignore',
  wrongAction: 'Review Document',
  difficulty: 0.30,
  fromName: 'DocuSign',
  fromUser: 'notifications',
  replyToUser: 'documents',
  linkPath: 'invoice-7823',
  buttonText: '✍️ REVIEW',
  trainingSlug: 'attachment-warning',
  hasAttachment: true,
  attachments: [{
    name: 'invoice_7732.pdf',
    type: 'application/pdf',
    size: '215KB'
  }]
}));

// ===== LEVEL 6: Spoofed Senders =====
scenarios.push(generateMailScenario(16, 'l6', {
  title: '⚠️ Important: Your Password Expires',
  content: 'Your Microsoft 365 password will expire in 24 hours.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'Update Password',
  difficulty: 0.32,
  fromName: 'Microsoft 365 Support',
  fromUser: 'service',
  replyToUser: 'support',
  linkPath: 'update-password',
  buttonText: '🔑 UPDATE',
  trainingSlug: 'spoofed-senders',
  hasAttachment: true,
  attachments: [{
    name: 'document_7331.pdf',
    type: 'application/pdf',
    size: '234KB'
  }]
}));

scenarios.push(generateMailScenario(17, 'l6', {
  title: '⚠️ Important: Benefits Enrollment',
  content: 'Open enrollment for 2025 benefits begins today.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'Enroll Now',
  difficulty: 0.32,
  fromName: 'HR Department',
  fromUser: 'hr-service',
  replyToUser: 'benefits',
  linkPath: 'benefits-enrollment',
  buttonText: '📝 ENROLL',
  trainingSlug: 'spoofed-senders'
}));

scenarios.push(generateMailScenario(18, 'l6', {
  title: '⚠️ Important: Document Shared with You',
  content: 'David Miller has shared a document with you via OneDrive.',
  category: 'easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Ignore',
  wrongAction: 'View Document',
  difficulty: 0.32,
  fromName: 'David Miller',
  fromUser: 'd.miller',
  replyToUser: 'shared',
  linkPath: 'view-doc',
  buttonText: '📂 VIEW',
  trainingSlug: 'spoofed-senders'
}));

// ===== LEVEL 7: Typosquatted Domains =====
scenarios.push(generateMailScenario(19, 'l7', {
  title: '🔒 PayPal: Your Account Has Been Limited',
  content: 'Your PayPal account has been limited due to unusual activity.',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'Verify Account',
  difficulty: 0.35,
  fromName: 'PayPal Security',
  fromUser: 'security',
  replyToUser: 'resolution',
  linkPath: 'paypal-verify',
  buttonText: '✅ VERIFY',
  trainingSlug: 'typosquatting',
  linkPath: 'paypa1.com/verify',
  display_url: 'http://paypa1.com/verify'
}));

scenarios.push(generateMailScenario(20, 'l7', {
  title: '📦 Amazon: Your Package Has Been Delayed',
  content: 'Your Amazon package delivery has been delayed due to weather.',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'Track Package',
  difficulty: 0.35,
  fromName: 'Amazon Shipping',
  fromUser: 'shipping',
  replyToUser: 'delivery',
  linkPath: 'amaz0n.com/track',
  buttonText: '📦 TRACK',
  trainingSlug: 'typosquatting'
}));

scenarios.push(generateMailScenario(21, 'l7', {
  title: '👥 LinkedIn: Your Profile Has Been Viewed 87 Times',
  content: 'See who viewed your profile - executives from Google and Microsoft!',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'View Profile Views',
  difficulty: 0.35,
  fromName: 'LinkedIn Security',
  fromUser: 'security',
  replyToUser: 'views',
  linkPath: 'linkedln.com/views',
  buttonText: '🔍 SEE WHO',
  trainingSlug: 'typosquatting'
}));

// ===== LEVEL 8: URL Shorteners =====
scenarios.push(generateBrowserScenario(22, 'l8', {
  title: '🔗 URGENT: Document Shared Securely',
  content: 'A secure document has been shared with you via encrypted link.',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'Access Document',
  difficulty: 0.35,
  bodyText: 'You are being redirected to a secure document portal: http://goo.gl/em74kdmx',
  linkPath: 'goo.gl/em74kdmx',
  shortener: 'goo.gl',
  trainingSlug: 'url-shorteners'
}));

scenarios.push(generateBrowserScenario(23, 'l8', {
  title: '🔗 Secure Document Shared - Access via Link',
  content: 'A confidential document has been shared with you.',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'Access Document',
  difficulty: 0.35,
  bodyText: 'Access your confidential document: http://rebrand.ly/f9p13btl',
  linkPath: 'rebrand.ly/f9p13btl',
  shortener: 'rebrand.ly',
  trainingSlug: 'url-shorteners'
}));

scenarios.push(generateBrowserScenario(24, 'l8', {
  title: '🔗 Important Document Shared - Review Required',
  content: 'Q1 Financial Report 2025 has been shared with you.',
  category: 'advanced_easy',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Investigate',
  wrongAction: 'View Document',
  difficulty: 0.35,
  bodyText: 'Q1 Financial Report ready: http://bit.ly/nzv96fv5',
  linkPath: 'bit.ly/nzv96fv5',
  shortener: 'bit.ly',
  trainingSlug: 'url-shorteners'
}));

// ===== LEVEL 9: Survey Scams =====
scenarios.push(generateMailScenario(25, 'l9', {
  title: '📝 Employee Satisfaction Survey',
  content: 'Take 5 minutes to complete our annual employee survey.',
  category: 'advanced_easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Investigate',
  wrongAction: 'Take Survey',
  difficulty: 0.35,
  fromName: 'HR',
  fromUser: 'hr-surveys',
  replyToUser: 'survey',
  linkPath: 'employee-survey',
  buttonText: '📋 TAKE SURVEY',
  trainingSlug: 'survey-scams'
}));

scenarios.push(generateMailScenario(26, 'l9', {
  title: '🖥️ IT Service Feedback Survey',
  content: 'Help us improve IT services - complete this brief survey.',
  category: 'advanced_easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Investigate',
  wrongAction: 'Take Survey',
  difficulty: 0.35,
  fromName: 'IT Department',
  fromUser: 'it-feedback',
  replyToUser: 'survey',
  linkPath: 'it-survey',
  buttonText: '📋 TAKE SURVEY',
  trainingSlug: 'survey-scams',
  hasAttachment: true,
  attachments: [{
    name: 'survey_preview.pdf',
    type: 'application/pdf',
    size: '98KB'
  }]
}));

scenarios.push(generateMailScenario(27, 'l9', {
  title: '🔐 Security Awareness Survey',
  content: 'Test your cybersecurity knowledge - complete our survey.',
  category: 'advanced_easy',
  taxonomy: 'Social Engineering',
  neutralAction: 'Investigate',
  wrongAction: 'Take Survey',
  difficulty: 0.35,
  fromName: 'Security Team',
  fromUser: 'security-training',
  replyToUser: 'survey',
  linkPath: 'security-survey',
  buttonText: '📝 START',
  trainingSlug: 'survey-scams'
}));

// ===== LEVEL 10: SMS Smishing =====
scenarios.push(generateMessageScenario(28, 'l10', {
  title: '📦 UPS: Your Package is Waiting',
  content: 'Delivery attempt failed - reschedule now.',
  category: 'advanced_easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Investigate',
  wrongAction: 'Click Link',
  difficulty: 0.35,
  fromName: 'UPS',
  fromUser: '+1-800-555-0199',
  replyToUser: '+1-800-555-0199',
  bodyText: 'UPS: We missed you! A delivery attempt was made today. Reschedule: http://fake-delivery-alerts.net/track/kq38mq',
  linkPath: 'fake-delivery-alerts.net/track/kq38mq',
  shortener: 'rebrand.ly',
  trainingSlug: 'smishing'
}));

scenarios.push(generateMessageScenario(29, 'l10', {
  title: '📦 FedEx: Delivery Failed',
  content: 'Package delivery failed - update preferences.',
  category: 'advanced_easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Investigate',
  wrongAction: 'Update Delivery',
  difficulty: 0.35,
  fromName: 'FedEx',
  fromUser: '+1-888-555-0172',
  replyToUser: '+1-888-555-0172',
  bodyText: 'FedEx: Delivery failed for package #7732451245. Update delivery: http://short.link/bs0vfv',
  linkPath: 'short.link/bs0vfv',
  shortener: 'short.link',
  trainingSlug: 'smishing'
}));

scenarios.push(generateMessageScenario(30, 'l10', {
  title: '📦 Amazon: Account Suspended',
  content: 'Your Amazon account has been suspended - verify now.',
  category: 'advanced_easy',
  taxonomy: 'Messaging Attacks',
  neutralAction: 'Investigate',
  wrongAction: 'Verify Account',
  difficulty: 0.35,
  fromName: 'Amazon',
  fromUser: '+1-855-555-0189',
  replyToUser: '+1-855-555-0189',
  bodyText: 'Amazon: Your account has been suspended due to unusual activity. Verify: http://bit.ly/5bx6y6',
  linkPath: 'bit.ly/5bx6y6',
  shortener: 'bit.ly',
  trainingSlug: 'smishing'
}));

// ===== LEVEL 11: Spear Phishing =====
scenarios.push(generateMailScenario(31, 'l11', {
  title: '🎯 Quarterly Budget Review - Action Required',
  content: 'Please review attached Q2 budget documents before board meeting.',
  category: 'medium',
  taxonomy: 'Targeted Phishing',
  neutralAction: 'Verify with Sender',
  wrongAction: 'Review Documents',
  difficulty: 0.38,
  fromName: 'CFO Office',
  fromUser: 'budget',
  replyToUser: 'secure',
  linkPath: 'budget-review',
  buttonText: '📂 ACCESS',
  trainingSlug: 'spear-phishing',
  hasAttachment: true,
  attachments: [{
    name: 'budget_review_confidential.pdf',
    type: 'application/pdf',
    size: '324KB'
  }]
}));

scenarios.push(generateMailScenario(32, 'l11', {
  title: '🎯 Confidential: Salary Review Documents',
  content: 'Your annual salary review documents are ready for review.',
  category: 'medium',
  taxonomy: 'Targeted Phishing',
  neutralAction: 'Verify with Sender',
  wrongAction: 'Review Documents',
  difficulty: 0.38,
  fromName: 'HR Director',
  fromUser: 'hr',
  replyToUser: 'secure',
  linkPath: 'salary-review',
  buttonText: '🔐 ACCESS',
  trainingSlug: 'spear-phishing',
  hasAttachment: true,
  attachments: [{
    name: 'salary_review_confidential.pdf',
    type: 'application/pdf',
    size: '324KB'
  }]
}));

// ===== LEVEL 12: Whaling =====
scenarios.push(generateMailScenario(33, 'l12', {
  title: '🐋 CEO Directive: Urgent Wire Transfer Required',
  content: 'Board approved acquisition of DataCore Systems. Process wire transfer immediately.',
  category: 'medium',
  taxonomy: 'Executive Targeting',
  neutralAction: 'Verify with Executive',
  wrongAction: 'Process Transfer',
  difficulty: 0.40,
  fromName: 'CEO Office',
  fromUser: 'executive',
  replyToUser: 'finance-urgent',
  linkPath: 'authorize-wire',
  buttonText: '💰 AUTHORIZE',
  trainingSlug: 'whaling',
  hasAttachment: true,
  attachments: [{
    name: 'acquisition_terms.pdf',
    type: 'application/pdf',
    size: '1.2MB'
  }]
}));

scenarios.push(generateMailScenario(34, 'l12', {
  title: '🐋 CFO: Confidential Wire Transfer - Q4 Acquisition',
  content: 'Execute wire transfer of $247,500 for DataCore Systems acquisition.',
  category: 'medium',
  taxonomy: 'Executive Targeting',
  neutralAction: 'Verify with Executive',
  wrongAction: 'Execute Transfer',
  difficulty: 0.40,
  fromName: 'CFO Office',
  fromUser: 'cfo',
  replyToUser: 'finance-urgent',
  linkPath: 'confirm-wire',
  buttonText: '✅ CONFIRM',
  trainingSlug: 'whaling',
  hasAttachment: true,
  attachments: [{
    name: 'acquisition_agreement.pdf',
    type: 'application/pdf',
    size: '1.2MB'
  }]
}));

// ===== LEVEL 13: Vishing =====
scenarios.push(generateMailScenario(35, 'l13', {
  title: '📞 IRS: Tax Fraud Investigation - Call Immediately',
  content: 'Case #TAX-7843-22 requires immediate attention.',
  category: 'medium',
  taxonomy: 'Voice Phishing',
  neutralAction: 'Call Official Number',
  wrongAction: 'Call Back Number',
  difficulty: 0.38,
  fromName: 'IRS',
  fromUser: 'tax-dept',
  replyToUser: 'compliance',
  linkPath: 'tax-fraud',
  buttonText: '📞 CALL NOW',
  trainingSlug: 'vishing'
}));

scenarios.push(generateMailScenario(36, 'l13', {
  title: '📞 Bank of America: Fraudulent Transaction Detected',
  content: '$2,847 transaction detected from Miami, FL.',
  category: 'medium',
  taxonomy: 'Voice Phishing',
  neutralAction: 'Call Official Number',
  wrongAction: 'Call Number',
  difficulty: 0.38,
  fromName: 'Bank Security',
  fromUser: 'fraud-alerts',
  replyToUser: 'callback',
  linkPath: 'fraud-alert',
  buttonText: '📞 CALL FRAUD DEPT',
  trainingSlug: 'vishing'
}));

// ===== LEVEL 14: QR Code Phishing =====
scenarios.push(generateMailScenario(37, 'l14', {
  title: '📱 NYC Parking Violation - Scan QR Code to Pay',
  content: 'Citation #7843291-02: $65 due by 3/20.',
  category: 'medium',
  taxonomy: 'QR Code Phishing',
  neutralAction: 'Inspect QR URL',
  wrongAction: 'Scan QR Code',
  difficulty: 0.39,
  fromName: 'NYC Finance',
  fromUser: 'parking',
  replyToUser: 'payments',
  linkPath: 'parking-fine',
  buttonText: '🔳 VIEW QR',
  trainingSlug: 'quishing',
  hasAttachment: true,
  attachments: [{
    name: 'qr_code_parking-fine.png',
    type: 'image/png',
    size: '45KB'
  }]
}));

scenarios.push(generateMailScenario(38, 'l14', {
  title: '📱 Package Delivery Issue - Scan QR Code',
  content: 'Update delivery preferences to receive package.',
  category: 'medium',
  taxonomy: 'QR Code Phishing',
  neutralAction: 'Inspect QR URL',
  wrongAction: 'Scan QR Code',
  difficulty: 0.39,
  fromName: 'USPS',
  fromUser: 'delivery',
  replyToUser: 'resolutions',
  linkPath: 'parcel-delivery',
  buttonText: '🔳 SCAN QR',
  trainingSlug: 'quishing',
  hasAttachment: true,
  attachments: [{
    name: 'qr_code_parcel-delivery.png',
    type: 'image/png',
    size: '45KB'
  }]
}));

// ===== LEVEL 15: DNS Poisoning =====
scenarios.push(generateBrowserScenario(39, 'l15', {
  title: '🔒 Chase: Security Certificate Expired',
  content: 'Certificate for Chase.com expired - renew now.',
  category: 'medium',
  taxonomy: 'DNS Poisoning',
  neutralAction: 'Check Certificate',
  wrongAction: 'Proceed Anyway',
  difficulty: 0.40,
  bodyText: 'Security Warning: Certificate expired for Chase.com. Renew now.',
  linkPath: 'chase-renew',
  trainingSlug: 'pharming'
}));

scenarios.push(generateBrowserScenario(40, 'l15', {
  title: '🔒 Bank of America: Certificate Error',
  content: 'Security certificate requires renewal.',
  category: 'medium',
  taxonomy: 'DNS Poisoning',
  neutralAction: 'Check Certificate',
  wrongAction: 'Proceed Anyway',
  difficulty: 0.40,
  bodyText: 'Bank of America: Security certificate expired. Renew immediately.',
  linkPath: 'bofa-renew',
  trainingSlug: 'pharming'
}));

// ===== LEVEL 16: Clone Phishing =====
scenarios.push(generateMailScenario(41, 'l16', {
  title: '📧 Re: Updated Meeting Invitation',
  content: 'The meeting invitation has been updated with new information.',
  category: 'medium',
  taxonomy: 'Clone Phishing',
  neutralAction: 'Compare with Original',
  wrongAction: 'Open Attachment',
  difficulty: 0.41,
  fromName: 'HR',
  fromUser: 'meetings',
  replyToUser: 'updated',
  linkPath: 'updated-invite',
  buttonText: '📅 VIEW UPDATE',
  trainingSlug: 'clone-phishing',
  hasAttachment: true,
  attachments: [{
    name: 'updated_invite.ics',
    type: 'text/calendar',
    size: '8KB'
  }]
}));

scenarios.push(generateMailScenario(42, 'l16', {
  title: '📧 Updated Shipping Confirmation',
  content: 'Your shipping label has been updated with new tracking.',
  category: 'medium',
  taxonomy: 'Clone Phishing',
  neutralAction: 'Compare with Original',
  wrongAction: 'Open Attachment',
  difficulty: 0.41,
  fromName: 'Shipping',
  fromUser: 'shipping',
  replyToUser: 'updated',
  linkPath: 'updated-label',
  buttonText: '📎 DOWNLOAD',
  trainingSlug: 'clone-phishing',
  hasAttachment: true,
  attachments: [{
    name: 'updated_shipping_label.pdf',
    type: 'application/pdf',
    size: '187KB'
  }]
}));

// ===== LEVEL 17: MITM WiFi =====
scenarios.push(generateBrowserScenario(43, 'l17', {
  title: '🌐 Connect to Cafe WiFi',
  content: 'Free WiFi available - login to access internet.',
  category: 'medium',
  taxonomy: 'MITM Attack',
  neutralAction: 'Use VPN',
  wrongAction: 'Connect & Login',
  difficulty: 0.42,
  bodyText: 'Connect to Cafe WiFi: http://fake-cafe-portal.net/login',
  linkPath: 'cafe-login',
  trainingSlug: 'evil-twin'
}));

scenarios.push(generateBrowserScenario(44, 'l17', {
  title: '🌐 Grand Hotel Guest WiFi',
  content: 'Connect to high-speed internet during your stay.',
  category: 'medium',
  taxonomy: 'MITM Attack',
  neutralAction: 'Use VPN',
  wrongAction: 'Connect & Login',
  difficulty: 0.42,
  bodyText: 'Grand Hotel WiFi: http://fake-hotel-portal.net/login',
  linkPath: 'hotel-login',
  trainingSlug: 'evil-twin'
}));

// ===== LEVEL 18: Watering Hole =====
scenarios.push(generateMailScenario(45, 'l18', {
  title: '📰 Industry News Digest - Cybersecurity Updates',
  content: 'Latest cybersecurity news from industry-news.com',
  category: 'medium',
  taxonomy: 'Watering Hole',
  neutralAction: 'Verify URL',
  wrongAction: 'Read Articles',
  difficulty: 0.43,
  fromName: 'Industry Updates',
  fromUser: 'news',
  replyToUser: 'digest',
  linkPath: 'industry-news',
  buttonText: '📰 READ',
  trainingSlug: 'watering-hole'
}));

scenarios.push(generateMailScenario(46, 'l18', {
  title: '💻 Tech Forum Weekly Digest',
  content: 'Top discussions and code snippets from tech-forum.net',
  category: 'medium',
  taxonomy: 'Watering Hole',
  neutralAction: 'Verify URL',
  wrongAction: 'Read Articles',
  difficulty: 0.43,
  fromName: 'Tech Forum',
  fromUser: 'newsletter',
  replyToUser: 'digest',
  linkPath: 'tech-forum',
  buttonText: '🔍 VIEW',
  trainingSlug: 'watering-hole'
}));

// ===== LEVEL 19: Credential Stuffing =====
scenarios.push(generateMailScenario(47, 'l19', {
  title: '🎬 Netflix: Multiple Failed Login Attempts',
  content: '15 failed login attempts detected - secure your account.',
  category: 'medium',
  taxonomy: 'Credential Stuffing',
  neutralAction: 'Check Account',
  wrongAction: 'Secure Account',
  difficulty: 0.44,
  fromName: 'Netflix Security',
  fromUser: 'security',
  replyToUser: 'alerts',
  linkPath: 'netflix-secure',
  buttonText: '🔒 SECURE',
  trainingSlug: 'credential-stuffing'
}));

scenarios.push(generateMailScenario(48, 'l19', {
  title: '🎵 Spotify: Unusual Login Activity',
  content: 'Login attempts from multiple locations detected.',
  category: 'medium',
  taxonomy: 'Credential Stuffing',
  neutralAction: 'Check Account',
  wrongAction: 'Secure Account',
  difficulty: 0.44,
  fromName: 'Spotify Security',
  fromUser: 'security',
  replyToUser: 'alerts',
  linkPath: 'spotify-secure',
  buttonText: '🔐 SECURE',
  trainingSlug: 'credential-stuffing'
}));

// ===== LEVEL 20: Session Hijacking =====
scenarios.push(generateBrowserScenario(49, 'l20', {
  title: '⏰ Session Expired - Please Login Again',
  content: 'Your session has expired due to inactivity.',
  category: 'medium',
  taxonomy: 'Session Hijacking',
  neutralAction: 'Check URL',
  wrongAction: 'Login Again',
  difficulty: 0.45,
  bodyText: 'Session expired. Please login again to continue.',
  linkPath: 'renew-session',
  trainingSlug: 'session-hijacking'
}));

// ===== LEVEL 21: Evil Twin WiFi =====
scenarios.push(generateBrowserScenario(50, 'l21', {
  title: '📶 Company Guest WiFi Available',
  content: 'Free guest WiFi available in lobby - connect now.',
  category: 'medium',
  taxonomy: 'Wi-Fi Phishing',
  neutralAction: 'Verify Network',
  wrongAction: 'Connect',
  difficulty: 0.46,
  bodyText: 'Company Guest WiFi: Connect to "Company-Guest" network.',
  linkPath: 'company-guest',
  trainingSlug: 'evil-twin'
}));

// ===== LEVEL 22: Tech Support Scam =====
scenarios.push(generateMailScenario(51, 'l22', {
  title: '🖥️ CRITICAL: 5 Viruses Detected',
  content: 'Your computer is infected with 5 viruses! Call now.',
  category: 'medium',
  taxonomy: 'Tech Support Fraud',
  neutralAction: 'Contact IT Directly',
  wrongAction: 'Call Number',
  difficulty: 0.47,
  fromName: 'Microsoft Support',
  fromUser: 'alerts',
  replyToUser: 'help',
  linkPath: 'tech-support',
  buttonText: '📞 CALL NOW',
  trainingSlug: 'tech-support'
}));

// ===== LEVEL 23: Romance Scam =====
scenarios.push(generateMailScenario(52, 'l23', {
  title: '💕 Someone Has a Crush on You!',
  content: 'A colleague added you to their secret crush list.',
  category: 'medium',
  taxonomy: 'Social Engineering',
  neutralAction: 'Ignore',
  wrongAction: 'See Who',
  difficulty: 0.48,
  fromName: 'Dating Connect',
  fromUser: 'dating',
  replyToUser: 'match',
  linkPath: 'reveal-crush',
  buttonText: '💕 SEE WHO',
  trainingSlug: 'romance-scam'
}));

// ===== LEVEL 24: Charity Scam =====
scenarios.push(generateMailScenario(53, 'l24', {
  title: '🤝 Emergency: Help Disaster Victims',
  content: 'Thousands affected by earthquake need your help.',
  category: 'medium',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Research Charity',
  wrongAction: 'Donate Now',
  difficulty: 0.49,
  fromName: 'Global Relief',
  fromUser: 'relief',
  replyToUser: 'donate',
  linkPath: 'donate-relief',
  buttonText: '❤️ DONATE',
  trainingSlug: 'charity-scam'
}));

// ===== LEVEL 25: Job Scam =====
scenarios.push(generateMailScenario(54, 'l25', {
  title: '💼 Remote Position: $150k/year - No Experience Needed',
  content: 'Work from home, flexible hours, $150k starting salary.',
  category: 'medium',
  taxonomy: 'Employment Fraud',
  neutralAction: 'Research Company',
  wrongAction: 'Apply Now',
  difficulty: 0.50,
  fromName: 'HR Recruiting',
  fromUser: 'careers',
  replyToUser: 'apply',
  linkPath: 'apply-job',
  buttonText: '📝 APPLY',
  trainingSlug: 'job-scam',
  hasAttachment: true,
  attachments: [{
    name: 'job_description.pdf',
    type: 'application/pdf',
    size: '234KB'
  }]
}));

// ===== LEVEL 26: Account Verification =====
scenarios.push(generateMailScenario(55, 'l26', {
  title: '🔑 Account Verification Required',
  content: 'Verify your account within 48 hours to avoid suspension.',
  category: 'medium',
  taxonomy: 'Credential Phishing',
  neutralAction: 'Check Official Site',
  wrongAction: 'Verify Now',
  difficulty: 0.51,
  fromName: 'Account Services',
  fromUser: 'verify',
  replyToUser: 'confirm',
  linkPath: 'verify-account',
  buttonText: '✅ VERIFY',
  trainingSlug: 'account-verification'
}));

// ===== LEVEL 27: Shipping Fraud =====
scenarios.push(generateMailScenario(56, 'l27', {
  title: '📦 Package Could Not Be Delivered',
  content: 'Reschedule delivery within 48 hours.',
  category: 'medium',
  taxonomy: 'Shipping Fraud',
  neutralAction: 'Check Tracking',
  wrongAction: 'Reschedule Delivery',
  difficulty: 0.52,
  fromName: 'USPS Delivery',
  fromUser: 'delivery',
  replyToUser: 'reschedule',
  linkPath: 'reschedule',
  buttonText: '📅 RESCHEDULE',
  trainingSlug: 'shipping-fraud'
}));

// ===== LEVEL 28: Scareware =====
scenarios.push(generateBrowserScenario(57, 'l28', {
  title: '⚠️ CRITICAL: 5 Viruses Detected!',
  content: 'Your computer is infected - download antivirus now.',
  category: 'medium',
  taxonomy: 'Scareware',
  neutralAction: 'Run Legitimate Scan',
  wrongAction: 'Download Antivirus',
  difficulty: 0.53,
  bodyText: 'CRITICAL ALERT: 5 viruses detected! Download antivirus immediately.',
  linkPath: 'download-antivirus',
  trainingSlug: 'scareware',
  bodyHtml: '<div style="background: red; color: white; padding: 20px;"><h1>⚠️ CRITICAL ALERT</h1><p>5 viruses detected!</p><a href="http://fake-antivirus.net/download" style="background: white; color: red; padding: 10px;">Download Antivirus</a></div>'
}));

// ===== LEVEL 29: Inheritance Scam =====
scenarios.push(generateMailScenario(58, 'l29', {
  title: '💰 $2.5M Inheritance Waiting for You',
  content: 'You are the beneficiary of an unclaimed estate.',
  category: 'hard',
  taxonomy: 'Financial Fraud',
  neutralAction: 'Ignore',
  wrongAction: 'Claim Inheritance',
  difficulty: 0.54,
  fromName: 'Legal Affairs',
  fromUser: 'attorney',
  replyToUser: 'claim',
  linkPath: 'claim-inheritance',
  buttonText: '⚖️ CLAIM',
  trainingSlug: 'inheritance-scam',
  hasAttachment: true,
  attachments: [{
    name: 'legal_documents.pdf',
    type: 'application/pdf',
    size: '567KB'
  }]
}));

// ===== LEVEL 30: Crypto Scam =====
scenarios.push(generateMailScenario(59, 'l30', {
  title: '₿ Double Your Bitcoin in 24 Hours!',
  content: 'AI trading bot guarantees 100% returns.',
  category: 'hard',
  taxonomy: 'Crypto Fraud',
  neutralAction: 'Research',
  wrongAction: 'Invest Now',
  difficulty: 0.55,
  fromName: 'Crypto Wealth',
  fromUser: 'trading',
  replyToUser: 'invest',
  linkPath: 'invest-crypto',
  buttonText: '₿ INVEST',
  trainingSlug: 'crypto-scam'
}));

// ===== LEVEL 31: Government Fraud =====
scenarios.push(generateMailScenario(60, 'l31', {
  title: '⚖️ IRS: Tax Fraud Investigation',
  content: 'Case #TAX-7843-22 - Respond within 24 hours.',
  category: 'hard',
  taxonomy: 'Government Fraud',
  neutralAction: 'Contact IRS Directly',
  wrongAction: 'Provide Information',
  difficulty: 0.56,
  fromName: 'IRS Tax Division',
  fromUser: 'tax-dept',
  replyToUser: 'compliance',
  linkPath: 'irs-respond',
  buttonText: '📋 RESPOND',
  trainingSlug: 'government-fraud',
  hasAttachment: true,
  attachments: [{
    name: 'tax_notice_2025.pdf',
    type: 'application/pdf',
    size: '234KB'
  }]
}));

// ===== LEVEL 32: Emergency Scam =====
scenarios.push(generateMailScenario(61, 'l32', {
  title: '🆘 Urgent: Family Emergency - Need Help',
  content: 'Cousin stranded in London after robbery - needs $950.',
  category: 'hard',
  taxonomy: 'Emergency Fraud',
  neutralAction: 'Call Family Directly',
  wrongAction: 'Send Money',
  difficulty: 0.57,
  fromName: 'Family Member',
  fromUser: 'emergency',
  replyToUser: 'help',
  linkPath: 'emergency-help',
  buttonText: '🆘 HELP',
  trainingSlug: 'emergency-scam'
}));

// ===== LEVEL 39: Final Boss =====
scenarios.push({
  scenario_id: 'final00068',
  level_no: 'l39',
  title: '⚡ ADVANCED PERSISTENT PHISHING - FUSION ATTACK',
  content: 'Multi-stage attack combining 7 different phishing techniques',
  category: 'expert',
  template: 'multiphase',
  taxonomy: 'Advanced Persistent Phishing',
  correct_action: 'Report & Isolate',
  neutral_action: 'Monitor',
  wrong_action: 'Engage',
  difficulty: 0.99,
  from_address: '"CEO Office" <ceo.directive@corporate-board.com>',
  reply_to: 'secure-channel@attackers-c2.net',
  to_address: 'employee@company.com',
  crct_mail: 'support@company.com',
  phish_email: 'scam@attackers-c2.net',
  body_html: `
    <div style="font-family: Arial; max-width: 800px; margin: 0 auto; border: 3px solid #ff4444; padding: 20px; border-radius: 15px;">
      <h1 style="color: #ff4444; text-align: center;">⚡ FINAL FUSION CHALLENGE ⚡</h1>
      <h2 style="text-align: center;">Advanced Persistent Phishing (APP) Detection</h2>
      <div style="background: #000; color: #0f0; padding: 15px; font-family: monospace; border-radius: 8px;">
        <p>THREAT LEVEL: 7 COMBINED TECHNIQUES</p>
        <p>CEO FRAUD + CLONE PHISHING + CREDENTIAL HARVESTING + MALWARE + VISHING</p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0;">
        <h3>📧 PHASE 1: Spear Phishing</h3>
        <p><strong>From:</strong> "CEO Office" &lt;ceo.directive@corporate-board.com&gt;</p>
        <p><strong>Subject:</strong> CONFIDENTIAL: Urgent Board Directive - Q4 Acquisition</p>
        <p>The board has approved the acquisition of Nexus Technologies. Process attached documents immediately.</p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0;">
        <h3>📧 PHASE 2: Clone Phishing</h3>
        <p><strong>From:</strong> "CEO Office" &lt;ceo.directive@corporate-board.com&gt;</p>
        <p><strong>Subject:</strong> RE: CONFIDENTIAL: Urgent Board Directive - Q4 Acquisition (FOLLOW-UP)</p>
        <p>Did you receive my previous email? This is time-sensitive. Process within 2 hours.</p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0;">
        <h3>📧 PHASE 3: Credential Harvesting</h3>
        <p><strong>From:</strong> "DocuSign" &lt;notifications@docusign-secure.net&gt;</p>
        <p><strong>Subject:</strong> Document Ready for Your Signature - Acquisition Agreement</p>
        <p>Please review and sign the attached agreement using your corporate credentials.</p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0;">
        <h3>📧 PHASE 4: Malicious Attachment</h3>
        <p><strong>From:</strong> "DocuSign" &lt;notifications@docusign-secure.net&gt;</p>
        <p><strong>Subject:</strong> RE: Document Ready for Your Signature - Acquisition Agreement</p>
        <p>Having trouble with the link? Please review the attached PDF directly.</p>
      </div>
      <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; margin: 10px 0;">
        <h3>📧 PHASE 5: Tech Support Scam</h3>
        <p><strong>From:</strong> "Microsoft 365 Support" &lt;support@m365-alerts.net&gt;</p>
        <p><strong>Subject:</strong> CRITICAL: Multiple failed sign-in attempts detected</p>
        <p>We've detected unusual activity on your account. Call our security team immediately.</p>
      </div>
      <div style="background: #ffeb3b; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <p><strong>⚠️ CRITICAL NOTE:</strong> This is a fusion attack combining 7 techniques: CEO fraud, clone phishing, credential harvesting, malware attachment, vishing, and 3 URL shorteners.</p>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <p><strong>Choose your response:</strong></p>
        <button style="background: #4CAF50; color: white; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px;">🚨 Report & Isolate (Correct)</button>
        <button style="background: #FFC107; color: black; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px;">👁️ Monitor (Neutral)</button>
        <button style="background: #f44336; color: white; padding: 10px 20px; margin: 5px; border: none; border-radius: 5px;">⚡ Engage (Wrong)</button>
      </div>
    </div>
  `,
  body_text: 'FUSION ATTACK DETECTED: Advanced Persistent Phishing combining 7 techniques.',
  links: [
    'http://tinyurl.com/fusion-stage1',
    'http://bit.ly/fusion-stage2',
    'http://goo.gl/fusion-stage3'
  ],
  has_attachment: true,
  attachments: [
    {
      name: 'acquisition_agreement_FINAL.pdf',
      type: 'application/pdf',
      size: '2.4MB'
    },
    {
      name: 'digital_signature_request.ps1',
      type: 'application/x-powershell',
      size: '45KB'
    }
  ],
  redirect_url: 'https://company.com/security-training/advanced-persistent',
  display_url: 'http://tinyurl.com/fusion-stage1',
  shortener_service: 'multi-stage',
  ml_prediction_distilbert: 1,
  ml_confidence_distilbert: 0.99,
  ml_prediction_cnn: 1,
  ml_confidence_cnn: 0.98,
  user_selected_action: null,
  timestamp: null
});

// ===== BONUS LEVELS =====
scenarios.push(generateBonusScenario(62, 'b1', {
  title: '🧠 Bonus: The Anglerfish Principle - Understanding Phishing Lures',
  content: 'Deep dive analysis: How cybercriminals use irresistible lures just like anglerfish.',
  taxonomy: 'Phishing',
  bodyHtml: '<div class="bonus"><h2>The Anglerfish Principle</h2><p>Anglerfish use a bioluminescent lure to attract prey - exactly like phishing emails use enticing baits.</p></div>',
  bodyText: 'Bonus: The Anglerfish Principle - How phishing lures work.'
}));

scenarios.push(generateBonusScenario(63, 'b2', {
  title: '🧠 Bonus: The Porcupine Defense - Ransomware Protection',
  content: 'How ransomware attacks like porcupines defend their territory.',
  taxonomy: 'Ransomware',
  bodyHtml: '<div class="bonus"><h2>The Porcupine Principle</h2><p>Porcupines release quills that cause ongoing pain - like ransomware encrypting files.</p></div>',
  bodyText: 'Bonus: The Porcupine Principle - Ransomware protection strategies.'
}));

scenarios.push(generateBonusScenario(64, 'b3', {
  title: '🧠 Bonus: Army Ant Strategy - Understanding DDoS Attacks',
  content: 'How DDoS attacks overwhelm targets like army ants swarming prey.',
  taxonomy: 'DDoS Attacks',
  bodyHtml: '<div class="bonus"><h2>The Army Ant Principle</h2><p>Army ants overwhelm through sheer numbers - exactly like DDoS attacks.</p></div>',
  bodyText: 'Bonus: Army Ant Strategy - DDoS attack patterns.'
}));

scenarios.push(generateBonusScenario(65, 'b4', {
  title: '🧠 Bonus: The Mockingbird Effect - Social Engineering',
  content: 'How social engineers mimic trusted voices like mockingbirds.',
  taxonomy: 'Social Engineering',
  bodyHtml: '<div class="bonus"><h2>The Mockingbird Principle</h2><p>Mockingbirds mimic other birds - like social engineers impersonate trusted entities.</p></div>',
  bodyText: 'Bonus: The Mockingbird Effect - Social engineering tactics.'
}));

scenarios.push(generateBonusScenario(66, 'b5', {
  title: '🧠 Bonus: The Cuckoo\'s Egg - Trojan Horse Detection',
  content: 'How trojan horses hide in plain sight like cuckoo eggs.',
  taxonomy: 'Trojan Horse',
  bodyHtml: '<div class="bonus"><h2>The Cuckoo Principle</h2><p>Cuckoos lay eggs in other birds\' nests - exactly like trojan horses hide in legitimate software.</p></div>',
  bodyText: 'Bonus: The Cuckoo\'s Egg - Trojan horse detection.'
}));

scenarios.push(generateBonusScenario(67, 'b6', {
  title: '🧠 Bonus: The Zombie Ant Phenomenon - Botnet Behavior',
  content: 'How botnets turn devices into zombies like the cordyceps fungus.',
  taxonomy: 'Botnets',
  bodyHtml: '<div class="bonus"><h2>The Zombie Ant Principle</h2><p>Cordyceps fungus controls ants - exactly like botnets control infected devices.</p></div>',
  bodyText: 'Bonus: The Zombie Ant Phenomenon - Botnet behavior analysis.'
}));

// ============================================
// EXPORT FUNCTIONS
// ============================================

const saveToFile = (filename, data) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${data.length} scenarios to ${filename}`);
};

const generateMongoScript = () => {
  let script = '// MongoDB Insert Script\n';
  script += '// Run with: mongo <script>\n\n';
  script += 'db.levelDataset.drop();\n\n';
  
  scenarios.forEach(scenario => {
    const json = JSON.stringify(scenario).replace(/'/g, "\\'");
    script += `db.levelDataset.insertOne(${JSON.stringify(scenario)});\n`;
  });
  
  script += '\nprint(`Inserted ${db.levelDataset.count()} scenarios`);\n';
  
  fs.writeFileSync('insert_scenarios.js', script);
  console.log('✅ Generated insert_scenarios.js');
};

const generateStats = () => {
  const stats = {
    total: scenarios.length,
    byLevel: {},
    byCategory: {},
    byTaxonomy: {},
    byTemplate: {}
  };
  
  scenarios.forEach(s => {
    stats.byLevel[s.level_no] = (stats.byLevel[s.level_no] || 0) + 1;
    stats.byCategory[s.category] = (stats.byCategory[s.category] || 0) + 1;
    stats.byTaxonomy[s.taxonomy] = (stats.byTaxonomy[s.taxonomy] || 0) + 1;
    stats.byTemplate[s.template] = (stats.byTemplate[s.template] || 0) + 1;
  });
  
  fs.writeFileSync('dataset_stats.json', JSON.stringify(stats, null, 2));
  console.log('✅ Generated dataset_stats.json');
  
  console.log('\n📊 DATASET STATISTICS:');
  console.log(`Total Scenarios: ${stats.total}`);
  console.log('\nBy Level:', stats.byLevel);
  console.log('\nBy Category:', stats.byCategory);
  console.log('\nBy Taxonomy:', stats.byTaxonomy);
  console.log('\nBy Template:', stats.byTemplate);
};

// ============================================
// MAIN EXECUTION
// ============================================

console.log('🚀 Generating EnPhiSim Dataset...\n');

saveToFile('enphisim_dataset.json', scenarios);
generateMongoScript();
generateStats();

console.log('\n✅ Dataset generation complete!');
console.log('\n📁 Output files:');
console.log('   - enphisim_dataset.json (JSON format)');
console.log('   - insert_scenarios.js (MongoDB script)');
console.log('   - dataset_stats.json (Statistics)');
