// src/pages/levels/adv_easy/I11.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I11() {
  return (
    <LevelTemplate
      id="I11"
      title="Fake Social Media Notification"
      category="advanced easy"
      content="<p>Notification that asks you to login via the link to confirm your account.</p>"
      options={[
        { key: "login", label: "Login via Link", style: "primary" },
        { key: "openapp", label: "Open App or Site Directly", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="openapp"
      nextPath="/levels/adv_easy/I12"
    />)
}
