import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data.js";

export default function LevelPage() {
  const { category, levelId } = useParams();
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  // FIXED: levels are grouped by category
//  const categoryLevels = levels[category];

  //if (!categoryLevels) {
    //return <h1>Invalid category: {category}</h1>;
  //}

  const level = levels.find(
    (item) => String(item.category ?? "").toLowerCase() ===(category ?? "").toLowerCase() &&
    String(item.id).toLowerCase() === String(levelId).toLowerCase()
  );

  if (!level)
    return <h1>Level not found</h1>;

const options = [
{ key: "correct", label: level.correct_option, correct:true },
{ key: "neutral", label: level.neutral_option, correct:false },
{ key: "wrong", label: level.wrong_option, correct:false },
];

const handleOptionClick = (option) = > {
	recordAction(level.Level_no, option.key);
	
	if (option.correct){
	markLevelComplete(level.Level_no);
	navigate("/dashboard");
	} else{
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
