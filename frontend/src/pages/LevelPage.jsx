import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();

  const { recordAction, markLevelComplete } = useProgress();

  const [levelMeta, setLevelMeta] = useState(null);
  const [LevelUI, setLevelUI] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLevel = async () => {
      setLoading(true);

      // 1️⃣ Find matching metadata
      const meta = levels.find(
        (lvl) =>
          lvl.category.replace(/\s+/g, "").toLowerCase() ===
            category.replace(/\s+/g, "").toLowerCase() &&
          lvl.Level_no.toLowerCase() === levelId.toLowerCase()
      );

      if (!meta) {
        console.error("❌ Level metadata not found");
        setLevelUI(() => () => (
          <div style={{ padding: 20, color: "white" }}>
            <h2>Level not found</h2>
            <Link to="/dashboard" style={{ color: "#38bdf8" }}>
              ← Back to Dashboard
            </Link>
          </div>
        ));
        setLoading(false);
        return;
      }

      setLevelMeta(meta);

      try {
        // 2️⃣ Dynamic import of Level UI
        const { default: ImportedUI } = await import(
          /* webpackIgnore: true */
          `${meta.js_path.replace(".js", ".jsx")}`
        ).catch(async () =>
          import(/* webpackIgnore: true */ `${meta.js_path}`)
        );

        setLevelUI(() => ImportedUI);

        // 3️⃣ Load per-level CSS if exists
        import(
          `${meta.js_path.replace(".js", ".css").replace(".jsx", ".css")}`
        ).catch(() => {});

      } catch (error) {
        console.error("❌ Failed to import UI:", error);

        // Fallback to simple UI with level_text
        setLevelUI(() => () => (
          <div className="level-container">
            <h1>{meta.page_title}</h1>
            <p>{meta.level_text || "No content available."}</p>
          </div>
        ));
      }

      setLoading(false);
    };

    loadLevel();
  }, [category, levelId]);

  // 4️⃣ Unified handler for scoring + ML + navigation
  const onOptionClick = (option) => {
    recordAction(levelMeta.Level_no, option.label);

    if (option.correct) {
      markLevelComplete(levelMeta.Level_no);

      const nextIndex = levels.findIndex(
        (lvl) => lvl.Level_no === levelMeta.Level_no
      ) + 1;

      const nextLevel = levels[nextIndex];

      if (nextLevel) {
        navigate(`/levels/${nextLevel.category}/${nextLevel.Level_no}`);
      } else {
        navigate("/dashboard");
      }
    } else {
      alert("Incorrect! Try again.");
    }
  };

  if (loading || !LevelUI) return <p className="loading">Loading level...</p>;

  return <LevelUI level={levelMeta} onOptionClick={onOptionClick} />;
}
