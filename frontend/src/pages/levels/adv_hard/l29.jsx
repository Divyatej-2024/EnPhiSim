// src/pages/levels/adv_hard/I29.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I29() {
  return (
    <LevelTemplate
      id="I29"
      title="AI-generated personalised campaigns"
      category="advanced hard"
      content="<p>Emails crafted from public data to increase trust.</p>"
      options={[
        { key: "engage", label: "Engage", style: "primary" },
        { key: "verify", label: "Verify Identity", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/adv_hard/I30"
    />
  );
}
