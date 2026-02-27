import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function MailBrowserMessageLevel({ level: scenario }) {
  const [platform, setPlatform] = useState("email");

  const renderPanel = (level) => {
    if (platform === "email") {
      return (
        <div>
          <h4>Email Channel</h4>
          <p><strong>From:</strong> {level.phish_email || "Unknown"}</p>
          <p><strong>Subject:</strong> {level.subj || "Security Alert"}</p>
          <p>{level.level_text || "Suspicious message requesting urgent action."}</p>
        </div>
      );
    }
    if (platform === "browser") {
      return (
        <div>
          <h4>Browser Channel</h4>
          <p><strong>URL:</strong> {level.suspicious_url || level.url || "Unknown URL"}</p>
          <p>Page behavior indicates credential harvesting risk.</p>
        </div>
      );
    }
    return (
      <div>
        <h4>Message Channel</h4>
        <p><strong>Sender:</strong> {level.suspicious_phone || level.contact_name || "Unknown contact"}</p>
        <p>{level.message_text || "Follow-up message reinforces urgency and requests immediate verification."}</p>
      </div>
    );
  };

  return (
    <BaseLevel levelType="mail+browser+message" scenario={scenario}>
      {({ level, onAction, locked }) => (
        <div style={{ maxWidth: 1300, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 14, background: "#b91c1c", color: "#fff" }}>
            <strong>Multi-Channel Threat Simulation</strong>
          </div>

          <div style={{ display: "flex", gap: 8, padding: 12, borderBottom: "1px solid #e5e7eb" }}>
            <button onClick={() => setPlatform("email")}>Email</button>
            <button onClick={() => setPlatform("browser")}>Browser</button>
            <button onClick={() => setPlatform("message")}>Message</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr 320px", minHeight: 420 }}>
            <aside style={{ padding: 14, background: "#f8fafc", borderRight: "1px solid #e5e7eb" }}>
              <h4>Timeline</h4>
              <ol>
                <li>Email received</li>
                <li>Link opened in browser</li>
                <li>Follow-up message sent</li>
              </ol>
            </aside>

            <main style={{ padding: 14 }}>{renderPanel(level)}</main>

            <aside style={{ padding: 14, background: "#f8fafc", borderLeft: "1px solid #e5e7eb" }}>
              <h4>Risk Summary</h4>
              <p><strong>Confidence:</strong> {level.confidence || "high"}</p>
              <p><strong>Assessment:</strong> Coordinated phishing pattern detected across channels.</p>
            </aside>
          </div>

          <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              disabled={locked}
              onClick={() => onAction("block_all", { email: level.phish_email, url: level.suspicious_url, phone: level.suspicious_phone })}
            >
              Block All Channels
            </button>
            <button disabled={locked} onClick={() => onAction("report_authorities", { threat_data: level })}>
              Report Incident
            </button>
            <button disabled={locked} onClick={() => onAction("mark_safe", { threat_data: level })}>
              Mark as False Positive
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
