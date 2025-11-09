// src/pages/LevelPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function LevelPage() {
  const { category, levelId } = useParams(); // e.g. easy, normal, hard + l1, l2 ...
  const [LevelContent, setLevelContent] = useState(null);

  useEffect(() => {
    const loadLevel = async () => {
      try {
        // Dynamically import the component
        const { default: ImportedLevel } = await import(
          `./levels/${category}/${levelId}.jsx`
        );
        setLevelContent(() => ImportedLevel);

        // Also dynamically load its CSS (if available)
        import(`./levels/${category}/${levelId}.css`).catch(() =>
          console.warn(`⚠️ No CSS for ${levelId}`)
        );
      } catch (err) {
        console.error("❌ Level not found:", err);
        setLevelContent(() => () => (
          <div style={{ padding: 20, color: "white" }}>
            <h2>Level not found</h2>
            <Link to="/dashboard" style={{ color: "#38bdf8" }}>
              ← Back to Dashboard
            </Link>
          </div>
        ));
      }
    };

    loadLevel();
  }, [category, levelId]);

  if (!LevelContent) return <div className="loading">Loading level...</div>;

  return <LevelContent />;
}
