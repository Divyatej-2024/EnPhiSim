// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import { normalizeLevelArray } from "../utils/LevelHelper"; 
import "./dashboard.css";

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || "https://enphisim-1.onrender.com";

export default function Dashboard() {
  const { progress } = useProgress();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  /* ---------------- FETCH LEVELS ---------------- */
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const data = await safeFetchJSON(`${REACT_APP_API_URL}/api/levels`);

        const levelArray = Array.isArray(data) ? data : data.levels || [];

        // Normalize levels (handle consistent naming)
        const normalized = normalizeLevelArray(levelArray).map((lvl) => ({
          id: lvl.id,
          level_no: lvl.level_no.toLowerCase(), // ensure lowercase
          category: lvl.category.toLowerCase(),
          page_title: lvl.page_title || lvl.title || "",
          template_type: lvl.template || "mail",
        }));

        setLevels(normalized);
      } catch (err) {
        console.error("Fetch levels error:", err);
        setError(err.message || "Failed to load levels");
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  /* ---------------- GROUP LEVELS BY CATEGORY ---------------- */
  const levelsByCategory = useMemo(() => {
    return levels.reduce((acc, lvl) => {
      acc[lvl.category] = acc[lvl.category] || [];
      acc[lvl.category].push(lvl);
      return acc;
    }, {});
  }, [levels]);

  /* ---------------- CATEGORY STATS ---------------- */
  const categoryStats = useMemo(() => {
    return Object.entries(levelsByCategory).map(([category, lvls]) => {
      const completedCount = lvls.filter(
        (l) => progress.completedLevels?.[l.level_no]
      ).length;

      const percent = Math.round((completedCount / lvls.length) * 100);

      const nextLevel =
        lvls.find((l) => !progress.completedLevels?.[l.level_no]) || lvls[0];

      return {
        category,
        completedCount,
        total: lvls.length,
        percent,
        nextLevel,
      };
    });
  }, [levelsByCategory, progress]);

  /* ---------------- ANALYTICS ---------------- */
  const {
    completed,
    totalLevels,
    totalActions,
    completionRate,
    accuracy,
    safeActions,
    riskyActions,
  } = useDashboardAnalytics(progress, levels);

  /* ---------------- FINAL LEVEL UNLOCK ---------------- */
  const finalUnlocked = completionRate >= 75 && accuracy >= 75;

  /* ---------------- UI STATES ---------------- */
  if (loading) return <div className="dashboard">Loading…</div>;
  if (error)
    return (
      <div className="dashboard error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );

  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      {/* ---------------- ANALYTICS SUMMARY ---------------- */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Levels Completed</h3>
          <p>{completed} / {totalLevels}</p>
        </div>

        <div className="card blue">
          <h3>Completion Rate</h3>
          <p>{completionRate}%</p>
        </div>

        <div className="card">
          <h3>Total Actions</h3>
          <p>{totalActions || 0}</p>
        </div>

        <div className="card red">
          <h3>Accuracy</h3>
          <p>{accuracy}%</p>
        </div>

        <div className="card green">
          <h3>Safe Actions</h3>
          <p>{safeActions}%</p>
        </div>

        <div className="card orange">
          <h3>Risk Actions</h3>
          <p>{riskyActions}%</p>
        </div>
      </div>

      {/* ---------------- CATEGORY GRID ---------------- */}
      <h2 style={{ textAlign: "center" }}>Difficulty Progress</h2>
      <div className="levels-grid">
        {categoryStats.map((cat) => (
          <div
            key={cat.category}
            className="level-card"
            onClick={() => setActiveCategory(cat)}
          >
            <h3>{cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}</h3>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${cat.percent}%` }}
              />
            </div>

            <span>
              {cat.completedCount} / {cat.total} completed ({cat.percent}%)
            </span>

            <Link
              className="start-link"
              to={`/levels/${cat.category}/${cat.nextLevel.level_no}`}
            >
              {cat.percent === 100 ? "Replay" : "Start / Continue"}
            </Link>
          </div>
        ))}
      </div>

      {/* ---------------- ACTIVE CATEGORY PANEL ---------------- */}
      {activeCategory && (
        <div className="actions-panel">
          <h2>Selected Category</h2>
          <p>
            <strong>{activeCategory.category}</strong>
          </p>
          <p>
            Progress: {activeCategory.completedCount} / {activeCategory.total}
          </p>

          <Link
            className="btn primary"
            to={`/levels/${activeCategory.category}/${activeCategory.nextLevel.level_no}`}
          >
            Continue
          </Link>
        </div>
      )}

      {/* ---------------- FINAL LEVEL ---------------- */}
      <div
        className={`final-level ${finalUnlocked ? "unlocked" : "locked"}`}
      >
        <h3>Final Simulation</h3>
        <p>Requires 75% completion & 75% accuracy</p>

        {finalUnlocked ? (
          <Link to="/levels/final/f">
            <button>Start Final Level</button>
          </Link>
        ) : (
          <button disabled>Locked</button>
        )}
      </div>
    </div>
  );
}