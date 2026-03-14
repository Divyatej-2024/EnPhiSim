
// frontend/src/pages/levels/templates/MailBrowserLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./MailBrowserLevel.css"; // ✅ ADD THIS
import "./Template.css";

export default function MailBrowserLevel({ scenario, onAction, locked }) {
  const [view, setView] = useState("split");

  return (
    <BaseLevel levelType="mail+browser" scenario={scenario} onAction={onAction}>
      {({ level, onAction, locked, now }) => (
        <div className="mailbrowser-container">
          <div className="mailbrowser-header">
            <strong>Cross-Channel Investigation</strong>
            <div className="live-row">
              <span className="live-dot" aria-hidden="true" />
              <span>Live</span>
              <span className="live-time">
                {(now || new Date()).toLocaleTimeString()}
              </span>
            </div>
            <div className="mailbrowser-tabs">
              <button
                className={`mailbrowser-tab ${view === "split" ? "active" : ""}`}
                onClick={() => setView("split")}
              >
                Split
              </button>
              <button
                className={`mailbrowser-tab ${view === "summary" ? "active" : ""}`}
                onClick={() => setView("summary")}
              >
                Summary
              </button>
            </div>
          </div>

          {view === "split" ? (
            <div className="mailbrowser-split">
              <div className="mailbrowser-panel">
                <h4>Email Evidence</h4>
                <p><strong>From:</strong> {level.phish_email || "Unknown"}</p>
                <p><strong>Subject:</strong> {level.subj || level.email_subject || "Security message"}</p>
                <p>{level.email_preview || level.level_text || "No message content provided."}</p>
              </div>
              <div className="mailbrowser-panel">
                <h4>Web Evidence</h4>
                <p><strong>URL:</strong> {level.suspicious_url || level.url || "Unknown URL"}</p>
                <p>{level.browser_note || "Review domain mismatch and credential collection patterns."}</p>
              </div>
            </div>
          ) : (
            <div className="mailbrowser-summary">
              <h4>Correlation Summary</h4>
              <p>
                The email sender, link target, and destination page indicators should be reviewed together before any response.
              </p>
            </div>
          )}

          <div className="mailbrowser-actions">
            <button
              className="mailbrowser-btn report"
              disabled={locked}
              onClick={() => onAction("report_campaign", { email: level.phish_email, url: level.suspicious_url })}
            >
              Report Campaign
            </button>
            <button
              className="mailbrowser-btn investigate"
              disabled={locked}
              onClick={() => onAction("investigate", { email: level.phish_email, url: level.suspicious_url })}
            >
              Investigate
            </button>
            <button
              className="mailbrowser-btn safe"
              disabled={locked}
              onClick={() => onAction("safe", { email: level.phish_email, url: level.suspicious_url })}
            >
              Mark Safe
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
