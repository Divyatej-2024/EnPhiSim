// src/pages/levels/pre_hard/I23.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I23() {
  return (
    <LevelTemplate
      id="I23"
      title="Malicious HTML in Attachment"
      category="prehard"
      content="<p>Attachment contains HTML that auto-executes; opening raw may run scripts.</p>"
      options={[
        { key: "open", label: "Open Attachment", style: "primary" },
        { key: "sandbox", label: "Open in Sandbox", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="sandbox"
      nextPath="/levels/pre_hard/bI4"
    />
  );
}
