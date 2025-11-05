// src/pages/levels/normal/I18.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I18() {
  return (
    <LevelTemplate
      id="I18"
      title="Credential-harvest via Landing Page"
      category="normal"
      content="<p>Link leads to a convincing login page that requests your credentials.</p>"
      options={[
        { key: "login", label: "Login", style: "primary" },
        { key: "inspect", label: "Inspect Link/URL", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="inspect"
      nextPath="/levels/normal/bI3"
    />
  );
}
