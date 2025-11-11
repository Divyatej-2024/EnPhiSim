// src/pages/Disclaimer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "../level.css";

export default function Disclaimer() {
  const [agreed, setAgreed] = useState(false);
  const nav = useNavigate();
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#e6eef8", padding: 24 }}>
      <div style={{ background: "#071029", padding: 28, borderRadius: 12, maxWidth: 500, opacity:0.5 }}>
        <h1> EnPhiSim — Disclaimer</h1>
        <p style={{ backgroundImage:`url(${process.env.PUBLIC_URL}/img/avtar.png)`,color: "#9fb0c8" }}>
Welcome to EnPhiSim — a training-only simulation environment.

EnPhiSim is a completely virtual world of simulation: every scenario, challenge, and simulated attack exists solely to train, demonstrate, and analyze cybersecurity threats in a safe, controlled setting.

No real users, real content, or real credentials are used. All names, accounts, pages, and data presented inside EnPhiSim are synthetic or fictional and are generated for training purposes only. Do not enter any real personal information or credentials anywhere in the simulator.

Original branding. The logo and emblem used throughout EnPhiSim are original creations owned by the project. They must not be reused, modified, or redistributed without permission.

Educational purpose and scope. This platform mimics attacker behavior (e.g., deceptive emails, fake login pages, social-engineering scenarios) strictly for educational, training, and assessment purposes. It is not intended for malicious use.

Data handling and privacy.

User actions and responses are stored locally on the device by default.

Local data may be exported only for authorized evaluation, grading, or research purposes.

EnPhiSim does not collect or transmit real user credentials or personal data to external servers.

Use and responsibility. By using EnPhiSim you confirm that you understand its training-only nature and agree to use the tool responsibly and ethically for learning, testing, and research.</p>

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
