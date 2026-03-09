import React from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";

export default function ThankYouPage() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  const timeTaken = progress?.timeTaken || "N/A";
  const actions = Array.isArray(progress?.actions) ? progress.actions : [];
  const totalActions = actions.length;
  const safe = actions.filter(a => (a?.isCorrect ?? a?.correct) === true).length;
  const risky = actions.filter(a => (a?.isCorrect ?? a?.correct) === false).length;
  const accuracy = totalActions > 0 ? ((safe / totalActions) * 100).toFixed(1) : "0";
  const completedLevels = Object.keys(progress?.completedLevels || {}).length;

  // Group actions by level for per-level breakdown
  const levelStats = actions.reduce((acc, a) => {
    const lvl = a?.level || 'unknown';
    if (!acc[lvl]) acc[lvl] = { total: 0, correct: 0 };
    acc[lvl].total += 1;
    if (a?.isCorrect) acc[lvl].correct += 1;
    return acc;
  }, {});

  return (
    <div className="thankyou-page">
      <div className="thankyou-card-wrap">
        <div className="thankyou-icon">🎉</div>
        <h1 className="thankyou-heading">Thank You!</h1>
        <p className="thankyou-subtitle">You've completed the EnPhiSim simulation</p>

        <div className="thankyou-stats">
          <div className="thankyou-stat">
            <span className="stat-number">{timeTaken}</span>
            <span className="stat-label">Time Taken</span>
          </div>
          <div className="thankyou-stat">
            <span className="stat-number">{totalActions}</span>
            <span className="stat-label">Total Actions</span>
          </div>
          <div className="thankyou-stat">
            <span className="stat-number">{accuracy}%</span>
            <span className="stat-label">Accuracy</span>
          </div>
          <div className="thankyou-stat">
            <span className="stat-number">{completedLevels}</span>
            <span className="stat-label">Levels Completed</span>
          </div>
        </div>

        <div className="performance-box">
          <h3 className="performance-title">Performance Overview</h3>
          <div className="performance-bars">
            <div className="bar-item">
              <span className="bar-label">Safe Decisions</span>
              <div className="bar-track">
                <div
                  className="bar-fill safe"
                  style={{ width: totalActions > 0 ? `${(safe / totalActions) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="bar-value">{safe}</span>
            </div>
            <div className="bar-item">
              <span className="bar-label">Risky Decisions</span>
              <div className="bar-track">
                <div
                  className="bar-fill risky"
                  style={{ width: totalActions > 0 ? `${(risky / totalActions) * 100}%` : '0%' }}
                ></div>
              </div>
              <span className="bar-value">{risky}</span>
            </div>
          </div>

          {/* Per-level breakdown */}
          {Object.keys(levelStats).length > 0 && (
            <div className="level-breakdown">
              <h4 className="breakdown-title">Level-by-Level Results</h4>
              {Object.entries(levelStats).sort().map(([lvl, stats]) => (
                <div key={lvl} className="breakdown-row">
                  <span className="breakdown-level">Level {lvl.toUpperCase()}</span>
                  <div className="bar-track">
                    <div
                      className="bar-fill safe"
                      style={{ width: stats.total > 0 ? `${(stats.correct / stats.total) * 100}%` : '0%' }}
                    ></div>
                  </div>
                  <span className="breakdown-score">
                    {stats.correct}/{stats.total}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="performance-note">
            Your anonymous session ID has been recorded for research purposes.
            No personal data was collected during this simulation.
          </div>
        </div>

        <div className="thankyou-actions">
          <button
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            📊 View Dashboard
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/model-metrics')}
          >
            🤖 ML Model Performance
          </button>
          <button
            className="btn btn-outline"
            onClick={() => (window.location.href = "/")}
          >
            ← Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
