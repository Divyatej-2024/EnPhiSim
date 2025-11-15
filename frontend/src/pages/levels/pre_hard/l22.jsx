// src/pages/levels/pre_hard/I22.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I22() {
  return (
    <LevelTemplate
      id="I22"
      title="Account Takeover"
      category="prehard"
      content="<p>Compromised account sends password-reset lookalike email. Confirm with the owner.</p>"
      options={[
        { key: "reset", label: "Reset Password", style: "primary" },
        { key: "report", label: "Report", style: "neutral" },
        { key: "contact", label: "Contact User", style: "neutral" }
      ]}
      correctOption="contact"
      nextPath="/levels/pre_hard/I23"
    />
  );
}
