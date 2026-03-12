// frontend/src/pages/levels/templates/ImageLevel.js
import React from "react";
import BaseLevel from "./BaseLevel";
import "./ImageLevel.css"; // ✅ ADD THIS

export default function ImageLevel({ level: scenario }) {
  return (
    <BaseLevel levelType="image" scenario={scenario}>
      {({ level, onAction, locked }) => (
        <div className="image-container">
          <div className="image-header">
            <strong>{level.page_title || "Image Analysis"}</strong>
          </div>

          <div className="image-grid">
            <div className="image-panel">
              <img
                src={level.image_url || "https://via.placeholder.com/800x450?text=Simulation+Image"}
                alt="Scenario"
                className="image-preview"
              />
            </div>

            <div className="analysis-panel">
              <div className="analysis-item">
                <strong>Risk Score:</strong> {level.risk_score || 0}%
              </div>
              <div className="analysis-item">
                <strong>Risk Level:</strong> {level.risk_level || "unknown"}
              </div>

              <div className="indicators-section">
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

          <div className="image-actions">
            <button
              className="image-btn report"
              disabled={locked}
              onClick={() => onAction("report", { image_id: level.id })}
            >
              Report Image
            </button>
            <button
              className="image-btn ignore"
              disabled={locked}
              onClick={() => onAction("ignore", { image_id: level.id })}
            >
              Ignore
            </button>
            <button
              className="image-btn safe"
              disabled={locked}
              onClick={() => onAction("safe", { image_id: level.id })}
            >
              Mark Safe
            </button>
          </div>
        </div>
      )}
    </BaseLevel>
  )
}