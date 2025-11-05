// src/pages/levels/easy/I3.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I3() {
  return (
    <LevelTemplate
      id="I3"
      title="Fake Newsletter Subscription"
      category="easy"
      content="<p>Subscribe now to access trending updates and free rewards!</p>"
      options={[
        { key: "subscribe", label: "Subscribe", style: "primary" },
        { key: "ignore", label: "Ignore Email", style: "neutral" }
      ]}
      correctOption="ignore"
      nextPath="/levels/easy/I4"
    />
  );
}
