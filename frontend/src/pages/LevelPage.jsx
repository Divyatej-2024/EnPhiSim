// src/pages/LevelPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();

  const { recordAction, markLevelComplete } = useProgress();
  const [level, setLevel] = useState(null);

  useEffect(() => {
    const lvl = levels.find(
      (l) =>
        l.category.replace(/\s+/g, "").toLowerCase() ===
          category.replace(/\s+/g, "").toLowerCase() &&
        l.Level_no.toLowerCase() === levelId.toLowerCase()
    );

    setLevel(lvl);
  }, [category, levelId]);

  if (!level) return <p>Loading...</p>;

  const handleOptionClick = (selected) => {
    recordAction(level.Level_no, selected);

    if (selected === level.correct_option) {
      markLevelComplete(level.Level_no);

      const idx = levels.findIndex((l) => l.Level_no === level.Level_no);
      const nextLevel = levels[idx + 1];

      if (nextLevel) {
        navigate(`/levels/${nextLevel.category}/${nextLevel.Level_no}`);
      } else {
        navigate("/dashboard");
      }
    } else {
      alert("Incorrect! Try again.");
    }
  };

  return (
    <div className="level-container">
      <h1>{level.page_title}</h1>

      <div className="email-content">{level.level_text}</div>

      <button onClick={() => handleOptionClick(level.correct_option)}>
        {level.correct_option}
      </button>

      <button onClick={() => handleOptionClick(level.neutral_option)}>
        {level.neutral_option}
      </button>

      <button onClick={() => handleOptionClick(level.wrong_option)}>
        {level.wrong_option}
      </button>
    </div>
  );
}
