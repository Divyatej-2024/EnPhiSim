import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function BrowserLevel() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const browserStyles = `
    .browser-window {
      border: 2px solid #dee1e3;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .browser-title-bar {
      background: #f1f3f4;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      border-bottom: 1px solid #dadce0;
    }

    .window-controls {
      display: flex;
      gap: 8px;
    }

    .window-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .window-dot:hover {
      filter: brightness(0.9);
      transform: scale(1.1);
    }

    .dot-red { background: #ff5f57; }
    .dot-yellow { background: #febc2e; }
    .dot-green { background: #28c840; }

    .browser-tabs {
      display: flex;
      gap: 4px;
      flex: 1;
      overflow-x: auto;
    }

    .browser-tab {
      padding: 8px 20px;
      background: #e8eaed;
      border-radius: 8px 8px 0 0;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      min-width: 150px;
      max-width: 200px;
      position: relative;
    }

    .browser-tab.active {
      background: #fff;
      border: 1px solid #dadce0;
      border-bottom: none;
      margin-bottom: -1px;
      font-weight: 500;
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      background: #1a73e8;
      border-radius: 50%;
    }

    .tab-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .tab-close {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      opacity: 0.6;
    }

    .tab-close:hover {
      background: #dadce0;
      opacity: 1;
    }

    .navigation-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: #fff;
      border-bottom: 1px solid #dadce0;
    }

    .nav-button {
      width: 36px;
      height: 36px;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #5f6368;
      transition: all 0.2s;
    }

    .nav-button:hover:not(:disabled) {
      background: #f1f3f4;
      color: #202124;
    }

    .nav-button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .url-container {
      flex: 1;
      position: relative;
    }

    .url-input {
      width: 100%;
      padding: 10px 40px 10px 16px;
      border: 1px solid #dadce0;
      border-radius: 24px;
      font-size: 14px;
      outline: none;
      background: #f1f3f4;
      transition: all 0.2s;
    }

    .url-input:focus {
      background: #fff;
      border-color: #1a73e8;
      box-shadow: 0 1px 4px rgba(26,115,232,0.2);
    }

    .security-badge {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .badge-secure {
      background: #e6f4ea;
      color: #137333;
    }

    .badge-insecure {
      background: #fce8e6;
      color: #d93025;
    }

    .bookmarks-bar {
      padding: 8px 16px;
      background: #f8f9fa;
      border-bottom: 1px solid #dadce0;
      display: flex;
      gap: 16px;
      font-size: 13px;
      overflow-x: auto;
    }

    .bookmark-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #5f6368;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .bookmark-item:hover {
      background: #e8eaed;
    }

    .browser-viewport {
      min-height: 500px;
      background: #fff;
      position: relative;
      padding: 20px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255,255,255,0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
      backdrop-filter: blur(4px);
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #e8eaed;
      border-top: 4px solid #1a73e8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .status-bar {
      background: #f1f3f4;
      padding: 4px 16px;
      font-size: 12px;
      color: #5f6368;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #dadce0;
    }

    .security-warning {
      background: #fef7e0;
      border-left: 4px solid #f9ab00;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-radius: 4px;
      animation: slideDown 0.3s ease;
    }

    .web-content {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }

    .suspicious-element {
      border: 2px solid #d93025;
      padding: 12px;
      margin: 10px 0;
      background: #fce8e6;
      border-radius: 4px;
      position: relative;
    }

    .suspicious-label {
      position: absolute;
      top: -10px;
      left: 10px;
      background: #d93025;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }

    .action-bar-bottom {
      display: flex;
      gap: 12px;
      padding: 16px;
      justify-content: center;
      border-top: 1px solid #dadce0;
      background: #f8f9fa;
    }

    .browser-action {
      padding: 12px 28px;
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

    .browser-action.warning {
      background: #fce8e6;
      color: #d93025;
    }

    .browser-action.warning:hover:not(:disabled) {
      background: #fad2cf;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(217,48,37,0.2);
    }

    .browser-action.success {
      background: #e6f4ea;
      color: #137333;
    }

    .browser-action.success:hover:not(:disabled) {
      background: #d3e9d9;
      transform: translateY(-2px);
    }

    .browser-action:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .link-button {
      background: none;
      border: none;
      color: #1a73e8;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
      font: inherit;
    }

    .link-button:hover {
      color: #1557b0;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes slideDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  const navigateTo = (newUrl) => {
    setIsLoading(true);
    setUrl(newUrl);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newUrl]);
    setHistoryIndex(prev => prev + 1);
    
    setTimeout(() => setIsLoading(false), 1000);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setUrl(history[historyIndex - 1]);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setUrl(history[historyIndex + 1]);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    navigateTo(link);
  };

  return (
    <>
      <style>{browserStyles}</style>
      <BaseLevel levelType="browser">
        {({ level, onAction, locked }) => (
          <div className="browser-window">
            <div className="browser-title-bar">
              <div className="window-controls">
                <div className="window-dot dot-red"></div>
                <div className="window-dot dot-yellow"></div>
                <div className="window-dot dot-green"></div>
              </div>
              
              <div className="browser-tabs">
                <div className="browser-tab active">
                  <span className="tab-favicon">🌐</span>
                  <span className="tab-title">{level.page_title || 'New Tab'}</span>
                  <span className="tab-close">×</span>
                </div>
                <div className="browser-tab">
                  <span className="tab-favicon">➕</span>
                  <span className="tab-title">New Tab</span>
                </div>
              </div>
            </div>

            <div className="navigation-bar">
              <button 
                className="nav-button" 
                onClick={goBack}
                disabled={historyIndex <= 0 || isLoading}
              >
                ←
              </button>
              <button 
                className="nav-button" 
                onClick={goForward}
                disabled={historyIndex >= history.length - 1 || isLoading}
              >
                →
              </button>
              <button 
                className="nav-button" 
                onClick={() => navigateTo(url)}
                disabled={isLoading}
              >
                ⟳
              </button>
              
              <div className="url-container">
                <input
                  className="url-input"
                  type="text"
                  value={url || level.url || 'https://example.com'}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && navigateTo(e.target.value)}
                />
                <div className={`security-badge ${url?.startsWith('https') ? 'badge-secure' : 'badge-insecure'}`}>
                  {url?.startsWith('https') ? '🔒' : '⚠️'}
                </div>
              </div>
              
              <button className="nav-button">⋮</button>
            </div>

            <div className="bookmarks-bar">
              <div className="bookmark-item" onClick={() => navigateTo('https://gmail.com')}>
                📧 Gmail
              </div>
              <div className="bookmark-item" onClick={() => navigateTo('https://drive.google.com')}>
                📁 Drive
              </div>
              <div className="bookmark-item" onClick={() => navigateTo('https://calendar.google.com')}>
                📅 Calendar
              </div>
            </div>

            <div className="browser-viewport">
              {isLoading && (
                <div className="loading-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}

              {level.show_warning && (
                <div className="security-warning">
                  <span>⚠️</span>
                  <div>
                    <strong>Security Warning:</strong> This website may be impersonating a legitimate site
                  </div>
                </div>
              )}

              <div className="web-content">
                {level.browser_html ? (
                  <div dangerouslySetInnerHTML={{ __html: level.browser_html }} />
                ) : (
                  <div>
                    <h1>{level.page_title || 'Website Content'}</h1>
                    <p>{level.content || 'Loading webpage content...'}</p>
                    
                    {level.suspicious_elements?.map((element, idx) => (
                      <div key={idx} className="suspicious-element">
                        <span className="suspicious-label">Suspicious</span>
                        {element}
                      </div>
                    ))}
                    
                    <div style={{ marginTop: '20px' }}>
                      <h3>Links on this page:</h3>
                      <ul>
                        <li>
                          <button 
                            className="link-button" 
                            onClick={(e) => handleLinkClick(e, 'https://official-site.com')}
                          >
                            Official Site
                          </button>
                        </li>
                        <li>
                          <button 
                            className="link-button" 
                            onClick={(e) => handleLinkClick(e, 'https://login-page.com')}
                          >
                            Login
                          </button>
                        </li>
                        <li>
                          <button 
                            className="link-button" 
                            onClick={(e) => handleLinkClick(e, 'https://support.com')}
                          >
                            Support
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="status-bar">
              <span>🔒 Secure connection</span>
              <span>📊 {Math.floor(Math.random() * 50)} trackers blocked</span>
              <span>⚡ Live session • {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="action-bar-bottom">
              <button
                className="browser-action warning"
                disabled={locked}
                onClick={() => onAction('close', { 
                  url: url || level.url,
                  reason: 'suspicious'
                })}
              >
                🚫 Close Tab
              </button>
              <button
                className="browser-action"
                disabled={locked}
                onClick={() => onAction('ignore', { 
                  url: url || level.url 
                })}
              >
                ⏭️ Ignore Warning
              </button>
              <button
                className="browser-action success"
                disabled={locked}
                onClick={() => onAction('report', { 
                  url: url || level.url,
                  type: 'phishing'
                })}
              >
                📢 Report Site
              </button>
            </div>
          </div>
        )}
      </BaseLevel>
    </>
  );
}