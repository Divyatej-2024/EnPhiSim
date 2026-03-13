// frontend/src/pages/levels/TemplateRenderer.js
import React from 'react';

// Import all template components
import MailLevel from './templates/MailLevel';
import BrowserLevel from './templates/BrowserLevel';
import MessageLevel from './templates/MessageLevel';
import NotificationLevel from './templates/NotificationLevel';
import ImageLevel from './templates/ImageLevel';
import MailBrowserLevel from './templates/MailBrowserLevel';
import MailBrowserMessageLevel from './templates/MailBrowserMessageLevel';

// Add these imports
import AnalysisLevel from './templates/AnalysisLevel';
import MultiphaseLevel from './templates/MultiphaseLevel';

// Template type mapping based on your data
const templateMap = {
  // Email-based phishing
  'mail': MailLevel,
  'email': MailLevel,
  'phishing': MailLevel,
   'analysis': AnalysisLevel,
  'bonus': AnalysisLevel,
  'multiphase': MultiphaseLevel,
  'advanced': MultiphaseLevel,
  // Browser/web-based
  'browser': BrowserLevel,
  'web': BrowserLevel,
  'website': BrowserLevel,
  
  // SMS/Message-based
  'message': MessageLevel,
  'sms': MessageLevel,
  'smishing': MessageLevel,
  
  // System notifications
  'notification': NotificationLevel,
  'alert': NotificationLevel,
  'popup': NotificationLevel,
  
  // Image-based
  'image': ImageLevel,
  'qr': ImageLevel,
  'quishing': ImageLevel,
  
  // Multi-channel
  'mail + browser': MailBrowserLevel,
  'mail+browser': MailBrowserLevel,
  'email+web': MailBrowserLevel,
  
  'mail + browser + message': MailBrowserMessageLevel,  // OK
  'mail+browser+message': MailBrowserMessageLevel,       // OK
  'multi': MailBrowserMessageLevel,
  
  // Default fallback
  'default': MailLevel
};

export default function TemplateRenderer({ scenario, onAction, locked }) {
  if (!scenario) {
    console.error('TemplateRenderer: No scenario provided');
    return (
      <div className="error-container">
        <h3>No Scenario Data</h3>
        <p>Unable to load this level.</p>
      </div>
    );
  }



  // Determine template type - check multiple possible fields
  const templateType = 
    scenario.template || 
    scenario.template_type || 
    scenario.type || 
    'default';
  const normalizedTemplateType = String(templateType).toLowerCase().trim();


  // Get the appropriate template component
  const TemplateComponent = templateMap[normalizedTemplateType] || templateMap['default'];
  
  if (!TemplateComponent) {
    console.error(`No template found for type: ${normalizedTemplateType}`);
    return (
      <div className="error-container">
        <h3>Template Not Found</h3>
        <p>Type: {normalizedTemplateType}</p>
      </div>
    );
  }

  // Render the template with ALL scenario data
  return (
    <TemplateComponent 
      level={scenario}
      onAction={onAction}
      locked={locked}
    />
  );
}
