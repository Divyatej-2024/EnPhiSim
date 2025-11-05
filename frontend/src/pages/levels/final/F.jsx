// src/pages/levels/final/F.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function F() {
  return (
    <LevelTemplate
      id="F"
      title="Advanced Persistent Phishing (Final)"
      category="final"
      content="<p>Complex chained scenario that requires applying previous learnings. Submit a short report or choose to skip for demo purposes.</p>"
      options={[
        { key: "submit", label: "Submit Full Report", style: "primary" },
        { key: "skip", label: "Skip Final", style: "neutral" }
      ]}
      correctOption="submit"
      nextPath={null}
    />
  );
}
