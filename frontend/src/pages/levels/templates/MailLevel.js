// frontend/src/pages/levels/templates/MailLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
// import { useProgress } from "../../../context/ProgressContext"; // Uncomment if needed
import "./MailLevel.css"; // ✅ Move CSS to separate file

export default function MailLevel({ level:scenario, onAction }) {
  // useProgress(); // Uncomment if needed
  
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("inbox");

  // Use the level data passed from TemplateRenderer
  const activeLevel = level || {};
  
  // Create emails array from level data or use fallback
  const emails = Array.isArray(activeLevel.emails) && activeLevel.emails.length > 0
    ? activeLevel.emails
    : [
        {
          unread: true,
          sender: activeLevel.from_address || activeLevel.phish_email || "unknown@example.com",
          subject: activeLevel.subject || activeLevel.subj || "Security Notification",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          body: activeLevel.body_html || activeLevel.body_text || activeLevel.content || "No content",
          has_links: activeLevel.links?.length > 0,
          has_attachments: activeLevel.has_attachment
        }
      ];

  // Get current selected email data
  const currentEmail = selectedEmail !== null ? emails[selectedEmail] : emails[0];
  
return (
  <BaseLevel levelType="mail" scenario={activeLevel} onAction={onAction} locked={locked}>
    {({ level: scenario, onAction: handleAction, locked: isLocked }) => (
      <div className="mail-container">
        {/* Header */}
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
            <button className="banner-details" onClick={() => setShowDetails(true)}>
              View Details
            </button>
          </div>
        )}

        {/* Main layout */}
        <div className="mail-layout">
          {/* Sidebar (unchanged) */}
          <div className="mail-sidebar">
            {/* ... existing sidebar code ... */}
          </div>

          {/* Email content */}
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
                    {extractDomain(email.sender) !== extractDomain(scenario.crct_mail) && (
                      <span className="external-badge">external</span>
                    )}
                  </div>
                  <div className="email-date">{email.time}</div>
                </div>
              ))}
            </div>

            {/* Email preview */}
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

              {activeLevel.links?.length > 0 && (
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
