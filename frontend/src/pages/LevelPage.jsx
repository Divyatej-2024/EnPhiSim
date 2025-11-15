import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();  // FIXED
  const navigate = useNavigate();

  const { recordAction, markLevelComplete } = useProgress();
  const [level, setLevel] = useState(null);

useEffect(() => {
  console.log("PARAM category:", category);
  console.log("PARAM levelId:", levelId);

  console.log("First 5 levels:", levels.slice(0, 5));

  const lvl = levels.find(
    (l) => l.category === category && l.id === levelId
  );

  console.log("MATCHED LEVEL:", lvl);

  setLevel(lvl);
}, [category, levelId]);


  if (!level) return <p>Loading...</p>;

  const handleOptionClick = (option) => {
    recordAction(levelId, option.label);

    if (option.correct) {
      markLevelComplete(levelId);
      navigate(level.next);
    } else {
      alert("Incorrect! Try again.");
    }
  };

  return (
    <div className="level-container">
      <h1>{level.page_title}</h1>

      <div
        className="email-content"
        dangerouslySetInnerHTML={{ __html: level.content }}
      />

      <div className="options">
        {level.options.map((opt) => (
          <button key={opt.key} onClick={() => handleOptionClick(opt)}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
