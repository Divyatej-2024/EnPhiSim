// src/pages/levels/pre_hard/I19.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I19() {
  return (
    <LevelTemplate
      id="I19"
      title="Whaling"
      category="prehard"
      content="<p>A high-value target email to an executive requesting confidential info.</p>"
      options={[
        { key: "respond", label: "Respond", style: "primary" },
        { key: "verify", label: "Verify via Phone", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="verify"
      nextPath="/levels/pre_hard/I20"
    />
  );
}
