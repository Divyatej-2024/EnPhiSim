// src/pages/levels/easy/I5.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I5() {
  return (
    <LevelTemplate
      id="I5"
      title="Simple Attachment Lure"
      category="easy"
      content="<p>See attached document with details about your order.</p>"
      options={[
        { key: "open", label: "Open Attachment", style: "primary" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="report"
      nextPath="/levels/easy/l6"
    />
  );
}
