// src/components/Dashboard.js

import React from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { levels } from "./levels/level_data";
import useDashboardAnalytics from "./useDashboardAnalytics"; // <-- NEW IMPORT
import "./dashboard.css";

export default function Dashboard() {
  const { progress } = useProgress();

  // Use the new custom hook to get all calculated data
  const {
    completed,
    totalLevels,
    completionRate,
    totalActions,
    safeActions,
    riskyActions,
    accuracy,
    nextLevelTitle,
    nextLevelPath,
    buttonText,
  } = useDashboardAnalytics(progress, levels); // <-- CLEANER LOGIC

  // Use progress to force dashboard refresh when data changes
  const refreshKey = JSON.stringify(progress);

  // ---------------------------
  // 3. RENDER COMPONENT
  // ---------------------------
  return (
    <div className="dashboard" key={refreshKey}>
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
          <p>
            {completed} / {totalLevels}
          </p>
        </div>

        <div className="card">
          <h3>Completion Rate</h3>
          <p>{completionRate}%</p>
        </div>

        <div className="card blue">
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>

        <div className="card green">
          <h3>Safe Actions</h3>
          <p>{safeActions}</p>
        </div>

        <div className="card red">
          <h3>Risky Actions</h3>
          <p>{riskyActions}</p>
        </div>
      </div>

      {/* =======================
          CURRENT LEVEL CARD
      ======================== */}
      <div className="current-level-card">
        <h2>{nextLevelTitle}</h2>
        <p>Your current phishing training module. Click below to continue.</p>

        <Link className="start-current-btn" to={nextLevelPath}>
          {buttonText}
        </Link>
      </div>

      {/* =======================
          FULL LEVEL LIST
      ======================== */}
      <details className="level-list-details">
        <summary>View All Levels</summary>
        <ul className="level-list">
          {levels.map(lvl => (
            <li
              key={lvl.id}
              className={
                progress.completedLevels[lvl.id]
                  ? "completed"
                  : "pending"
              }
            >
              <Link
                to={`/levels/${lvl.category}/${lvl.Level_no}`}
              >
                {progress.completedLevels[lvl.id] ? "✅" : "➡️"}{" "}
                {lvl.page_title}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
