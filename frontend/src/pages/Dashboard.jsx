// src/pages/Dashboard.jsx

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import "./dashboard.css";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://enphisim-1.onrender.com";

export default function Dashboard() {
  const { progress } = useProgress();

  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH LEVELS ================= */
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const res = await fetch(`${API_URL}/api/levels`);

        if (!res.ok) {
          throw new Error("Failed to fetch levels");
        }

        const data = await res.json();

const normalized = (Array.isArray(data) ? data : []).map((lvl) => {
  const rawLevelNo = lvl.level_no || "";

  return {
    id: rawLevelNo,

    // Keep original like "l1"
    level_no: rawLevelNo,

    // 🔥 Extract numeric part for sorting
    level_number: parseInt(rawLevelNo.replace(/\D/g, "")) || 0,

    category: (lvl.category || "easy").toLowerCase(),

    page_title: lvl.title || lvl.page_title || "",

    template_type: lvl.template_type || "mail",
  };
});
        setLevels(normalized);
      } catch (err) {
        console.error(err);
        setError("Unable to load levels");
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  /* ================= GROUP LEVELS ================= */
  const groupedLevels = useMemo(() => {
    const grouped = {};

    levels.forEach((lvl) => {
      if (!grouped[lvl.category]) {
        grouped[lvl.category] = [];
      }
      grouped[lvl.category].push(lvl);
    });

    Object.keys(grouped).forEach((cat) => {
grouped[cat].sort(
  (a, b) => a.level_number - b.level_number
);
    });

    return grouped;
  }, [levels]);

  /* ================= ANALYTICS ================= */
  const analytics = useDashboardAnalytics(
    progress,
    levels
  );

  const finalUnlocked =
    Number(analytics.completionRate) >= 75 &&
    Number(analytics.accuracy) >= 75;

  /* ================= LOADING ================= */
  if (loading)
    return <div className="dashboard">Loading...</div>;

  if (error)
    return (
      <div className="dashboard">
        <h2>{error}</h2>
      </div>
    );

  /* ================= UI ================= */
  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      {/* ===== Analytics Cards ===== */}
      <div className="analytics-cards">
        <Card title="Levels Completed">
          {analytics.completed} / {analytics.totalLevels}
        </Card>

        <Card title="Completion Rate">
          {analytics.completionRate}%
        </Card>

        <Card title="Total Actions">
          {analytics.totalActions}
        </Card>

        <Card title="Accuracy">
          {analytics.accuracy}%
        </Card>

        <Card title="Safe Actions">
          {analytics.safeActions}
        </Card>

        <Card title="Risk Actions">
          {analytics.riskyActions}
        </Card>
      </div>

      {/* ===== Categories ===== */}
      <h2>Difficulty Levels</h2>

      <div className="levels-grid">
        {Object.keys(groupedLevels).map((category) => {
          const categoryLevels =
            groupedLevels[category];

          const completedCount =
            categoryLevels.filter((lvl) =>
              progress?.completedLevels?.[
                lvl.level_no
              ]
            ).length;

          const percent =
            categoryLevels.length > 0
              ? Math.round(
                  (completedCount /
                    categoryLevels.length) *
                    100
                )
              : 0;

          const nextLevel =
            categoryLevels.find(
              (lvl) =>
                !progress?.completedLevels?.[
                  lvl.level_no
                ]
            ) || categoryLevels[0];

          return (
            <div
              key={category}
              className="level-card"
            >
              <h3>
                {category
                  .replace("_", " ")
                  .toUpperCase()}
              </h3>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percent}%`,
                  }}
                />
              </div>

              <p>
                {completedCount} /{" "}
                {categoryLevels.length} completed
              </p>

              {nextLevel && (
                <Link
                  to={`/levels/${category}/${nextLevel.level_no}`}
                >
                  <button>
                    {percent === 100
                      ? "Replay"
                      : "Start / Continue"}
                  </button>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* ===== Final Level ===== */}
      <div className="final-level">
        <h3>Final Simulation</h3>
        <p>
          Requires 75% completion and
          75% accuracy
        </p>

        {finalUnlocked ? (
          <Link to="/levels/final/final-1">
            <button>Start Final</button>
          </Link>
        ) : (
          <button disabled>Locked</button>
        )}
      </div>
    </div>
  );
}

/* ===== Simple Card Component ===== */
function Card({ title, children }) {
  return (
    <div className="card">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}
