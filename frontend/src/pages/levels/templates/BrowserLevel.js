import React, { useMemo, useState } from "react";
import PropTypes from 'prop-types';
import BaseLevel from "./BaseLevel";
import "./BrowserLevel.css";

export default function BrowserLevel({ level: scenario }) {
  // ✅ Validation
   const [url, setUrl] = useState("");

  const initialUrl = useMemo(
    () => scenario?.url || scenario?.suspicious_url || "http://example.com",
    [scenario]
  );

  const currentUrl = url || initialUrl;
  const host = currentUrl.replace(/^https?:\/\//, "").split("/")[0] || "unknown";

  if (!scenario) {
    console.error('BrowserLevel: No scenario provided');
    return <div className="error-message">Error: No level data available</div>;
  }

 
  return (
    <BaseLevel levelType="browser" scenario={scenario}>
      {({ level, onAction, locked }) => {
        // ✅ Check if onAction exists
        if (!onAction) {
          console.error('❌ BrowserLevel: onAction is missing from BaseLevel');
          return <div>Error: Action handler missing</div>;
        }

        return (
          <div className="browser-container">
            <div className="browser-header">
              <div className="browser-title">{level.page_title || "Browser Simulation"}</div>
              <div className="browser-url-bar">
                <input
                  value={currentUrl}
                  onChange={(e) => setUrl(e.target.value)}
                  className="browser-url-input"
                />
                <span className={`ssl-indicator ${currentUrl.startsWith("https") ? "secure" : "insecure"}`}>
                  {currentUrl.startsWith("https") ? "HTTPS" : "UNSECURED"}
                </span>
              </div>
            </div>

            <div className="browser-content">
              {level.show_warning && (
                <div className="warning-banner">
                  <strong>Security warning:</strong> This site may be impersonating a legitimate service.
                </div>
              )}

              <h3>{level.page_title || "Website Content"}</h3>
              <p>{level.content || level.level_text || "No content available."}</p>

              {Array.isArray(level.suspicious_elements) && level.suspicious_elements.length > 0 && (
                <div>
                  <strong>Suspicious indicators</strong>
                  <ul>
                    {level.suspicious_elements.map((item, idx) => (
                      <li key={idx}>{String(item)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="browser-footer">
              <span>Host: {host}</span>
              <span>Session: {new Date().toLocaleTimeString()}</span>
            </div>

           <div className="browser-actions">
  <button
    className="browser-btn close"
    disabled={locked}
    onClick={() => {
      console.log('🔘 Close clicked, URL:', currentUrl);
      onAction("close", { url: currentUrl, reason: "suspicious" });
    }}
  >
    Close Tab
  </button>
  
  <button
    className="browser-btn ignore"
    disabled={locked}
    onClick={() => {
      console.log('🔘 Investigate clicked, URL:', currentUrl);
      onAction("investigate", { url: currentUrl });
    }}
  >
    Investigate  {/* Changed from "Ignore Warning" */}
  </button>
  
  <button
    className="browser-btn report"
    disabled={locked}
    onClick={() => {
      console.log('🔘 Report Phish clicked, URL:', currentUrl);
      onAction("report", { url: currentUrl, type: "phishing" });
    }}
  >
    Report Phish  {/* Changed from "Report Site" */}
  </button>
</div>
          </div>
        );
      }}
    </BaseLevel>
  );
}

// ✅ Add PropTypes for better error catching
BrowserLevel.propTypes = {
  level: PropTypes.shape({
    page_title: PropTypes.string,
    content: PropTypes.string,
    show_warning: PropTypes.bool,
    suspicious_elements: PropTypes.array,
    url: PropTypes.string,
    suspicious_url: PropTypes.string,
    level_text: PropTypes.string
  })
};
