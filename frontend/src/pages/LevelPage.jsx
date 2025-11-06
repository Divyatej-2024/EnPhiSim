// src/pages/LevelPage.jsx
import React from "react";
import { useParams, Navigate } from "react-router-dom";
import "../level.css";
import LevelTemplateRealtime from "../components/LevelTemplate";
import { levels } from "./levels/level_data";

export default function LevelPage() {
  const { category, levelId } = useParams(); // e.g., category="easy", levelId="l1"
  const key = levelId; // levels keyed by l1..l33 / bl1..bl6

  const level = levels[key];

  if (!level) {
    return <div style={{ padding: 24, color: "#fff" }}>Level not found: {key}</div>;
  }

  // optional: validate category matches
  if (level.category !== category && !(category === "bonus_levels" && level.category === "bonus_levels")) {
    // redirect to correct path for safety
    return <Navigate to={`/levels/${level.category}/${key}`} replace />;
  }

  return <LevelTemplateRealtime level={level} />;
}