import React, { useMemo, useState } from "react";
import BaseLevel from "./BaseLevel";
import "./BrowserLevel.css";

export default function BrowserLevel({ level: scenario, onAction }) {
  const [url, setUrl] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const initialUrl = useMemo(
    () => scenario?.url || scenario?.display_url || "http://example.com",
    [scenario]
  );

  const currentUrl = url || initialUrl;

  const isShortenedUrl = useMemo(
    () =>
      !!scenario?.shortener_service ||
      currentUrl.match(/(bit\.ly|goo\.gl|tinyurl|ow\.ly|is\.gd|buff\.ly)/i),
    [currentUrl, scenario]
  );

  const getDisplayDomain = (urlValue) => {
    try {
      const parsed = new URL(urlValue);
      return parsed.hostname;
    } catch {
      return "invalid-url";
    }
  };

  const verifyDomainTrust = (urlValue) => {
    try {
      const domain = getDisplayDomain(urlValue);

      // Check against known legitimate domain
      if (scenario?.crct_mail) {
        const legitDomain = scenario.crct_mail.split("@")[1];
        if (domain.includes(legitDomain)) {
          return { trusted: true, message: "Verified legitimate domain" };
        }
      }

      // Check against known phishing domain
      if (scenario?.phish_email) {
        const phishDomain = scenario.phish_email.split("@")[1];
        if (domain.includes(phishDomain)) {
          return { trusted: false, message: "Known phishing domain detected" };
        }
      }

      return { trusted: null, message: "Domain verification unavailable" };
    } catch {
      return { trusted: null, message: "Unable to verify domain" };
    }
  };

  const domainTrust = verifyDomainTrust(currentUrl);
  const mlConfidence =
    scenario?.ml_confidence_distilbert || scenario?.ml_confidence_cnn;

  return (
    <BaseLevel levelType="browser" scenario={scenario} onAction={onAction}>
      {({ level, onAction: handleUserAction, locked, now }) => (
        <div className="browser-container">
          <div className="browser-header">
            <div className="browser-title">
              {level.title || "Browser Simulation"}
            </div>
            <div className="browser-url-bar">
              <input
                value={currentUrl}
                onChange={(e) => setUrl(e.target.value)}
                className="browser-url-input"
                placeholder="Enter URL..."
                readOnly={locked}
              />
            </div>

            <div className="security-indicators">
              <span
                className={`ssl-indicator ${
                  currentUrl.startsWith("https") ? "secure" : "insecure"
                }`}
              >
                {currentUrl.startsWith("https")
                  ? "HTTPS (secure)"
                  : "HTTP (not secure)"}
              </span>

              {isShortenedUrl && (
                <span
                  className="warning-indicator"
                  title="URL shorteners can hide malicious destinations"
                >
                  Shortened URL
                </span>
              )}

              {domainTrust.trusted === false && (
                <span className="danger-indicator">
                  Warning: {domainTrust.message}
                </span>
              )}
            </div>
          </div>

          <div className="browser-content">
            {level.show_warning && (
              <div className="warning-banner">
                <strong>Security Warning:</strong> This site may be impersonating
                a legitimate service.
                {domainTrust.trusted === false && (
                  <div className="warning-detail">{domainTrust.message}</div>
                )}
              </div>
            )}

            <h3>{level.title || "Website Content"}</h3>
            <p>{level.body_text || "No content available."}</p>

            <div className="security-details">
              <button
                className="details-toggle"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? "Hide" : "Show"} Security Details
              </button>

              {showDetails && (
                <div className="details-panel">
                  <h4>Security Analysis</h4>
                  <ul>
                    <li>Domain: {getDisplayDomain(currentUrl)}</li>
                    <li>
                      SSL/TLS: {currentUrl.startsWith("https") ? "Enabled" : "Disabled"}
                    </li>
                    <li>URL Shortened: {isShortenedUrl ? "Yes" : "No"}</li>
                    <li>Domain Trust: {domainTrust.message}</li>
                    {mlConfidence && (
                      <li>AI Risk Score: {(mlConfidence * 100).toFixed(1)}%</li>
                    )}
                    {scenario?.ml_prediction_distilbert === 1 && (
                      <li className="high-risk">
                        AI Model: High phishing probability
                      </li>
                    )}
                  </ul>

                  {Array.isArray(level.suspicious_elements) &&
                    level.suspicious_elements.length > 0 && (
                      <div className="suspicious-elements">
                        <h5>Suspicious Indicators Found:</h5>
                        <ul>
                          {level.suspicious_elements.map((item, idx) => (
                            <li key={idx}>{String(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="browser-footer">
            <span>Host: {getDisplayDomain(currentUrl)}</span>
            <span>Session: {(now || new Date()).toLocaleTimeString()}</span>
          </div>

          <div className="browser-actions">
            <button
              className="browser-btn close"
              disabled={locked}
              onClick={() =>
                handleUserAction("close", {
                  url: currentUrl,
                  reason:
                    domainTrust.trusted === false
                      ? "phishing_detected"
                      : "suspicious",
                  domain: getDisplayDomain(currentUrl),
                  mlConfidence,
                })
              }
            >
              Close Tab
            </button>

            <button
              className="browser-btn ignore"
              disabled={locked}
              onClick={() =>
                handleUserAction("ignore", {
                  url: currentUrl,
                  domain: getDisplayDomain(currentUrl),
                  ignoredWarnings: domainTrust.trusted === false,
                })
              }
            >
              Ignore Warning
            </button>

            <button
              className="browser-btn report"
              disabled={locked}
              onClick={() =>
                handleUserAction("report", {
                  url: currentUrl,
                  type: "phishing",
                  indicators: {
                    shortenedUrl: isShortenedUrl,
                    domainMismatch: domainTrust.trusted === false,
                    mlScore: mlConfidence,
                  },
                })
              }
            >
              Report Phishing
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
