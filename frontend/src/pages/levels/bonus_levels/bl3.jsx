// src/pages/levels/normal/bI3.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function bI3() {
  return (
    <LevelTemplate
      id="bI3"
      title="Turtle (Bonus)"
      category="normal_bonus"
      content="<p>Long-form challenge: verify a chain of three emails for consistency.</p>"
      options={[
        { key: "start", label: "Start", style: "primary" },
        { key: "skip", label: "Skip", style: "neutral" }
      ]}
      correctOption="start"
      nextPath="/levels/pre_hard/I19"
    />
  );
}
