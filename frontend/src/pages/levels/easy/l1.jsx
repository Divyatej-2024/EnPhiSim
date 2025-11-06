// src/pages/levels/easy/I1.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";
import avatar from "../../img/avtar.png";
import "../level-mail.css";

export default function I1() {
  // Using LevelTemplate API you showed earlier. LevelTemplate should render the content (HTML string)
  // and options (array) and handle selection/checking. If LevelTemplate accepts extra props (like
  // header image) you can pass them as needed.
  return (
    <LevelTemplate
      id="l1"
      title="Mass Credential-Phish"
      category="easy"
      // content is HTML string — keep it simple but realistic
      content={`<div class="mail-briefing">
          <header class="mail-briefing-header">
            <img src="${avatar}" alt="Sender" class="brief-avatar" />
            <div>
              <div class="brief-from"><strong>security@support-login.com</strong></div>
              <div class="brief-sub">Account Security Team • 6 Nov 2025</div>
            </div>
          </header>

          <div class="brief-body">
            <p>Hello,</p>
            <p>We detected a suspicious login attempt to your account from an unknown device. Please verify your credentials immediately to prevent suspension.</p>
            <p style="margin-top:12px;"><a class="phish-link" href="#" onclick="return false;">Verify Account</a></p>
            <hr style="margin-top:12px;" />
            <p class="hint-muted">Tip: hover the link to inspect where it points, and check the sender's address carefully before clicking.</p>
          </div>
        </div>`}
      options={[
        { key: "verify", label: "Verify Account", style: "primary" },
        { key: "ignore", label: "Ignore", style: "neutral" },
        { key: "report", label: "Report as Phishing", style: "positive" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/l2"
    />
  );
}
