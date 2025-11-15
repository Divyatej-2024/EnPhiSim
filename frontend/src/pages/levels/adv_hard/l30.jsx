// src/pages/levels/adv_hard/I30.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I30() {
  return (
    <LevelTemplate
      id="I30"
      title="Homograph / Unicode Confusables"
      category="advanced hard"
      content="<p>Domain uses confusable unicode characters to look identical to a trusted domain.</p>"
      options={[
        { key: "click", label: "Click Link", style: "primary" },
        { key: "inspect", label: "Inspect Domain (punycode)", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="inspect"
      nextPath="/levels/adv_hard/I31"
    />
  );
}
