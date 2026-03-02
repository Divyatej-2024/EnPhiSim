import React from 'react';
import MailLevel from './templates/MailLevel';
import BrowserLevel from './templates/BrowserLevel';
import MessageLevel from './templates/MessageLevel';
import NotificationLevel from './templates/NotificationLevel';
import ImageLevel from './templates/ImageLevel';
import MailBrowserLevel from './templates/MailBrowserLevel';
import MailBrowserMessageLevel from './templates/MailBrowserMessageLevel';

// Template type mapping based on your data
const templateMap = {
  // Email-based phishing
  'mail': MailLevel,
  'email': MailLevel,
  'phishing': MailLevel,
  
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
  
  'mail + browser + message': MailBrowserMessageLevel,
  'mail+browser+message': MailBrowserMessageLevel,
  'multi': MailBrowserMessageLevel,
  
  // Default fallback
  'default': MailLevel
};

export default function TemplateRenderer({ scenario, onAction, locked }) {
  if (!scenario) {
    return <div>No scenario data</div>;
  }

console.log('Rendering scenario:', {
  id : scenario.scenario_id,
  title: scenario.title,
  template: scenario.template,
  template_type: scenario.template_type,
  taxonomy: scenario.taxonomy
});  

const templateType = 
  scenario.template ||
  scenario.template_type ||
  scenario.type ||
  'default';

console.log('using template type:', templateType);

const TemplateComponent = templateMap[templateType] || templateMap['default'];

if (!TemplateComponent) {
 console.error('No template found for type: ${templateType}'); 
}

return (
    <div className="email-card">
      <h3>{scenario.title || 'Phishing Email'}</h3>
      <p><strong>From:</strong> {scenario.from_address || 'Unknown'}</p>
      <p><strong>Reply-To:</strong> {scenario.reply_to || 'None'}</p>
      <p><strong>To:</strong> {scenario.to_address || 'Unknown'}</p>
      <p>{scenario.content || scenario.body_text}</p>
      
      {scenario.links && scenario.links.length > 0 && (
        <div className="links-section">
          <p><strong>Links:</strong></p>
          <ul>
            {scenario.links.map((link, i) => (
              <li key={i}>{link}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="action-buttons">
        <button onClick={() => onAction('Trust & Click')} disabled={locked}>
          Trust & Click
        </button>
        <button onClick={() => onAction('Ignore')} disabled={locked}>
          Ignore
        </button>
        <button onClick={() => onAction('Report Phish')} disabled={locked}>
          Report Phish
        </button>
      </div>
    </div>
  );

  return (
    <TemplateComponent
    level={scenario}
    onAction={onAction}
    locked={locked}
    />
  );
}
