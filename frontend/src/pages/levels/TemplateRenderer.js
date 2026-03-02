import React from 'react';

export default function TemplateRenderer({ scenario, onAction, locked }) {
  if (!scenario) {
    return <div>No scenario data</div>;
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
}