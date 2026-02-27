import React from "react";
import BaseLevel from "./BaseLevel";

export default function ImageLevel({ level: scenario }) {
  return (
    <BaseLevel levelType="image" scenario={scenario}>
      {({ level, onAction, locked }) => (
        <div style={{ width: "100%", maxWidth: 1000, margin: "0 auto", background: "#fff", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: 14, background: "#111827", color: "#fff" }}>
            <strong>{level.page_title || "Image Analysis"}</strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={{ padding: 16 }}>
              <img
                src={level.image_url || "https://via.placeholder.com/800x450?text=Simulation+Image"}
                alt="Scenario"
                style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb" }}
              />
            </div>

            <div style={{ padding: 16, background: "#f8fafc", borderLeft: "1px solid #e5e7eb", overflowWrap: "anywhere" }}>
              <div style={{ marginBottom: 10 }}><strong>Risk Score:</strong> {level.risk_score || 0}%</div>
              <div style={{ marginBottom: 10 }}><strong>Risk Level:</strong> {level.risk_level || "unknown"}</div>

              <div style={{ marginTop: 12 }}>
                <strong>Detected Indicators</strong>
                <ul>
                  {(level.suspicious_elements || []).map((item, idx) => (
                    <li key={idx}>
                      {typeof item === "string" ? item : `${item.type || "Indicator"}: ${item.description || ""}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button disabled={locked} onClick={() => onAction("report", { image_id: level.id })}>
              Report Image
            </button>
            <button disabled={locked} onClick={() => onAction("ignore", { image_id: level.id })}>
              Ignore
            </button>
            <button disabled={locked} onClick={() => onAction("safe", { image_id: level.id })}>
              Mark Safe
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  );
}
