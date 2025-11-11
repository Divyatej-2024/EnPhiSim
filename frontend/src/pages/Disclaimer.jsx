// src/pages/Disclaimer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../level.css";

export default function Disclaimer() {
  const [agreed, setAgreed] = useState(false);
  const nav = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#0f172a,#071033)", color: "#e6eef8", padding: 24 }}>
      <div style={{ background: "#071029", padding: 28, borderRadius: 12, maxWidth: 800 }}>
        <h1>EnPhiSim — Disclaimer</h1>
        <p style={{ color: "#9fb0c8" }}>
          This educational phishing simulator mimics attacker behaviour for training. Do not enter real credentials. Actions are stored locally and may be exported for grading.
        </p>

        <label style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
          <input type="checkbox" checked={agreed} onChange={() => setAgreed(a => !a)} />
          <span>I agree to participate in this simulation (educational use only).</span>
        </label>

        <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
          <button onClick={() => {
            if (!agreed) return alert("Please agree to proceed.");
            nav("/about");
          }} style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "#2563eb", color: "#fff" }}>Proceed</button>

          <button onClick={() => { // eslint-disable-next-line no-restricted-globals
if (confirm("Clear local simulation data?")) {
  localStorage.removeItem("enphisim_actions");
  alert("Cleared.");
 } }} style={{ padding: "8px 12px", borderRadius: 8, background: "#0b1220", color: "#cbd5e1", border: "1px solid #1f2937" }}>Clear Data</button>
        </div>
      </div>
    </div>
  );
}
