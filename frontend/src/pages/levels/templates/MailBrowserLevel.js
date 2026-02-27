import React, { useState } from "react";
import BaseLevel from "./BaseLevel";

export default function MailBrowserLevel({ level: scenario }) {
  const [view, setView] = useState("split");

  return (
    <BaseLevel levelType="mail+browser" scenario={scenario}>
      {({ level, onAction, locked }) => (
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 14, background: "#1d4ed8", color: "#fff", display: "flex", justifyContent: "space-between" }}>
            <strong>Cross-Channel Investigation</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setView("split")} style={{ background: view === "split" ? "#fff" : "transparent", color: view === "split" ? "#1d4ed8" : "#fff" }}>
                Split
              </button>
              <button onClick={() => setView("summary")} style={{ background: view === "summary" ? "#fff" : "transparent", color: view === "summary" ? "#1d4ed8" : "#fff" }}>
                Summary
              </button>
            </div>
          </div>

          {view === "split" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#e5e7eb" }}>
              <div style={{ background: "#fff", padding: 14 }}>
                <h4>Email Evidence</h4>
                <p><strong>From:</strong> {level.phish_email || "Unknown"}</p>
                <p><strong>Subject:</strong> {level.subj || level.email_subject || "Security message"}</p>
                <p>{level.email_preview || level.level_text || "No message content provided."}</p>
              </div>
              <div style={{ background: "#fff", padding: 14 }}>
                <h4>Web Evidence</h4>
                <p><strong>URL:</strong> {level.suspicious_url || level.url || "Unknown URL"}</p>
                <p>{level.browser_note || "Review domain mismatch and credential collection patterns."}</p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 16 }}>
              <h4>Correlation Summary</h4>
              <p>
                The email sender, link target, and destination page indicators should be reviewed together before any response.
              </p>
            </div>
          )}

          <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button disabled={locked} onClick={() => onAction("report_campaign", { email: level.phish_email, url: level.suspicious_url })}>
              Report Campaign
            </button>
            <button disabled={locked} onClick={() => onAction("investigate", { email: level.phish_email, url: level.suspicious_url })}>
              Investigate
            </button>
            <button disabled={locked} onClick={() => onAction("safe", { email: level.phish_email, url: level.suspicious_url })}>
              Mark Safe
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
