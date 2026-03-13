// frontend/src/pages/levels/templates/MailLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./MailLevel.css";

export default function MailLevel({ level, onAction, locked }) {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("inbox");
  const [showConfirm, setShowConfirm] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  // Use the level data passed from TemplateRenderer
  const activeLevel = level || {};
  
  // Helper function to extract domain from email
  const extractDomain = (emailAddress) => {
    if (!emailAddress) return 'unknown';
    const match = emailAddress.match(/@([^>]+)/);
    return match ? match[1] : 'unknown';
  };
  
  // Create emails array from level data or use fallback
  const emails = Array.isArray(activeLevel.emails) && activeLevel.emails.length > 0
    ? activeLevel.emails
    : [
        {
          unread: true,
          sender: activeLevel.from_address || activeLevel.phish_email || "unknown@example.com",
          subject: activeLevel.subject || activeLevel.title || "Security Notification",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          body: activeLevel.body_html || activeLevel.body_text || activeLevel.content || "No content",
          has_links: activeLevel.links?.length > 0,
          has_attachments: activeLevel.has_attachment
        }
      ];

  // Get current selected email data
  const currentEmail = selectedEmail !== null ? emails[selectedEmail] : emails[0];
  
  // Analyze link risk
  const analyzeLink = (link) => {
    const legitDomain = activeLevel.crct_mail?.split('@')[1];
    const isSuspicious = legitDomain && !link.includes(legitDomain);
    const isShortened = link?.match(/bit\.ly|goo\.gl|tinyurl|ow\.ly|is\.gd|buff\.ly/i);
    const isHttp = link?.startsWith('http:');
    
    return {
      isSuspicious,
      isShortened,
      isHttp,
      riskLevel: (isSuspicious ? 1 : 0) + (isShortened ? 1 : 0) + (isHttp ? 1 : 0)
    };
  };

  // Get risk factors for security analysis
  const getRiskFactors = (email, scenario) => {
    const factors = [];
    
    // Check sender domain
    const senderDomain = email?.sender?.split('@')[1]?.split('>')[0];
    const legitDomain = scenario.crct_mail?.split('@')[1];
    
    if (senderDomain && legitDomain && senderDomain !== legitDomain) {
      factors.push({
        type: 'high',
        text: `Sender domain (${senderDomain}) doesn't match company domain (${legitDomain})`
      });
    }
    
    // Check for urgency in subject/body
    if (email?.subject?.match(/urgent|immediate|action required|alert|warning/i) ||
        scenario.body_text?.match(/urgent|immediate|action required|alert|warning/i)) {
      factors.push({
        type: 'medium',
        text: 'Urgency tactics detected - common in phishing'
      });
    }
    
    // Check links
    if (scenario.links?.length > 0) {
      const suspiciousLinks = scenario.links.filter(link => 
        !link.includes(legitDomain) && 
        link.match(/bit\.ly|goo\.gl|tinyurl|secure-verify|verify-account|account-update/i)
      );
      
      if (suspiciousLinks.length > 0) {
        factors.push({
          type: 'high',
          text: `Suspicious links to external domains detected`
        });
      }
    }
    
    // Check for generic greeting
    if (scenario.body_text?.match(/dear (user|customer|employee|client)/i)) {
      factors.push({
        type: 'medium',
        text: 'Generic greeting - legitimate emails usually address you by name'
      });
    }
    
    // ML confidence
    if (scenario.ml_confidence_distilbert > 0.7) {
      factors.push({
        type: 'high',
        text: `AI detection: ${(scenario.ml_confidence_distilbert * 100).toFixed(1)}% confidence this is phishing`
      });
    }
    
    return factors;
  };

  // Get action description for buttons
  const getActionDescription = (action, scenario) => {
    switch(action) {
      case scenario.correct_action:
        return {
          text: scenario.correct_action || 'Report Phish',
          description: 'Report this email to security team',
          className: 'safe',
          icon: '🚨'
        };
      case scenario.neutral_action:
        return {
          text: scenario.neutral_action || 'Investigate',
          description: 'Look for more indicators before deciding',
          className: 'neutral',
          icon: '🔍'
        };
      case scenario.wrong_action:
        return {
          text: scenario.wrong_action || 'Take Survey',
          description: 'Warning: This may lead to a phishing site',
          className: 'danger',
          icon: '⚠️'
        };
      default:
        return { text: action, className: 'default', icon: '' };
    }
  };

  // Security Analysis Component
  const SecurityAnalysis = ({ email, scenario }) => {
    const riskFactors = getRiskFactors(email, scenario);

    return (
      <div className="security-analysis">
        <h4>🔍 Security Analysis</h4>
        {riskFactors.length > 0 ? (
          <ul className="risk-factors">
            {riskFactors.map((factor, idx) => (
              <li key={idx} className={`risk-${factor.type}`}>
                {factor.type === 'high' ? '🔴' : '🟡'} {factor.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-risk">✓ No immediate risk factors detected</p>
        )}
        
        {scenario.ml_prediction_distilbert === 1 && (
          <div className="ml-warning">
            🤖 Machine Learning Model: This email matches phishing patterns
          </div>
        )}
      </div>
    );
  };

  // Email Header Component
  const EmailHeader = ({ email, scenario, showDetails, setShowDetails }) => {
    const [showFullHeaders, setShowFullHeaders] = useState(false);
    
    const senderDomain = extractDomain(email?.sender);
    const legitDomain = extractDomain(scenario.crct_mail || '');
    const isSuspicious = legitDomain && senderDomain !== legitDomain && legitDomain !== 'unknown';

    return (
      <div className="email-header">
        <div className="avatar">
          {email?.sender?.[0]?.toUpperCase() || '?'}
        </div>
        
        <div className="sender-details">
          <div className="sender-name">
            {email?.sender?.split('<')[0]?.trim() || 'Unknown Sender'}
            {isSuspicious && (
              <span className="suspicious-badge" title="This sender doesn't match company domain">
                ⚠️ External
              </span>
            )}
          </div>
          
          <div className="sender-email-container">
            <div 
              className={`sender-email ${isSuspicious ? 'suspicious' : ''}`}
              onClick={() => setShowFullHeaders(!showFullHeaders)}
            >
              {scenario.phish_email || email?.sender}
            </div>
            
            {showFullHeaders && (
              <div className="email-headers-detail">
                <div><strong>From:</strong> {scenario.from_address || email?.sender}</div>
                <div><strong>Reply-To:</strong> {scenario.reply_to || 'Not specified'}</div>
                <div><strong>To:</strong> {scenario.to_address || 'employee@company.com'}</div>
                {scenario.crct_mail && (
                  <div><strong>Expected sender:</strong> {scenario.crct_mail}</div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="email-metadata">
          <span className="email-time">{email?.time}</span>
          {scenario.has_attachment && <span className="attachment-indicator">📎</span>}
        </div>
      </div>
    );
  };

  // Links Section Component
  const LinksSection = ({ links, displayUrl, scenario }) => {
    return (
      <div className="links-section">
        <div className="links-header">
          <strong>🔗 Links in this email ({links.length})</strong>
          <span className="links-warning">Hover to preview destination</span>
        </div>
        
        <ul className="links-list">
          {links.map((link, idx) => {
            const analysis = analyzeLink(link);
            return (
              <li 
                key={idx} 
                className={`link-item ${analysis.riskLevel > 1 ? 'high-risk' : analysis.riskLevel > 0 ? 'medium-risk' : ''}`}
                onMouseEnter={() => setHoveredLink(link)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <div className="link-display">
                  <span className="link-text">{link}</span>
                  {analysis.isShortened && (
                    <span className="link-badge shortened" title="URL shortener hides actual destination">
                      🔗 Shortened
                    </span>
                  )}
                  {analysis.isHttp && (
                    <span className="link-badge insecure" title="No encryption">
                      ⚠️ HTTP
                    </span>
                  )}
                  {analysis.isSuspicious && (
                    <span className="link-badge suspicious" title="Links to external domain">
                      🚫 External
                    </span>
                  )}
                </div>
                
                {hoveredLink === link && (
                  <div className="link-preview">
                    <div className="preview-header">Destination preview:</div>
                    <div className="preview-url">{link}</div>
                    {analysis.isSuspicious && (
                      <div className="preview-warning">
                        ⚠️ This link goes to {new URL(link).hostname}, not your company domain
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        
        {displayUrl && displayUrl !== links[0] && (
          <div className="url-mismatch-warning">
            ⚠️ Display URL ({displayUrl}) differs from actual link
          </div>
        )}
      </div>
    );
  };

  // Action Buttons Component
  const ActionButtons = ({ scenario, isLocked, handleAction }) => {
    return (
      <div className="action-buttons-container">
        <div className="action-hint">
          💡 What would you do with this email?
        </div>
        
        <div className="action-buttons">
          {[scenario.wrong_action, scenario.neutral_action, scenario.correct_action].map((action, idx) => {
            if (!action) return null;
            
            const actionInfo = getActionDescription(action, scenario);
            const isCorrect = action === scenario.correct_action;
            
            return (
              <div key={idx} className="action-wrapper">
                <button
                  className={`mail-action-btn ${actionInfo.className}`}
                  disabled={isLocked}
                  onClick={() => {
                    if (action === scenario.wrong_action) {
                      setShowConfirm(action);
                    } else {
                      handleAction(action, { 
                        email: scenario.phish_email,
                        type: action === scenario.correct_action ? 'report' : 'investigate',
                        scenario_id: scenario.scenario_id
                      });
                    }
                  }}
                >
                  <span className="action-icon">{actionInfo.icon}</span>
                  <span className="action-text">{actionInfo.text}</span>
                  <span className="action-description">{actionInfo.description}</span>
                </button>
                
                {showConfirm === action && (
                  <div className="confirm-dialog">
                    <p>⚠️ This action might expose you to a phishing site. Are you sure?</p>
                    <div className="confirm-buttons">
                      <button onClick={() => {
                        handleAction(action, { 
                          email: scenario.phish_email,
                          type: 'clicked',
                          scenario_id: scenario.scenario_id
                        });
                        setShowConfirm(null);
                      }}>
                        Yes, proceed
                      </button>
                      <button onClick={() => setShowConfirm(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {scenario.ml_prediction_distilbert === 1 && (
          <div className="ai-recommendation">
            🤖 AI recommends: <strong>{scenario.correct_action}</strong> ({(scenario.ml_confidence_distilbert * 100).toFixed(1)}% confidence)
          </div>
        )}
      </div>
    );
  };

  return (
    <BaseLevel levelType="mail" scenario={activeLevel} onAction={onAction} locked={locked}>
      {({ level: scenario, onAction: handleAction, locked: isLocked }) => (
        <div className="mail-container">
          {/* Header with live indicator and search */}
          <div className="mail-header">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>Live Email Simulation | {new Date().toLocaleTimeString()}</span>
            </div>
            <input 
              type="text" 
              className="mail-search"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Security warning banner if applicable */}
          {activeLevel.show_warning && (
            <div className="security-banner">
              <span className="banner-icon">⚠️</span>
              <span className="banner-text">
                <strong>Security Alert:</strong> This email contains multiple phishing indicators
              </span>
              <button className="banner-details" onClick={() => setShowDetails({...showDetails, show: true})}>
                View Details
              </button>
            </div>
          )}

          {/* Main layout with sidebar and email content */}
          <div className="mail-layout">
            {/* Sidebar with folders */}
            <div className="mail-sidebar">
              <button className="compose-btn" disabled={isLocked}>+ Compose</button>
              <ul className="folder-list">
                {['inbox', 'starred', 'sent', 'drafts', 'spam'].map(folder => (
                  <li 
                    key={folder}
                    className={`folder-item ${filter === folder ? 'active' : ''}`} 
                    onClick={() => setFilter(folder)}
                  >
                    {folder.charAt(0).toUpperCase() + folder.slice(1)}
                    {folder === 'inbox' && <span className="folder-count">{emails.length}</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Email list and preview */}
            <div className="mail-content">
              {/* Email list */}
              <div className="email-list">
                {emails.map((email, idx) => (
                  <div
                    key={idx}
                    className={`email-item ${selectedEmail === idx ? 'selected' : ''} ${email.unread ? 'unread' : ''}`}
                    onClick={() => setSelectedEmail(idx)}
                  >
                    <span className="email-status">{email.unread ? "📧" : "📨"}</span>
                    <div className="email-sender">{email.sender}</div>
                    <div className="email-subject">
                      {email.subject}
                      {extractDomain(email.sender) !== extractDomain(activeLevel.crct_mail) && (
                        <span className="external-badge">external</span>
                      )}
                    </div>
                    <div className="email-date">{email.time}</div>
                  </div>
                ))}
              </div>

              {/* Email preview panel */}
              <div className="email-preview">
                <EmailHeader 
                  email={currentEmail}
                  scenario={activeLevel}
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                />
                
                <div className="email-body">
                  <h3>{activeLevel.title || currentEmail?.subject}</h3>
                  {activeLevel.body_html ? (
                    <div dangerouslySetInnerHTML={{ __html: activeLevel.body_html }} />
                  ) : (
                    <p>{activeLevel.body_text || activeLevel.content || currentEmail?.body}</p>
                  )}
                </div>

                <SecurityAnalysis email={currentEmail} scenario={activeLevel} />

                {activeLevel.links && activeLevel.links.length > 0 && (
                  <LinksSection 
                    links={activeLevel.links}
                    displayUrl={activeLevel.display_url}
                    scenario={activeLevel}
                  />
                )}

                {activeLevel.has_attachment && (
                  <div className="attachments-section">
                    <strong>📎 Attachments ({activeLevel.attachments?.length || 2})</strong>
                    <div className="attachment-list">
                      {(activeLevel.attachments?.length ? activeLevel.attachments : [
                        { name: 'invoice.pdf', size: '2.4 MB' },
                        { name: 'survey.docx', size: '1.1 MB' }
                      ]).map((att, i) => (
                        <div key={i} className="attachment-item">
                          <span className="attachment-icon">📎</span>
                          <span className="attachment-name">{att.name}</span>
                          <span className="attachment-size">{att.size}</span>
                          {att.name?.match(/\.(exe|scr|bat|zip)$/i) && (
                            <span className="attachment-warning">⚠️ Executable file</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <ActionButtons 
                  scenario={activeLevel}
                  isLocked={isLocked}
                  handleAction={handleAction}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
