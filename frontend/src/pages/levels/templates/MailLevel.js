import React, { useState,useEffect } from "react";
import BaseLevel from "./BaseLevel";
import { useProgress } from "../../../context/ProgressContext";
import BACKEND_URL from "../../../api";

export default function MailLevel({levelId}) {
  const { getLevelScenario } =useProgress();
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [levelScenario, setLevelScenario] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("inbox");

  // const BACKEND_URL =
  // process.env.REACT_APP_API_URL || "https://your-backend-domain.com";


  // Check if a scenario was already picked in progress
  useEffect(() => {
  const fetchScenario = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/scenarios?level_no=l1&limit=1`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch scenario");
      }

      const data = await response.json();

      console.log("MailLevel API:", data);

      setLevelScenario(data[0]); // because backend returns array
    } catch (error) {
      console.error("MailLevel fetch error:", error);
    }
  };

  fetchScenario();
}, []);
    
    
  const mailStyles = `
    .mail-container {
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

    .compose-btn:hover {
      background: #1557b0;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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
      grid-template-columns: 24px 180px 1fr 80px;
      padding: 16px 20px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.2s;
      align-items: center;
      gap: 12px;
    }

    .email-item:hover {
      background: #f5f5f5;
      transform: translateX(2px);
    }

    .email-item.selected {
      background: #e8f0fe;
      border-left: 4px solid #1a73e8;
    }

    .email-item.unread {
      font-weight: 600;
      background: #fef9e7;
    }

    .email-sender {
      color: #202124;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email-subject {
      color: #5f6368;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .email-date {
      color: #5f6368;
      font-size: 12px;
      text-align: right;
    }

    .email-preview {
      padding: 30px;
      background: #fff;
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
      min-height: 300px;
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
      margin-right: 12px;
      cursor: pointer;
    }

    .attachment:hover {
      background: #f1f3f4;
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
  `;

  return (
    <>
      <style>{mailStyles}</style>
      <BaseLevel levelType="mail">
        {({ level, onAction, locked }) => (
          <div className="mail-container">
            <div className="mail-header">
              <div className="live-indicator">
                <span className="live-dot"></span>
                <span>Live Email Simulation • {new Date().toLocaleTimeString()}</span>
              </div>
              <input 
                type="text" 
                className="mail-search"
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mail-layout">
              <div className="mail-sidebar">
                <button className="compose-btn">+ Compose</button>
                <ul className="folder-list">
                  <li className={`folder-item ${filter === 'inbox' ? 'active' : ''}`} onClick={() => setFilter('inbox')}>
                    Inbox <span className="folder-count">{level.inbox_count || '12'}</span>
                  </li>
                  <li className={`folder-item ${filter === 'starred' ? 'active' : ''}`} onClick={() => setFilter('starred')}>
                     Starred
                  </li>
                  <li className={`folder-item ${filter === 'sent' ? 'active' : ''}`} onClick={() => setFilter('sent')}>
                     Sent
                  </li>
                  <li className={`folder-item ${filter === 'drafts' ? 'active' : ''}`} onClick={() => setFilter('drafts')}>
                     Drafts
                  </li>
                  <li className={`folder-item ${filter === 'spam' ? 'active' : ''}`} onClick={() => setFilter('spam')}>
                     Spam
                  </li>
                </ul>
              </div>

              <div className="mail-content">
                <div className="email-list">
                  {level.emails?.map((email, idx) => (
                    <div
                      key={idx}
                      className={`email-item ${selectedEmail === idx ? 'selected' : ''} ${email.unread ? 'unread' : ''}`}
                      onClick={() => setSelectedEmail(idx)}
                    >
                      <span>{email.unread ? '📧' : '📨'}</span>
                      <span className="email-sender">{email.sender || level.phish_email}</span>
                      <span className="email-subject">{email.subject || level.subject}</span>
                      <span className="email-date">{email.time || '10:30 AM'}</span>
                    </div>
                  ))}
                </div>

                <div className="email-preview">
                  {level.show_warning && (
                    <div className="phishing-warning-badge">
                      <span></span>
                      <span><strong>Security Alert:</strong> This email contains suspicious elements</span>
                    </div>
                  )}

                  <div className="email-header">
                    <div className="avatar">
                      {level.phish_email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="sender-details">
                      <div className="sender-name">
                        {level.from_and_to?.split('<')[0]?.trim() || 'Unknown Sender'}
                      </div>
                      <div 
                        className="sender-email"
                        onMouseEnter={() => setShowDetails(prev => ({ ...prev, [level.id]: true }))}
                        onMouseLeave={() => setShowDetails(prev => ({ ...prev, [level.id]: false }))}
                      >
                        {level.phish_email}
                        {showDetails[level.id] && (
                          <span className="email-tooltip">
                             Real sender: {level.crct_email}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="email-body">
                    {level.level_text || level.content || "No content available"}
                  </div>

                  {level.has_attachments && (
                    <div className="attachment-area">
                      <div className="attachment">
                         invoice.pdf (2.4 MB)
                      </div>
                      <div className="attachment">
                        document.docx (1.1 MB)
                      </div>
                    </div>
                  )}

                  <div className="action-buttons">
                    <button
                      className="mail-action-btn phish"
                      disabled={locked}
                      onClick={() => onAction('report', { 
                        email: level.phish_email,
                        type: 'phishing'
                      })}
                    >
                       Report Phishing
                    </button>
                    <button
                      className="mail-action-btn delete"
                      disabled={locked}
                      onClick={() => onAction('delete', { 
                        email: level.phish_email 
                      })}
                    >
                       Delete
                    </button>
                    <button
                      className="mail-action-btn safe"
                      disabled={locked}
                      onClick={() => onAction('safe', { 
                        email: level.phish_email 
                      })}
                    >
                       Mark Safe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}
