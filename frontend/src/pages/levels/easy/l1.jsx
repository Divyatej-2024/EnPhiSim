// src/pages/levels/easy/I1.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";
import avatar from "../../img/avtar.png";
import "../level-mail.css";

export default function I1() {
  return (
    <LevelTemplate
      id="l1"
      title="Mass Credential-Phish"
      category="easy"
      options={[
        { key: "verify", label: "Verify Account", style: "primary" },
        { key: "ignore", label: "Ignore", style: "neutral" },
        { key: "report", label: "Report as Phishing", style: "positive" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/l2"
    >
      {/* children: safer, interactive JSX */}
      <div className="mail-briefing">
        <header className="mail-briefing-header">
          <img src={avatar} alt="Sender" className="brief-avatar" />
          <div>
            <div className="brief-from"><strong>security@support-login.com</strong></div>
            <div className="brief-sub">Account Security Team • 6 Nov 2025</div>
          </div>
        </header>

        <div className="brief-body">
          <p>Hello,</p>
          <p>
            We detected a suspicious login attempt to your account from an unknown device.
            Please verify your credentials immediately to prevent suspension.
          </p>

          <p style={{ marginTop: 12 }}>
            <a className="phish-link" href="#" onClick={(e) => e.preventDefault()}>
              Verify Account
            </a>
          </p>

          <hr style={{ marginTop: 12 }} />
          <p className="hint-muted">
            Tip: hover the link to inspect where it points, and check the sender's address carefully before clicking.
          </p>
        </div>
      </div>
    </LevelTemplate>
  );
}
