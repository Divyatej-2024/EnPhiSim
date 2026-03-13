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
              <div className="browser-title">{level.title || "Browser Simulation"}</div>
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

              <h3>{level.title || "Website Content"}</h3>
             {level.body_html && (
                <div className="browser-html-content">
                  <div 
                    dangerouslySetInnerHTML={{ __html: level.body_html }}
                  />
                </div>
              )}
              
              {/* ✅ TEXT CONTENT - Fallback for plain text */}
              {!level.body_html && level.body_text && (
                <div className="browser-text-content">
                  <p>{level.body_text}</p>
                </div>
              )}
              
              {/* ✅ FALLBACK CONTENT - If neither exists */}
              {!level.body_html && !level.body_text && (
                <p>{level.content || level.level_text || "No content available."}</p>
              )}

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
      console.log('wrong action clicked', level.wrong_action);
      onAction(level.wrong_action, { url: currentUrl});
    }}
  >
    {level.wrong_action || "Access the site"}
  </button>
  
  <button
    className="browser-btn ignore"
    disabled={locked}
    onClick={() => {
      console.log('Neutral action clicked',level.neutral_action);
      onAction(level.neutral_action, { url: currentUrl });
    }}
  >
    {level.neutral_action || "Ignore the Document"}  </button>
  
  <button
    className="browser-btn report"
    disabled={locked}
    onClick={() => {
      console.log('Report Phish clicked', level.correct_action);
      console.log('onAction type:', typeof onAction);
      onAction(level.correct_action, { url: currentUrl, type: "phishing" });
    }}
  >
    {level.correct_action || "Report Phish"}
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
    title: PropTypes.string,
    content: PropTypes.string,
    body_html: PropTypes.string,
    body_text: PropTypes.string,
    level_text: PropTypes.string,
    show_warning: PropTypes.bool,
    suspicious_elements: PropTypes.array,
    url: PropTypes.string,
    suspicious_url: PropTypes.string,
    wrong_action: PropTypes.string,
    neutral_action: PropTypes.string,
    correct_action: PropTypes.string
  })
};
