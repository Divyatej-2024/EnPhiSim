// src/pages/levels/adv_easy/I10.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I10() {
  return (
    <LevelTemplate
      id="I10"
      title="SMS (Smishing) Generic Link"
      category="advanced easy"
      content="<p>SMS-like message shows inside an email with 'click to verify' link.</p>"
      options={[
        { key: "click", label: "Click Link", style: "primary" },
        { key: "call", label: "Call Number Shown", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/adv_easy/I11"
    />
  );
}
