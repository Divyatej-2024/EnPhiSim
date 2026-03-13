import React, { useMemo, useState } from "react";
import BaseLevel from "./BaseLevel";
import "./BrowserLevel.css"; // ✅ ADD THIS

export default function BrowserLevel({ level: scenario }) {
  const [url, setUrl] = useState("");

  const initialUrl = useMemo(
    () => scenario?.url || scenario?.suspicious_url || "http://example.com",
    [scenario]
  );

  const currentUrl = url || initialUrl;
  const host = currentUrl.replace(/^https?:\/\//, "").split("/")[0] || "unknown";

  return (
    <BaseLevel levelType="browser" scenario={scenario}>
      {({ level, onAction, locked }) => (
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
              onClick={() => onAction("close", { url: currentUrl, reason: "suspicious" })}
            >
              Close Tab
            </button>
            <button
              className="browser-btn ignore"
              disabled={locked}
              onClick={() => onAction("ignore", { url: currentUrl })}
            >
              Ignore Warning
            </button>
            <button
              className="browser-btn report"
              disabled={locked}
              onClick={() => onAction("report", { url: currentUrl, type: "phishing" })}
            >
              Report Site
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}


