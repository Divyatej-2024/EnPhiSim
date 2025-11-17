import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  // FIXED: levels are grouped by category
  const categoryLevels = levels[category];

  if (!categoryLevels) {
    return <h1>Invalid category: {category}</h1>;
  }

  const level = categoryLevels.find(
    (item) => String(item.id).toLowerCase() === String(levelId).toLowerCase()
  );

  if (!level) {
    return <h1>Level not found</h1>;
  }

  return (
    <div className="level-page">
      <h1>{level.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: level.content }} />

      {level.options?.length > 0 && (
        <div className="choices">
          {level.options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => {
                recordAction(category, levelId, opt.key);
                if (opt.correct) {
                  markLevelComplete(category, levelId);
                  navigate("/dashboard");
                }
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
