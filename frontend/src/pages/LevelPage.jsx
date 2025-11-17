import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  // Find correct level
  const level = levels.find(
    (l) =>
      (l.category ?? "").toLowerCase().trim() ===
        (category ?? "").toLowerCase().trim() &&
      (l.Level_no ?? "").toLowerCase().trim() ===
        (levelId ?? "").toLowerCase().trim()
  );

  if (!level) return <h2>Level not found</h2>;

  const options = [
    { key: "correct", label: level.correct_option, correct: true },
    { key: "neutral", label: level.neutral_option, correct: false },
    { key: "wrong", label: level.wrong_option, correct: false },
  ];

  // ✅ FIXED ARROW FUNCTION
  const handleOptionClick = (option) => {
    recordAction(level.Level_no, option.key);

    if (option.correct) {
      markLevelComplete(level.Level_no);
      navigate("/dashboard");
    } else {
      alert("Incorrect! Try again.");
    }
  };

  return (
    <div className="level-page">
      <h1>{level.page_title}</h1>

      <div className="level-content">{level.level_text}</div>

      <div className="options">
        {options.map((option) => (
          <button
            key={option.key}
            onClick={() => handleOptionClick(option)}
            className="option-btn"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
