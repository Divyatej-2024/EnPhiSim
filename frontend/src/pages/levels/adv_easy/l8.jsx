// src/pages/levels/adv_easy/I8.jsx
import React from "react";
import LevelTemplate from "../../../components/LevelTemplate";

export default function I8() {
  return (
    <LevelTemplate
      id="I8"
      title="URL Shortener Redirected Phish"
      category="advanced easy"
      content="<p>Shortened URL included (bit.ly/xyz). Expand before opening.</p>"
      options={[
        { key: "open", label: "Open Short URL", style: "primary" },
        { key: "expand", label: "Expand URL to see target", style: "neutral" },
        { key: "report", label: "Report", style: "neutral" }
      ]}
      correctOption="expand"
      nextPath="/levels/adv_easy/I9"
    />
  );
}
