import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data";
import "./dashboard.css";

export default function Dashboard() {
  const { progress } = useProgress();

  // ---------------------------
  // 1. ANALYTICS & CALCULATIONS
  // ---------------------------
  const completed = Object.keys(progress.completedLevels).length;
  const totalLevels = levels.length;
  const totalActions = actions.length;
  const actions = progress.actions || [];

  // Categorizing actions
  const riskyActions = actions.filter(a => !a.correct).length;

  const safeActions = actions.filter(a => a.correct).length;

  // Accuracy = correct actions / total actions
  const correctActions = safeActions;
  const accuracy = totalActions > 0 ? ((correctActions / totalActions) * 100).toFixed(1) : 0;

  // Completion Rate
  const completionRate = totalActions > 0 ? ((completed / totalLevels) * 100).toFixed(1) : 0;

  
  // ---------------------------
  // 2. FIND CURRENT/NEXT LEVEL
  // ---------------------------

  // Find the first level that hasn't been completed.
  const currentLevel = levels.find(lvl => !progress.completedLevels[lvl.id]);

  const nextLevelTitle = currentLevel 
    ? currentLevel.page_title 
    : "All Levels Completed!";
    
  const nextLevelPath = currentLevel 
    ? `/levels/${currentLevel.category}/${currentLevel.Level_no}` 
    : '/summary'; // Direct to a summary/congratulations page if finished

  const buttonText = currentLevel ? "Start Current Level" : "Review All Levels";

  // ---------------------------
  // 3. RENDER COMPONENT
  // ---------------------------
  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      {/* =======================
          SUMMARY ANALYTICS
      ======================== */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Total Actions</h3>
          <p>{totalActions}</p>
        </div>

        <div className="card">
          <h3>Completed Levels</h3>
          <p>{completed} / {totalLevels}</p>
        </div>

        <div className="card">
          <h3>Completion Rate</h3>
          <p>{completionRate}%</p>
        </div>

        {/* Highlight ML-related analytics as requested */}
        <div className="card blue">
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>

        <div className="card red">
          <h3>Risky Actions</h3>
          <p>{riskyActions}</p>
        </div>
      </div>

      {/* =======================
          CURRENT LEVEL CARD (REPLACES TABLE)
      ======================== */}
      <div className="current-level-card">
        <h2>{nextLevelTitle}</h2>
        <p>Your current phishing training module. Click below to continue.</p>
        
        <Link
          className="start-current-btn"
          to={nextLevelPath}
        >
          {buttonText}
        </Link>
      </div>

      {/* Optionally, keep the full level list for navigation/review, but simplified */}
      <details className="level-list-details">
        <summary>View All Levels</summary>
        <ul className="level-list">
          {levels.map(lvl => (
            <li key={lvl.id} className={progress.completedLevels[lvl.id] ? 'completed' : 'pending'}>
              <Link to={`/levels/${lvl.category}/${lvl.Level_no}`}>
                {progress.completedLevels[lvl.id] ? '✅' : '➡️'} {lvl.page_title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
