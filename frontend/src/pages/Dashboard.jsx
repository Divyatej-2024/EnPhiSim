// src/components/Dashboard.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import "./dashboard.css";

export default function Dashboard() {
  const { progress } = useProgress();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH LEVELS FROM LIVE SERVER ---------------- */
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/levels`
        );

        const data = await response.json();

        // ✅ Handle both array and wrapped responses safely
        if (Array.isArray(data)) {
          setLevels(data);
        } else if (Array.isArray(data.levels)) {
          setLevels(data.levels);
        } else {
          console.error("Unexpected API response shape:", data);
          setLevels([]);
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
        setLevels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  /* ---------------- DEBUG (KEEP DURING DEV) ---------------- */
  useEffect(() => {
    console.log("Levels from backend:", levels);
  }, [levels]);

  /* ---------------- ANALYTICS ---------------- */
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
  } = useDashboardAnalytics(progress, levels);

  /* Force refresh when progress updates */
  const refreshKey = JSON.stringify(progress);

  if (loading) {
    return <div className="dashboard">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard" key={refreshKey}>
      <h1>EnPhiSim Dashboard</h1>

      {/* ---------------- SUMMARY ANALYTICS ---------------- */}
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

      {/* ---------------- CURRENT / NEXT LEVEL ---------------- */}
      <div className="current-level-card">
        <h2>{nextLevelTitle || "All Levels Completed 🎉"}</h2>
        <p>Your current phishing training module.</p>

        {nextLevelPath && (
          <Link className="start-current-btn" to={nextLevelPath}>
            {buttonText}
          </Link>
        )}
      </div>

      {/* ---------------- FULL LEVEL LIST ---------------- */}
      <details className="level-list-details">
        <summary>View All Levels</summary>

        <ul className="level-list">
          {levels.map((lvl) => {
            const completed = progress.completedLevels?.[lvl.level_no];

            return (
              <li
                key={lvl._id || lvl.level_no}
                className={completed ? "completed" : "pending"}
              >
                <Link to={`/levels/${lvl.category}/${lvl.level_no}`}>
                  {completed ? "✅" : "➡️"} {lvl.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
}
