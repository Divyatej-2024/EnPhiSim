// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import "./dashboard.css";

const API_URL = "https://enphisim-1.onrender.com/";

export default function Dashboard() {
  const { progress } = useProgress();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ---------------- FETCH LEVELS FROM LIVE BACKEND ---------------- */
  useEffect(() => {
    if (!API_URL) {
      setError("API URL not configured");
      setLoading(false);
      return;
    }

    const fetchLevels = async () => {
      try {
        const endpoint = `${API_URL}/api/levels`;
        console.log("🔗 Fetching levels from:", endpoint);

        const res = await fetch(endpoint);

        const raw = await res.text();
        console.log("📦 RAW RESPONSE:", raw);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        // ❌ HTML means wrong server (React instead of Express)
        if (raw.trim().startsWith("<")) {
          throw new Error("Received HTML instead of JSON (wrong API URL)");
        }

        const data = JSON.parse(raw);

        // ✅ Accept both array & wrapped responses
        const levelArray = Array.isArray(data)
          ? data
          : Array.isArray(data.levels)
          ? data.levels
          : [];

        console.log("✅ Parsed levels:", levelArray);
        setLevels(levelArray);
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
        <p>Check API URL & backend deployment.</p>
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
                  key={lvl._id || lvl.level_no}
                  className={done ? "completed" : "pending"}
                >
                  <Link to={`/levels/${lvl.category}/${lvl.level_no}`}>
                    {done ? "✅" : "➡️"} {lvl.title}
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
