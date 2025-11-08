// src/pages/LevelPage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import levels from "./levels/level_data.js";

export default function LevelPage() {
  const { levelId } = useParams();

  useEffect(() => {
    import(`./styles/levels/${levelId}.css`).catch(() =>
      console.warn(`⚠️ No CSS found for ${levelId}`)
    );
  }, [levelId]);

  return (
    <div className={`level-page ${levelId}`}>
      <h1>{`Welcome to ${levelId}`}</h1>
      <p>Level-specific content here.</p>
    </div>
  );
}
