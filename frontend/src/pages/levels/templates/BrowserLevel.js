import React, { useMemo, useState } from "react";
import PropTypes from 'prop-types';
import BaseLevel from "./BaseLevel";
import "./BrowserLevel.css";

export default function BrowserLevel({ scenario, onAction, locked }) {
  // ✅ Add debug log at the very top
  console.log('🌐 BrowserLevel received:', { 
    hasScenario: !!scenario,
    scenarioId: scenario?.scenario_id,
    title: scenario?.title,
    template: scenario?.template
  });

  const [url, setUrl] = useState("");

  // ✅ Safe access with optional chaining
 const initialUrl = useMemo(
  () => scenario?.display_url || scenario?.links?.[0] || scenario?.url || scenario?.suspicious_url || "http://example.com",
  [scenario]
);

  const currentUrl = url || initialUrl;
  const host = currentUrl.replace(/^https?:\/\//, "").split("/")[0] || "unknown";

  // ✅ Better error handling with loading state
  if (!scenario) {
    console.error('❌ BrowserLevel: No scenario provided');
    return (
      <div className="error-container">
        <h3>Loading Browser Scenario...</h3>
        <div className="spinner"></div>
        <p>Please wait while we prepare the simulation.</p>
      </div>
    );
  }

  return (
    <BaseLevel levelType="browser" scenario={scenario} onAction={onAction}>
      {({ level, onAction: baseOnAction, locked: baseLocked }) => {
        // ✅ Use the props correctly
        const isLocked = locked || baseLocked;
        
        return (
          <div className="browser-container">
            <div className="browser-header">
              <div className="browser-title">{level.title || "Browser Simulation"}</div>
              <div className="browser-url-bar">
                <input
                  value={currentUrl}
                  onChange={(e) => setUrl(e.target.value)}
                  className="browser-url-input"
                  disabled={isLocked}
                />
                <span className={`ssl-indicator ${currentUrl.startsWith("https") ? "secure" : "insecure"}`}>
                  {currentUrl.startsWith("https") ? "🔒 HTTPS" : "⚠️ HTTP - UNSECURED"}
                </span>
              </div>
            </div>

            <div className="browser-content">
              {level.show_warning && (
                <div className="warning-banner">
                  <strong>⚠️ Security warning:</strong> This site may be impersonating a legitimate service.
                </div>
              )}

              <h3>{level.title || "Website Content"}</h3>
              
              {level.body_html && (
                <div className="browser-html-content">
                  <div dangerouslySetInnerHTML={{ __html: level.body_html }} />
                </div>
              )}
              
              {!level.body_html && level.body_text && (
                <div className="browser-text-content">
                  <p>{level.body_text}</p>
                </div>
              )}
              
              {!level.body_html && !level.body_text && (
                <p>{level.content || level.level_text || "No content available."}</p>
              )}

              {level.links && level.links.length > 0 && (
                <div className="suspicious-links">
                  <strong>🔗 Suspicious links detected:</strong>
                  <ul>
                    {level.links.map((link, idx) => (
                      <li key={idx} className="suspicious-link">{link}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="browser-footer">
              <span>🌐 Host: {host}</span>
              <span>🕒 {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="browser-actions">
              <button
                className="browser-btn wrong"
                disabled={isLocked}
                onClick={() => {
                  console.log('🎯 Wrong action:', level.wrong_action);
                  baseOnAction(level.wrong_action || "Trust & Click", { 
                    url: currentUrl,
                    scenario_id: level.scenario_id 
                  });
                }}
              >
                {level.wrong_action || "Access the site"}
              </button>
              
              <button
                className="browser-btn neutral"
                disabled={isLocked}
                onClick={() => {
                  console.log('🎯 Neutral action:', level.neutral_action);
                  baseOnAction(level.neutral_action || "Ignore", { 
                    url: currentUrl,
                    scenario_id: level.scenario_id 
                  });
                }}
              >
                {level.neutral_action || "Ignore"}
              </button>
              
              <button
                className="browser-btn correct"
                disabled={isLocked}
                onClick={() => {
                  console.log('🎯 Correct action:', level.correct_action);
                  baseOnAction(level.correct_action || "Report Phish", { 
                    url: currentUrl,
                    scenario_id: level.scenario_id,
                    type: "phishing"
                  });
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

BrowserLevel.propTypes = {
  scenario: PropTypes.shape({
    scenario_id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    body_html: PropTypes.string,
    body_text: PropTypes.string,
    level_text: PropTypes.string,
    show_warning: PropTypes.bool,
    suspicious_elements: PropTypes.array,
    links: PropTypes.array,
    url: PropTypes.string,
    suspicious_url: PropTypes.string,
    wrong_action: PropTypes.string,
    neutral_action: PropTypes.string,
    correct_action: PropTypes.string
  }),
  onAction: PropTypes.func.isRequired,
  locked: PropTypes.bool
};
