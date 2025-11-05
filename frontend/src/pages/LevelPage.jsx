// src/pages/LevelPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import LevelTemplate from "../components/LevelTemplate";
import levels from "./levels/level_data";

export default function LevelPage() {
  const { levelId } = useParams();
  // allow URLs like /levels/I1 or /levels/i1 (case-insensitive)
  const id = levelId ? levelId.toUpperCase() : null;
  const level = levels.find(l => l.id.toUpperCase() === id);
  return <LevelTemplate level={level} />;
}
