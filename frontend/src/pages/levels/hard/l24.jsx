// src/pages/levels/hard/I24.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I24() {
  return (
    <LevelTemplate
      id="I24"
      title="Business Process Compromise"
      category="hard"
      content="<p>An attacker injected into a business payment flow to alter beneficiary details.</p>"
      options={[
        { key: "follow", label: "Follow Process", style: "primary" },
        { key: "verify", label: "Verify Process Change", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/hard/I25"
    />
  );
}
