// src/pages/levels/normal/I17.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I17() {
  return (
    <LevelTemplate
      id="I17"
      title="Account Lockout Scare"
      category="normal"
      content="<p>Your account will be locked unless you click the provided link to unlock it.</p>"
      options={[
        { key: "click", label: "Click to Unlock", style: "primary" },
        { key: "report", label: "Report", style: "neutral" },
        { key: "ignore", label: "Ignore", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/normal/I18"
    />
  );
}
