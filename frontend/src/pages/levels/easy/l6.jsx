// src/pages/levels/easy/I6.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I6() {
  return (
    <LevelTemplate
      id="I6"
      title="Basic Spoofed Display-Name Sender"
      category="easy"
      content="<p>Message appears from HR but uses a public gmail address. Check sender details.</p>"
      options={[
        { key: "trust", label: "Trust & Reply", style: "primary" },
        { key: "inspect", label: "Inspect Email Address", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="inspect"
      nextPath="/levels/bonus_levels/bl1"
    />
  );
}
