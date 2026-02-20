// frontend/src/pages/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { safeFetchJSON } from "../utils/helper";
import { useProgress } from "../context/ProgressContext";
import useDashboardAnalytics from "./useDashboardAnalytics";
import { normalizeLevelArray } from "../utils/LevelHelper";
import "./dashboard.css";

const REACT_APP_API_URL =
  process.env.REACT_APP_API_URL || "https://enphisim-1.onrender.com";

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
        const data = await safeFetchJSON(
          `${REACT_APP_API_URL}/api/levels`
        );

        const levelArray = Array.isArray(data)
          ? data
          : data.levels || [];

        const normalized = normalizeLevelArray(levelArray).map(
          (lvl) => ({
            id: lvl.id,
            level_no: lvl.level_no.toLowerCase(),
            category: lvl.category.toLowerCase(),
            page_title: lvl.page_title || lvl.title || "",
            template_type:
              lvl.template_type || lvl.template || "mail",
          })
        );

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

  /* ---------------- ORDERED CATEGORY FLOW ---------------- */

  /* ---------------- GROUP + SORT LEVELS ---------------- */
  const levelsByCategory = useMemo(() => {
    const grouped = levels.reduce((acc, lvl) => {
      acc[lvl.category] = acc[lvl.category] || [];
      acc[lvl.category].push(lvl);
      return acc;
    }, {});

    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => {
        const numA =
          parseInt(a.level_no.split("-")[1]) || 0;
        const numB =
          parseInt(b.level_no.split("-")[1]) || 0;
        return numA - numB;
      });
    });

    return grouped;
  }, [levels]);

  /* ---------------- CATEGORY STATS ---------------- */
  const categoryStats = useMemo(() => {

    const CATEGORY_ORDER = [
      "easy",
      "adv_easy",
      "normal",
      "pre_hard",
      "hard",
      "adv_hard",
      "final",
    ];

    return CATEGORY_ORDER
      .filter((cat) => levelsByCategory[cat])
      .map((category, index) => {
        const lvls = levelsByCategory[category] || [];

        const completedCount = lvls.filter(
          (l) => progress.completedLevels?.[l.level_no]
        ).length;

        const percent =
          lvls.length === 0
            ? 0
            : Math.round((completedCount / lvls.length) * 100);

        const previousCategory = CATEGORY_ORDER[index - 1];

        const unlocked =
          index === 0 ||
          (levelsByCategory[previousCategory] &&
            levelsByCategory[previousCategory].every((l) =>
              progress.completedLevels?.[l.level_no]
            ));

        const nextLevel =
          lvls.find((l) => !progress.completedLevels?.[l.level_no]) || lvls[0];

        return {
          category,
          completedCount,
          total: lvls.length,
          percent,
          nextLevel,
          unlocked,
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

  const finalUnlocked =
    completionRate >= 75 && accuracy >= 75;

  /* ---------------- LOADING / ERROR ---------------- */
  if (loading)
    return (
      <div className="dashboard">
        Loading…
      </div>
    );

  if (error)
    return (
      <div className="dashboard error">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="dashboard">
      <h1>EnPhiSim Dashboard</h1>

      {/* ================= ANALYTICS SUMMARY ================= */}
      <div className="analytics-cards">
        <div className="card">
          <h3>Levels Completed</h3>
          <p>
            {completed} / {totalLevels}
          </p>
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

      {/* ================= DIFFICULTY GRID ================= */}
      <h2 style={{ textAlign: "center" }}>
        Difficulty Progress
      </h2>

      <div className="levels-grid">
        {categoryStats.map((cat) => (
          <div
            key={cat.category}
            className={`level-card ${cat.unlocked
                ? "unlocked"
                : "locked"
              }`}
            onClick={() =>
              cat.unlocked &&
              setActiveCategory(cat)
            }
          >
            <h3>
              {cat.category
                .replace("_", " ")
                .toUpperCase()}
            </h3>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${cat.percent}%`,
                }}
              />
            </div>

            <span>
              {cat.completedCount} /{" "}
              {cat.total} completed (
              {cat.percent}%)
            </span>

            {cat.unlocked ? (
              <Link
                className="start-link"
                to={`/levels/${cat.category}/${cat.nextLevel?.level_no}`}
              >
                {cat.percent === 100
                  ? "Replay"
                  : "Start / Continue"}
              </Link>
            ) : (
              <button
                className="locked-btn"
                disabled
              >
                Locked
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ================= ACTIVE CATEGORY ================= */}
      {activeCategory && (
        <div className="actions-panel">
          <h2>
            {activeCategory.category
              .replace("_", " ")
              .toUpperCase()}
          </h2>

          <p>
            Progress:{" "}
            {activeCategory.completedCount} /{" "}
            {activeCategory.total}
          </p>

          <Link
            className="btn primary"
            to={`/levels/${activeCategory.category}/${activeCategory.nextLevel?.level_no}`}
          >
            Continue
          </Link>
        </div>
      )}

      {/* ================= FINAL LEVEL ================= */}
      <div
        className={`final-level ${finalUnlocked
            ? "unlocked"
            : "locked"
          }`}
      >
        <h3>Final Simulation</h3>
        <p>
          Requires 75% completion &
          75% accuracy
        </p>

        {finalUnlocked ? (
          <Link to="/levels/final/final-1">
            <button>
              Start Final Level
            </button>
          </Link>
        ) : (
          <button disabled>
            Locked
          </button>
        )}
      </div>
    </div>
  );
}