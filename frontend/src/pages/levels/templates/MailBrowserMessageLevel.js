// Sections: imports, configuration, logic, render/exports

// frontend/src/pages/levels/templates/MailBrowserMessageLevel.js
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./MailBrowserMessageLevel.css"; // ADD THIS
import "./Template.css";
export default function MailBrowserMessageLevel({ level: scenario }) {
  const [platform, setPlatform] = useState("email");

  const renderPanel = (level) => {
    if (platform === "email") {
      return (
        <div className="multichannel-main">
          <h4>Email Channel</h4>
          <p><strong>From:</strong> {level.phish_email || "Unknown"}</p>
          <p><strong>Subject:</strong> {level.subj || "Security Alert"}</p>
          <p>{level.level_text || "Suspicious message requesting urgent action."}</p>
        </div>
      );
    }
    if (platform === "browser") {
      return (
        <div className="multichannel-main">
          <h4>Browser Channel</h4>
          <p><strong>URL:</strong> {level.suspicious_url || level.url || "Unknown URL"}</p>
          <p>Page behavior indicates credential harvesting risk.</p>
        </div>
      );
    }
    return (
      <div className="multichannel-main">
        <h4>Message Channel</h4>
        <p><strong>Sender:</strong> {level.suspicious_phone || level.contact_name || "Unknown contact"}</p>
        <p>{level.message_text || "Follow-up message reinforces urgency and requests immediate verification."}</p>
      </div>
    );
  };

  return (
    <BaseLevel levelType="mail+browser+message" scenario={scenario}>
      {({ level, onAction, locked, now }) => (
        <div className="multichannel-container">
          <div className="multichannel-header">
            <strong>Multi-Channel Threat Simulation</strong>
            <div className="live-row">
              <span className="live-dot" aria-hidden="true" />
              <span>Live</span>
              <span className="live-time">
                {(now || new Date()).toLocaleTimeString()}
              </span>
            </div>
          </div>

          <div className="multichannel-tabs">
            <button
              className={`multichannel-tab ${platform === "email" ? "active" : ""}`}
              onClick={() => setPlatform("email")}
            >
              Email
            </button>
            <button
              className={`multichannel-tab ${platform === "browser" ? "active" : ""}`}
              onClick={() => setPlatform("browser")}
            >
              Browser
            </button>
            <button
              className={`multichannel-tab ${platform === "message" ? "active" : ""}`}
              onClick={() => setPlatform("message")}
            >
              Message
            </button>
          </div>

          <div className="multichannel-grid">
            <aside className="multichannel-sidebar">
              <h4>Timeline</h4>
              <ol>
                <li>Email received</li>
                <li>Link opened in browser</li>
                <li>Follow-up message sent</li>
              </ol>
            </aside>

            <main>{renderPanel(level)}</main>

            <aside className="multichannel-sidebar right">
              <h4>Risk Summary</h4>
              <p><strong>Confidence:</strong> {level.confidence || "high"}</p>
              <p><strong>Assessment:</strong> Coordinated phishing pattern detected across channels.</p>
            </aside>
          </div>

          <div className="multichannel-actions">
            <button
              className="multichannel-btn block"
              disabled={locked}
              onClick={() => onAction("block_all", { email: level.phish_email, url: level.suspicious_url, phone: level.suspicious_phone })}
            >
              Block All Channels
            </button>
            <button
              className="multichannel-btn report"
              disabled={locked}
              onClick={() => onAction("report_authorities", { threat_data: level })}
            >
              Report Incident
            </button>
            <button
              className="multichannel-btn safe"
              disabled={locked}
              onClick={() => onAction("mark_safe", { threat_data: level })}
            >
              Mark as False Positive
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}

