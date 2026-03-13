import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import { useProgress } from "../../../context/ProgressContext";
import "./Template.css";

export default function MailLevel({ scenario, onAction: gameOnAction, locked: gameLocked }) {
  useProgress();
  const [selectedEmail, setSelectedEmail] = useState(0); // Auto-select first email
  const [showDetails, setShowDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("inbox");

  const activeLevel = scenario || {};

  const correctAction = activeLevel.correct_action || 'Report Phish';
const neutralAction = activeLevel.neutral_action || 'Ignore';
const wrongAction = activeLevel.wrong_action || 'Trust & Click';
  
  // Create email from scenario data
  const emails = [
    {
      id: activeLevel.scenario_id || '1',
      unread: true,
      sender: activeLevel.from_address?.split('<')[0]?.trim() || activeLevel.phish_email || "Security Team",
      email: activeLevel.phish_email || "security@example.com",
      subject: activeLevel.title || "Security Notification",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      body: activeLevel.body_text || activeLevel.content,
      isPhishing: true
    }
  ];

  const mailStyles = `
   .mail-container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .mail-header {
      background: #f8f9fa;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #e8f5e9;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      color: #2e7d32;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #4caf50;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .mail-search {
      padding: 8px 16px;
      border: 1px solid #dadce0;
      border-radius: 24px;
      width: 300px;
      font-size: 14px;
      outline: none;
    }

    .mail-search:focus {
      border-color: #1a73e8;
      box-shadow: 0 1px 4px rgba(26,115,232,0.2);
    }

    .mail-layout {
      display: grid;
      grid-template-columns: 250px 1fr;
      min-height: 600px;
    }

    .mail-sidebar {
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      padding: 20px;
    }

    .compose-btn {
      width: 100%;
      padding: 12px;
      background: #1a73e8;
      color: white;
      border: none;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 20px;
      transition: all 0.2s;
    }

    .compose-btn:hover:not(:disabled) {
      background: #1557b0;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .compose-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .folder-list {
      list-style: none;
      padding: 0;
    }

    .folder-item {
      padding: 10px 16px;
      margin: 4px 0;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #202124;
      transition: all 0.2s;
    }

    .folder-item:hover {
      background: #e8f0fe;
    }

    .folder-item.active {
      background: #e8f0fe;
      color: #1a73e8;
      font-weight: 500;
    }

    .folder-count {
      margin-left: auto;
      background: #e8eaed;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
    }

    .mail-content {
      display: grid;
      grid-template-columns: 400px 1fr;
      background: #fff;
    }

    .email-list {
      border-right: 1px solid #e0e0e0;
      overflow-y: auto;
      max-height: 700px;
    }

    .email-item {
      display: grid;
      grid-template-columns: 24px 1fr 80px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.2s;
      align-items: center;
      gap: 12px;
    }

    .email-item:hover {
      background: #f5f5f5;
    }

    .email-item.selected {
      background: #e8f0fe;
      border-left: 4px solid #1a73e8;
    }

    .email-item.unread {
      font-weight: 600;
      background: #fff;
    }

    .email-sender {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: inherit;
    }

    .email-subject {
      color: #5f6368;
      font-size: 0.9rem;
      grid-column: 2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .email-date {
      color: #5f6368;
      font-size: 12px;
      text-align: right;
    }

    .email-preview {
      padding: 30px;
      background: #fff;
      overflow-y: auto;
      max-height: 700px;
    }

    .email-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      margin-bottom: 20px;
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a73e8, #0d47a1);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
    }

    .sender-details {
      flex: 1;
    }

    .sender-name {
      font-size: 18px;
      font-weight: 600;
      color: #202124;
      margin-bottom: 4px;
    }

    .sender-email {
      color: #5f6368;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: help;
      position: relative;
    }

    .email-tooltip {
      position: absolute;
      background: #333;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      bottom: 100%;
      left: 0;
      white-space: nowrap;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .email-body {
      line-height: 1.8;
      color: #333;
      font-size: 15px;
      min-height: 200px;
      white-space: pre-wrap;
    }

    .attachment-area {
      margin: 20px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px dashed #dadce0;
    }

    .attachment {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fff;
      border: 1px solid #dadce0;
      border-radius: 24px;
      cursor: pointer;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      padding: 24px 0;
      border-top: 2px solid #f0f0f0;
      margin-top: 24px;
      justify-content: center;
    }

    .mail-action-btn {
      padding: 12px 32px;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .mail-action-btn.phish {
      background: #fce8e6;
      color: #d93025;
    }

    .mail-action-btn.phish:hover:not(:disabled) {
      background: #fad2cf;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(217,48,37,0.2);
    }

    .mail-action-btn.safe {
      background: #e6f4ea;
      color: #137333;
    }

    .mail-action-btn.safe:hover:not(:disabled) {
      background: #d3e9d9;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(19,115,51,0.2);
    }

    .mail-action-btn.delete {
      background: #f1f3f4;
      color: #5f6368;
    }

    .mail-action-btn.delete:hover:not(:disabled) {
      background: #e8eaed;
      transform: translateY(-2px);
    }

    .mail-action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .phishing-warning-badge {
      background: #fef7e0;
      border: 1px solid #f9ab00;
      color: #202124;
      padding: 12px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @keyframes pulse {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.1); }
      100% { opacity: 1; transform: scale(1); }
    }

    @media (max-width: 1024px) {
      .mail-layout { grid-template-columns: 1fr; }
      .mail-content { grid-template-columns: 1fr; }
      .email-list { max-height: 300px; }
    }

    @media (max-width: 768px) {
      .mail-header { flex-direction: column; }
      .mail-search { width: 100%; }
      .action-buttons { flex-direction: column; }
      .mail-action-btn { width: 100%; justify-content: center; }
    }
  `;

  return (
    <>
      <style>{mailStyles}</style>
      <BaseLevel 
        levelType="mail" 
        scenario={activeLevel} 
        onAction={gameOnAction}
      >
        {({ locked: baseLocked }) => {
          const isLocked = baseLocked || gameLocked;

          const handleAction = (actionType) => {
            if (isLocked) return;
            
            let actionValue;
            switch(actionType) {
             case 'correct':
  actionValue = correctAction;  // 'Report Phish' from your data
  break;
case 'neutral':
  actionValue = neutralAction;  // 'Ignore' from your data
  break;
case 'wrong':
  actionValue = wrongAction;    // 'Trust & Click' from your data
  break;
              default: actionValue = actionType;
            }
            
            gameOnAction(actionValue, {
              scenario_id: activeLevel.scenario_id,
              email: activeLevel.phish_email
            });
          };

          const currentEmail = emails[selectedEmail] || emails[0];

          return (
            <div className="mail-container">
              {/* Header */}
              <div className="mail-header">
                <div className="live-indicator">
                  <span className="live-dot"></span>
                  <span>Live Email Security Simulation</span>
                </div>
                <input 
                  type="text" 
                  className="mail-search"
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={isLocked}
                />
              </div>

              {/* Main Layout */}
              <div className="mail-layout">
                {/* Sidebar */}
                <div className="mail-sidebar">
                  <button className="compose-btn" disabled={isLocked}>
                    + New Message
                  </button>
                  <ul className="folder-list">
                    {['inbox', 'starred', 'sent', 'drafts', 'spam'].map(folder => (
                      <li
                        key={folder}
                        className={`folder-item ${filter === folder ? 'active' : ''}`}
                        onClick={() => !isLocked && setFilter(folder)}
                      >
                        {folder.charAt(0).toUpperCase() + folder.slice(1)}
                        {folder === 'inbox' && <span className="folder-count">1</span>}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Email Content */}
                <div className="mail-content">
                  {/* Email List */}
                  <div className="email-list">
                    {emails.map((email, idx) => (
                      <div
                        key={idx}
                        className={`email-item ${selectedEmail === idx ? 'selected' : ''} ${email.unread ? 'unread' : ''}`}
                        onClick={() => !isLocked && setSelectedEmail(idx)}
                      >
                        <span>{email.unread ? '📧' : '📩'}</span>
                        <div>
                          <div className="email-sender">{email.sender}</div>
                          <div className="email-subject">{email.subject}</div>
                        </div>
                        <span className="email-date">{email.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Email Preview */}
                  <div className="email-preview">
                    {/* Warning Banner */}
                    <div className="phishing-warning-badge">
                      <span>⚠️</span>
                      <span>
                        <strong>Security Alert:</strong> This message contains suspicious elements
                      </span>
                    </div>

                    {/* Email Header */}
                    <div className="email-header">
                      <div className="avatar">
                        {currentEmail.sender?.charAt(0) || '?'}
                      </div>
                      <div className="sender-details">
                        <div className="sender-name">{currentEmail.sender}</div>
                        <div 
                          className="sender-email"
                          onClick={() => setShowDetails(prev => ({ 
                            ...prev, 
                            [activeLevel.scenario_id]: !prev[activeLevel.scenario_id] 
                          }))}
                        >
                          {currentEmail.email}
                          {showDetails[activeLevel.scenario_id] && (
                            <span className="email-tooltip">
                              Real sender: {activeLevel.crct_mail || 'unknown'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Email Body */}
                    <div className="email-body">
                      {activeLevel.body_html ? (
                        <div dangerouslySetInnerHTML={{ __html: activeLevel.body_html }} />
                      ) : (
                        currentEmail.body || "No content available"
                      )}
                    </div>

                    {/* Links Section */}
                    {activeLevel.links && activeLevel.links.length > 0 && (
                      <div className="attachment-area">
                        <strong>Links in this message:</strong>
                        <ul style={{ marginTop: '10px', color: '#d93025' }}>
                          {activeLevel.links.map((link, i) => (
                            <li key={i}>{link}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Attachments */}
                    {activeLevel.has_attachment && (
                      <div className="attachment-area">
                        <div className="attachment">📎 attachment.bin</div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="action-buttons">
                      <button onClick={() => handleAction('correct')} className="action-btn correct">
  {correctAction}  {/* Shows "Report Phish" */}
</button>

<button onClick={() => handleAction('neutral')} className="action-btn neutral">
  {neutralAction}  {/* Shows "Ignore" */}
</button>

<button onClick={() => handleAction('wrong')} className="action-btn wrong">
  {wrongAction}    {/* Shows "Trust & Click" */}
</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </BaseLevel>
    </>
  );
}
