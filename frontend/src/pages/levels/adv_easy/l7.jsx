// src/pages/levels/adv_easy/I7.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I7() {
  return (
    <LevelTemplate
      id="I7"
      title="TypoSquatted Domain Phish"
      category="advanced easy"
      content="<p>Link points to 'micr0soft.com' (zero instead of 'o'). Hover to check destination.</p>"
      options={[
        { key: "click", label: "Click Link", style: "primary" },
        { key: "hover", label: "Hover Link to Inspect", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="hover"
      nextPath="/levels/adv_easy/I8"
    />
  );
}
