import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function MailBrowserMessageLevel() {
  const [activePlatform, setActivePlatform] = useState('email');

  const tripleStyles = `
    .triple-container {
      max-width: 1600px;
      margin: 0 auto;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    .threat-header {
      background: linear-gradient(135deg, #d93025, #b4231a);
      color: white;
      padding: 20px 24px;
    }

    .threat-title {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }

    .threat-badge {
      background: #fbbc04;
      color: #202124;
      padding: 4px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }

    .threat-stats {
      display: flex;
      gap: 24px;
      font-size: 14px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .platform-tabs {
      display: flex;
      background: #f8f9fa;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 20px;
    }

    .platform-tab {
      padding: 16px 24px;
      cursor: pointer;
      font-weight: 500;
      color: #5f6368;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .platform-tab.active {
      color: #d93025;
      border-bottom-color: #d93025;
    }

    .platform-tab.warning {
      position: relative;
    }

    .warning-dot {
      width: 8px;
      height: 8px;
      background: #d93025;
      border-radius: 50%;
      position: absolute;
      top: 12px;
      right: 12px;
    }

    .triple-content {
      display: grid;
      grid-template-columns: 300px 1fr 300px;
      min-height: 600px;
    }

    .timeline-panel {
      background: #f8f9fa;
      border-right: 1px solid #e0e0e0;
      padding: 20px;
    }

    .timeline-title {
      font-weight: 600;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .timeline-event {
      padding: 12px;
      border-left: 3px solid #dadce0;
      margin-left: 12px;
      margin-bottom: 16px;
      position: relative;
    }

    .timeline-event::before {
      content: '';
      width: 12px;
      height: 12px;
      background: #dadce0;
      border-radius: 50%;
      position: absolute;
      left: -18px;
      top: 16px;
    }

    .timeline-event.suspicious {
      border-left-color: #d93025;
    }

    .timeline-event.suspicious::before {
      background: #d93025;
    }

    .event-time {
      font-size: 11px;
      color: #9aa0a6;
      margin-bottom: 4px;
    }

    .event-platform {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .event-desc {
      font-size: 13px;
      color: #202124;
    }

    .main-panel {
      padding: 20px;
      overflow-y: auto;
    }

    .insights-panel {
      background: #f8f9fa;
      border-left: 1px solid #e0e0e0;
      padding: 20px;
    }

    .insight-card {
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .insight-title {
      font-weight: 600;
      color: #202124;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .threat-level {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }

    .threat-high {
      background: #fce8e6;
      color: #d93025;
    }

    .correlation-line-triple {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 20px 0;
      padding: 16px;
      background: #fff3cd;
      border-radius: 8px;
    }

    .platform-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .threat-actions {
      display: flex;
      gap: 12px;
      padding: 20px;
      border-top: 2px solid #e0e0e0;
      justify-content: center;
    }

    .threat-action-btn {
      padding: 12px 32px;
      border: none;
      border-radius: 24px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .threat-action-btn.emergency {
      background: #d93025;
      color: white;
    }

    .threat-action-btn.emergency:hover:not(:disabled) {
      background: #b4231a;
    }

    @media (max-width: 1200px) {
      .triple-content { grid-template-columns: 1fr; }
      .timeline-panel, .insights-panel { border: 0; border-top: 1px solid #e0e0e0; }
    }

    @media (max-width: 768px) {
      .threat-header { padding: 12px; }
      .threat-title { flex-wrap: wrap; }
      .threat-stats { flex-direction: column; gap: 8px; }
      .platform-tabs { overflow-x: auto; white-space: nowrap; padding: 0 10px; }
      .platform-tab { padding: 12px; }
      .threat-actions { flex-direction: column; }
      .threat-action-btn { width: 100%; }
    }
  `;

  const renderPlatformContent = () => {
    switch(activePlatform) {
      case 'email':
        return (
          <div>
            <h3>📧 Suspicious Email</h3>
            <div style={{ background: '#fce8e6', padding: '20px', borderRadius: '8px' }}>
              <p><strong>From:</strong> security@paypa1.com</p>
              <p><strong>Subject:</strong> Urgent: Account Limited</p>
              <p>Your account has been limited. Click here to verify →</p>
            </div>
          </div>
        );
      case 'browser':
        return (
          <div>
            <h3>🌐 Suspicious Website</h3>
            <div style={{ background: '#fce8e6', padding: '20px', borderRadius: '8px' }}>
              <p><strong>URL:</strong> http://paypa1-verify.com</p>
              <p><strong>Status:</strong> Phishing site detected</p>
              <p>This site is impersonating PayPal</p>
            </div>
          </div>
        );
      case 'message':
        return (
          <div>
            <h3>💬 Suspicious Message</h3>
            <div style={{ background: '#fce8e6', padding: '20px', borderRadius: '8px' }}>
              <p><strong>From:</strong> +1 (234) 567-8901</p>
              <p><strong>Message:</strong> Your PayPal account needs verification. Click here: http://bit.ly/xyz123</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <style>{tripleStyles}</style>
      <BaseLevel levelType="mail+browser+message">
        {({ level, onAction, locked }) => (
          <div className="triple-container">
            <div className="threat-header">
              <div className="threat-title">
                <span>🚨</span>
                <h2>Multi-Channel Phishing Attack Detected</h2>
                <span className="threat-badge">CRITICAL</span>
              </div>
              <div className="threat-stats">
                <div className="stat-item">📧 Email: Phishing</div>
                <div className="stat-item">🌐 Browser: Suspicious</div>
                <div className="stat-item">💬 Message: Scam</div>
              </div>
            </div>

            <div className="platform-tabs">
              <div 
                className={`platform-tab ${activePlatform === 'email' ? 'active' : ''} warning`}
                onClick={() => setActivePlatform('email')}
              >
                📧 Email <span className="warning-dot"></span>
              </div>
              <div 
                className={`platform-tab ${activePlatform === 'browser' ? 'active' : ''} warning`}
                onClick={() => setActivePlatform('browser')}
              >
                🌐 Browser <span className="warning-dot"></span>
              </div>
              <div 
                className={`platform-tab ${activePlatform === 'message' ? 'active' : ''} warning`}
                onClick={() => setActivePlatform('message')}
              >
                💬 Message <span className="warning-dot"></span>
              </div>
            </div>

            <div className="triple-content">
              <div className="timeline-panel">
                <div className="timeline-title">
                  <span>⏱️</span>
                  <span>Attack Timeline</span>
                </div>
                <div className="timeline-event suspicious">
                  <div className="event-time">10:30 AM</div>
                  <div className="event-platform">📧 Email Received</div>
                  <div className="event-desc">Phishing email from security@paypa1.com</div>
                </div>
                <div className="timeline-event suspicious">
                  <div className="event-time">10:32 AM</div>
                  <div className="event-platform">🌐 Link Clicked</div>
                  <div className="event-desc">User visited suspicious website</div>
                </div>
                <div className="timeline-event suspicious">
                  <div className="event-time">10:35 AM</div>
                  <div className="event-platform">💬 SMS Received</div>
                  <div className="event-desc">Follow-up scam message received</div>
                </div>
              </div>

              <div className="main-panel">
                {renderPlatformContent()}
              </div>

              <div className="insights-panel">
                <div className="insight-card">
                  <div className="insight-title">
                    <span>🔍</span>
                    <span>Threat Intelligence</span>
                  </div>
                  <p><strong>Attack Type:</strong> Multi-channel Phishing</p>
                  <p><strong>Confidence:</strong> 95%</p>
                  <p><strong>Known Campaign:</strong> #PHISH-2024-001</p>
                </div>

                <div className="insight-card">
                  <div className="insight-title">
                    <span>📊</span>
                    <span>Risk Assessment</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <div>Email Risk: <span className="threat-level threat-high">High</span></div>
                    <div>Browser Risk: <span className="threat-level threat-high">High</span></div>
                    <div>Message Risk: <span className="threat-level threat-high">High</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="correlation-line-triple">
              <div className="platform-icon">📧</div>
              <span>⬇️</span>
              <div className="platform-icon">🌐</div>
              <span>⬇️</span>
              <div className="platform-icon">💬</div>
              <span style={{ color: '#d93025' }}>Connected Attack Chain</span>
            </div>

            <div className="threat-actions">
              <button
                className="threat-action-btn emergency"
                disabled={locked}
                onClick={() => onAction('block_all', {
                  email: level.phish_email,
                  url: level.suspicious_url,
                  phone: level.suspicious_phone
                })}
              >
                🚨 Block All Channels
              </button>
              <button
                className="threat-action-btn"
                style={{ background: '#f1f3f4' }}
                disabled={locked}
                onClick={() => onAction('report_authorities', {
                  threat_data: level
                })}
              >
                📢 Report to Authorities
              </button>
              <button
                className="threat-action-btn"
                style={{ background: '#e6f4ea', color: '#137333' }}
                disabled={locked}
                onClick={() => onAction('mark_safe', {
                  threat_data: level
                })}
              >
                ✅ False Positive
              </button>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}
