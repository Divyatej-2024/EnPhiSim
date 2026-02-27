import React, { useMemo, useState } from "react";
import BaseLevel from "./BaseLevel";

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
        <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb", background: "#f8fafc" }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>{level.page_title || "Browser Simulation"}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                value={currentUrl}
                onChange={(e) => setUrl(e.target.value)}
                style={{ flex: "1 1 260px", minWidth: 0, padding: 10, borderRadius: 20, border: "1px solid #cbd5e1" }}
              />
              <span style={{ alignSelf: "center", fontSize: 12, color: currentUrl.startsWith("https") ? "#166534" : "#991b1b" }}>
                {currentUrl.startsWith("https") ? "HTTPS" : "UNSECURED"}
              </span>
            </div>
          </div>

          <div style={{ padding: 16, minHeight: 340 }}>
            {level.show_warning && (
              <div style={{ padding: 12, marginBottom: 12, border: "1px solid #f59e0b", background: "#fffbeb", borderRadius: 8 }}>
                <strong>Security warning:</strong> This site may be impersonating a legitimate service.
              </div>
            )}

            <h3 style={{ margin: "8px 0" }}>{level.page_title || "Website Content"}</h3>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{level.content || level.level_text || "No content available."}</p>

            {Array.isArray(level.suspicious_elements) && level.suspicious_elements.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <strong>Suspicious indicators</strong>
                <ul>
                  {level.suspicious_elements.map((item, idx) => (
                    <li key={idx}>{String(item)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", padding: 12, fontSize: 12, color: "#475569", display: "flex", gap: 16, flexWrap: "wrap" }}>
            <span>Host: {host}</span>
            <span>Session: {new Date().toLocaleTimeString()}</span>
          </div>

          <div style={{ display: "flex", gap: 10, padding: 16, borderTop: "1px solid #e5e7eb", flexWrap: "wrap" }}>
            <button disabled={locked} onClick={() => onAction("close", { url: currentUrl, reason: "suspicious" })}>
              Close Tab
            </button>
            <button disabled={locked} onClick={() => onAction("ignore", { url: currentUrl })}>
              Ignore Warning
            </button>
            <button disabled={locked} onClick={() => onAction("report", { url: currentUrl, type: "phishing" })}>
              Report Site
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
