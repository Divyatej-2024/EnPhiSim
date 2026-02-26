import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function MailBrowserLevel() {
  const [activeTab, setActiveTab] = useState('email');
  const [splitView, setSplitView] = useState(true);

  const combinedStyles = `
    .combined-container {
      max-width: 1400px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    .combined-header {
      background: #1a73e8;
      color: white;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .scenario-badge {
      background: #fbbc04;
      color: #202124;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .view-controls {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }

    .view-btn {
      background: rgba(255,255,255,0.1);
      border: none;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 13px;
    }

    .view-btn.active {
      background: white;
      color: #1a73e8;
    }

    .combined-tabs {
      display: flex;
      border-bottom: 2px solid #e0e0e0;
      background: #f8f9fa;
    }

    .combined-tab {
      padding: 12px 24px;
      cursor: pointer;
      font-weight: 500;
      color: #5f6368;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
    }

    .combined-tab.active {
      color: #1a73e8;
      border-bottom-color: #1a73e8;
    }

    .split-view {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: #e0e0e0;
    }

    .split-panel {
      background: #fff;
      min-height: 600px;
      overflow: auto;
    }

    .panel-header {
      background: #f8f9fa;
      padding: 12px 20px;
      border-bottom: 1px solid #e0e0e0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .email-preview-mini {
      padding: 16px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
    }

    .email-preview-mini:hover {
      background: #f5f5f5;
    }

    .email-preview-mini.suspicious {
      border-left: 4px solid #d93025;
    }

    .browser-mini {
      padding: 16px;
    }

    .url-bar-mini {
      background: #f1f3f4;
      padding: 8px 12px;
      border-radius: 20px;
      margin-bottom: 16px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .correlation-indicator {
      background: #e8f0fe;
      padding: 16px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #e0e0e0;
    }

    .correlation-line {
      flex: 1;
      height: 2px;
      background: #dadce0;
      position: relative;
    }

    .correlation-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #d93025;
      position: absolute;
      top: -5px;
    }

    .action-bar-large {
      display: flex;
      gap: 16px;
      padding: 20px;
      justify-content: center;
      border-top: 2px solid #e0e0e0;
    }

    .combined-action {
      padding: 12px 32px;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .combined-action.phish {
      background: #fce8e6;
      color: #d93025;
    }

    .combined-action.safe {
      background: #e6f4ea;
      color: #137333;
    }

    .combined-action.investigate {
      background: #f1f3f4;
      color: #5f6368;
    }

    @media (max-width: 1024px) {
      .split-view { grid-template-columns: 1fr; }
      .split-panel { min-height: auto; }
    }

    @media (max-width: 768px) {
      .combined-header { flex-wrap: wrap; gap: 10px; }
      .view-controls { margin-left: 0; width: 100%; }
      .view-btn { flex: 1; text-align: center; }
      .combined-tabs { overflow-x: auto; white-space: nowrap; }
      .action-bar-large { flex-direction: column; }
      .combined-action { width: 100%; }
    }
  `;

  return (
    <>
      <style>{combinedStyles}</style>
      <BaseLevel levelType="mail+browser">
        {({ level, onAction, locked }) => (
          <div className="combined-container">
            <div className="combined-header">
              <span>📧 + 🌐</span>
              <span><strong>Cross-Platform Scenario:</strong> {level.title}</span>
              <span className="scenario-badge">Phishing Campaign</span>
              <div className="view-controls">
                <button 
                  className={`view-btn ${splitView ? 'active' : ''}`}
                  onClick={() => setSplitView(true)}
                >
                  Split View
                </button>
                <button 
                  className={`view-btn ${!splitView ? 'active' : ''}`}
                  onClick={() => setSplitView(false)}
                >
                  Tabbed View
                </button>
              </div>
            </div>

            <div className="correlation-indicator">
              <span>🔗</span>
              <span><strong>Correlation Detected:</strong> Email link leads to suspicious website</span>
              <div className="correlation-line">
                <div className="correlation-dot" style={{ left: '30%' }}></div>
                <div className="correlation-dot" style={{ left: '70%' }}></div>
              </div>
            </div>

            {splitView ? (
              <div className="split-view">
                {/* Email Panel */}
                <div className="split-panel">
                  <div className="panel-header">
                    <span>📧 Email Client</span>
                    <span style={{ color: '#d93025', fontSize: '12px' }}>Suspicious Detected</span>
                  </div>
                  <div className="email-preview-mini suspicious">
                    <div style={{ fontWeight: '600' }}>{level.email_subject || 'Urgent: Account Security'}</div>
                    <div style={{ fontSize: '13px', color: '#5f6368' }}>From: {level.phish_email}</div>
                    <div style={{ fontSize: '13px', marginTop: '8px' }}>
                      {level.email_preview || 'Your account requires immediate verification...'}
                    </div>
                    <div style={{ marginTop: '8px', color: '#1a73e8' }}>Click here to verify →</div>
                  </div>
                  <div className="email-preview-mini">
                    <div>Newsletter: Weekly Updates</div>
                    <div style={{ fontSize: '12px', color: '#5f6368' }}>From: newsletter@company.com</div>
                  </div>
                </div>

                {/* Browser Panel */}
                <div className="split-panel">
                  <div className="panel-header">
                    <span>🌐 Web Browser</span>
                    <span style={{ color: '#d93025', fontSize: '12px' }}>Security Warning</span>
                  </div>
                  <div className="browser-mini">
                    <div className="url-bar-mini">
                      <span>🔒</span>
                      <span style={{ color: '#d93025' }}>{level.suspicious_url || 'http://suspicious-site.com'}</span>
                    </div>
                    <div style={{ border: '1px solid #f0f0f0', padding: '20px', borderRadius: '8px' }}>
                      <h3>Account Verification Required</h3>
                      <p>Please enter your credentials to continue...</p>
                      <div style={{ 
                        background: '#fce8e6', 
                        padding: '12px', 
                        borderRadius: '4px',
                        fontSize: '13px',
                        marginTop: '16px'
                      }}>
                        ⚠️ This site is impersonating a legitimate service
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="combined-tabs">
                <div 
                  className={`combined-tab ${activeTab === 'email' ? 'active' : ''}`}
                  onClick={() => setActiveTab('email')}
                >
                  📧 Email ({level.email_count || 1})
                </div>
                <div 
                  className={`combined-tab ${activeTab === 'browser' ? 'active' : ''}`}
                  onClick={() => setActiveTab('browser')}
                >
                  🌐 Browser
                </div>
                <div 
                  className={`combined-tab ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  🔍 Correlation Analysis
                </div>
              </div>
            )}

            <div className="action-bar-large">
              <button
                className="combined-action phish"
                disabled={locked}
                onClick={() => onAction('report_campaign', {
                  email: level.phish_email,
                  url: level.suspicious_url,
                  correlation: true
                })}
              >
                🚫 Report Phishing Campaign
              </button>
              <button
                className="combined-action investigate"
                disabled={locked}
                onClick={() => onAction('investigate', {
                  email: level.phish_email,
                  url: level.suspicious_url
                })}
              >
                🔍 Investigate Further
              </button>
              <button
                className="combined-action safe"
                disabled={locked}
                onClick={() => onAction('safe', {
                  email: level.phish_email,
                  url: level.suspicious_url
                })}
              >
                ✅ Mark Both Safe
              </button>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}
