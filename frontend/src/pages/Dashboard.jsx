// src/components/Dashboard.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import "./dashboard.css";

const API_URL = "https://enphisim-1.onrender.com";

export default function Dashboard() {
  const { progress } = useProgress();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH LEVELS ---------------- */
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        if (!API_URL) {
          throw new Error("API URL not configured");
        }

        const endpoint = `${API_URL}/api/levels`;
        console.log("🔗 Fetching levels from:", endpoint);

        const data = await safeFetchJSON(endpoint);

        // Accept array or wrapped response
        const levelArray = Array.isArray(data)
          ? data
          : Array.isArray(data.levels)
          ? data.levels
          : [];

        if (levelArray.length === 0) {
          throw new Error("No levels returned from API");
        }

        // Normalize backend data
        const normalizedLevels = levelArray.map((lvl) => ({
          id: lvl.id,
          level_no: lvl.Level_no,
          category: lvl.category,
          page_title: lvl.page_title,
          template_type: lvl.template_type,
        }));

        console.log("✅ Normalized Levels:", normalizedLevels);
        setLevels(normalizedLevels);
      } catch (err) {
        console.error("❌ Level fetch failed:", err.message);
        setError(err.message);
        setLevels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

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

  const refreshKey = JSON.stringify(progress);

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return <div className="dashboard">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="dashboard error">
        <h2>Dashboard Error</h2>
        <p>{error}</p>
        <p>Check backend deployment & API availability.</p>
      </div>
    );
  }

  return (
    <div className="dashboard" key={refreshKey}>
      <h1>EnPhiSim Dashboard</h1>

      {/* ---------------- SUMMARY CARDS ---------------- */}
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

      {/* ---------------- CURRENT LEVEL ---------------- */}
      <div className="current-level-card">
        <h2>{nextLevelTitle || "All Levels Completed 🎉"}</h2>
        <p>Your current phishing simulation module.</p>

        {nextLevelPath && (
          <Link className="start-current-btn" to={nextLevelPath}>
            {buttonText}
          </Link>
        )}
      </div>

      {/* ---------------- LEVEL LIST ---------------- */}
      <details className="level-list-details">
        <summary>View All Levels</summary>

        {levels.length === 0 ? (
          <p>No levels found in database.</p>
        ) : (
          <ul className="level-list">
            {levels.map((lvl) => {
              const done = progress.completedLevels?.[lvl.level_no];

              return (
                <li
                  key={lvl.level_no}   // ✅ Stable & unique
                  className={done ? "completed" : "pending"}
                >
                  <Link to={`/levels/${lvl.category}/${lvl.level_no}`}>
                    {done ? "✅" : "➡️"} {lvl.page_title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </details>
    </div>
  );
}
