// frontend/src/pages/levels/templates/MailLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
// import { useProgress } from "../../../context/ProgressContext"; // Uncomment if needed
import "./MailLevel.css"; // ✅ Move CSS to separate file

export default function MailLevel({ level: scenario }) {
  // useProgress(); // Uncomment if needed
  
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("inbox");

  // Use the level data passed from TemplateRenderer
  const activeLevel = scenario || {};
  
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
                    <span>{email.unread ? "📧" : "📨"}</span>
                    <span className="email-sender">{email.sender}</span>
                    <span className="email-subject">{email.subject}</span>
                    <span className="email-date">{email.time}</span>
                  </div>
                ))}
              </div>

              {/* Email preview panel */}
              <div className="email-preview">
                {/* Warning badge for suspicious emails */}
                {activeLevel.show_warning && (
                  <div className="phishing-warning-badge">
                    <span><strong>Security Alert:</strong> This email contains suspicious elements</span>
                  </div>
                )}

                {/* Email header with sender info */}
                <div className="email-header">
                  <div className="avatar">
                    {currentEmail?.sender?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="sender-details">
                    <div className="sender-name">
                      {currentEmail?.sender?.split('<')[0]?.trim() || 'Unknown Sender'}
                    </div>
                    <div 
                      className="sender-email"
                      onClick={() => setShowDetails(prev => ({ 
                        ...prev, 
                        [scenario?.id || 'main']: !prev[scenario?.id || 'main'] 
                      }))}
                    >
                      {activeLevel.phish_email || currentEmail?.sender}
                      {showDetails[scenario?.id || 'main'] && (
                        <span className="email-tooltip">
                          Real sender: {activeLevel.crct_email || activeLevel.from_address || 'Unknown'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email body */}
                <div className="email-body">
                  <h3>{activeLevel.title || currentEmail?.subject}</h3>
                  {activeLevel.body_html ? (
                    <div dangerouslySetInnerHTML={{ __html: activeLevel.body_html }} />
                  ) : (
                    <p>{activeLevel.body_text || activeLevel.content || currentEmail?.body}</p>
                  )}
                </div>

                {/* Links section */}
                {activeLevel.links && activeLevel.links.length > 0 && (
                  <div className="links-section">
                    <p><strong> Links in this email:</strong></p>
                    <ul>
                      {activeLevel.links.map((link, i) => (
                        <li key={i} className="suspicious-link">{link}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attachments section */}
                {activeLevel.has_attachment && (
                  <div className="attachment-area">
                    {activeLevel.attachments?.map((att, i) => (
                      <div key={i} className="attachment">
                         {att.name || 'file.pdf'} ({att.size || 'Unknown'})
                      </div>
                    )) || (
                      <>
                        <div className="attachment">📎 invoice.pdf (2.4 MB)</div>
                        <div className="attachment">📎 document.docx (1.1 MB)</div>
                      </>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="action-buttons">
                  <button
                    className="mail-action-btn phish"
                    disabled={isLocked}
                    onClick={() => handleAction(
                      activeLevel.wrong_action || 'Trust & Click', 
                      { 
                        email: activeLevel.phish_email,
                        type: 'phishing',
                        scenario_id: activeLevel.scenario_id
                      }
                    )}
                  >
                     {activeLevel.wrong_action || 'Trust & Click'}
                  </button>
                  <button
                    className="mail-action-btn delete"
                    disabled={isLocked}
                    onClick={() => handleAction(
                      activeLevel.neutral_action || 'Ignore',
                      { 
                        email: activeLevel.phish_email,
                        scenario_id: activeLevel.scenario_id
                      }
                    )}
                  >
                     {activeLevel.neutral_action || 'Ignore'}
                  </button>
                  <button
                    className="mail-action-btn safe"
                    disabled={isLocked}
                    onClick={() => handleAction(
                      activeLevel.correct_action || 'Report Phish',
                      { 
                        email: activeLevel.phish_email,
                        scenario_id: activeLevel.scenario_id
                      }
                    )}
                  >
                     {activeLevel.correct_action || 'Report Phish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
