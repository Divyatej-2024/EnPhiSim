import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const [LevelContent, setLevelContent] = useState(null);

  const wrapper = {
    padding: "40px",
    color: "white",
    minHeight: "100vh",
  };

  useEffect(() => {
    const loadLevel = async () => {
      try {
        const { default: Comp } = await import(
          `./levels/${category}/${levelId}.jsx`
        );
        setLevelContent(() => Comp);
      } catch (err) {
        console.error(err);

        // Move styles INSIDE the fallback component (so effect has no external dependencies)
        setLevelContent(() => () => (
          <div style={{ padding: "20px", color: "white" }}>
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

  return (
    <div style={wrapper}>
      {!LevelContent ? "Loading..." : <LevelContent />}
    </div>
  );
}
