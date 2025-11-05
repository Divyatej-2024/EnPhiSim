// src/pages/Disclaimer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Disclaimer() {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#0f172a,#071033)",
        color: "#e6eef8",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#071029",
          padding: 28,
          borderRadius: 12,
          maxWidth: 800,
          textAlign: "left",
        }}
      >
        <h1 style={{ marginTop: 0 }}>EnPhiSim — Disclaimer & Consent</h1>
        <p style={{ color: "#9fb0c8" }}>
          This phishing simulation is for educational and research purposes only.
          Please do not enter any real credentials while using this simulator.
          Interaction data is stored locally in your browser and may be exported for grading or analysis.
        </p>

        <label
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed((a) => !a)}
          />
          <span>
            I confirm I have read and agree to participate in this simulation.
          </span>
        </label>

        <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              if (!agreed) {
                // eslint-disable-next-line no-restricted-globals
                return alert("Please agree to proceed.");
              }
              navigate("/dashboard");
            }}
            style={{
              padding: "8px 12px",
              background: "#2563eb",
              color: "#fff",
              borderRadius: 8,
              border: "none",
            }}
          >
            Proceed to Dashboard
          </button>

          <button
            onClick={() => {
              // eslint-disable-next-line no-restricted-globals
              if (confirm("Clear local simulation data?")) {
                localStorage.removeItem("enphisim_actions");
                // eslint-disable-next-line no-restricted-globals
                alert("Local data cleared.");
              }
            }}
            style={{
              padding: "8px 12px",
              background: "#0b1220",
              color: "#cbd5e1",
              borderRadius: 8,
              border: "1px solid #1f2937",
            }}
          >
            Clear Local Data
          </button>
        </div>
      </div>
    </div>
  );
}
