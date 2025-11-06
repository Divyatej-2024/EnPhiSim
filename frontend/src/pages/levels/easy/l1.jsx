// src/pages/levels/easy/I2.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I1() {
  return (
    <LevelTemplate
      id="l1"
      title="Mass Credential-Phish"
      category="easy"
      content="<p>            We detected a suspicious login attempt to your account. Please verify your credentials immediately to prevent suspension.</p>"
      options={[
        { key: "verify", label: "Verify Account", style: "primary" },
        { key: "ignore", label: " Ignore", style: "primary" },
        { key: "report", label: "Report as Phishing", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/l3"
    />
  );
}
