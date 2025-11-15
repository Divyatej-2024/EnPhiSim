import React from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";

export default function Level1() {
  const navigate = useNavigate();
  const { recordAction, markLevelComplete } = useProgress();

  const handleCorrect = () => {
    recordAction("level1", "clicked_correct_button");
    markLevelComplete("level1");
    navigate("/levels/easy/level2");
  };

  const handleWrong = () => {
    recordAction("level1", "clicked_wrong_button");
    alert("Incorrect! Try again.");
  };

  return (
    <div className="level-container">
      <h1>Level 1: Phishing Basics</h1>

      <button onClick={handleCorrect}>Correct Choice</button>
      <button onClick={handleWrong}>Wrong Choice 1</button>
      <button onClick={handleWrong}>Wrong Choice 2</button>
    </div>
  );
}
