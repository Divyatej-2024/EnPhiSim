// Sections: imports, configuration, logic, render/exports

// frontend/src/pages/ThankYouPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import "./ThankYouPage.css";

export default function ThankYouPage() {
  const { progress } = useProgress();
  const navigate = useNavigate();

  const timeTaken = progress?.timeTaken || "N/A";
  const actions = Array.isArray(progress?.actions) ? progress.actions : [];
  const totalActions = actions.length;
  const safe = actions.filter((a) => (a?.isCorrect ?? a?.correct) === true).length;
  const risky = actions.filter((a) => (a?.isCorrect ?? a?.correct) === false).length;
  const accuracy = totalActions > 0 ? ((safe / totalActions) * 100).toFixed(1) : "0";
  const completedLevels = Object.keys(progress?.completedLevels || {}).length;

  const levelStats = actions.reduce((acc, action) => {
    const level = action?.level || "unknown";
    if (!acc[level]) acc[level] = { total: 0, correct: 0 };
    acc[level].total += 1;
    if (action?.isCorrect) acc[level].correct += 1;
    return acc;
  }, {});

  const formatTime = (time) => {
    if (time === "N/A") return time;
    if (typeof time === 'string') return time;
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="thankyou-page">
      <div className="thankyou-card-wrap">
        {/* Animated Success Icon */}
        <div className="thankyou-icon" aria-hidden="true">
          <span className="thankyou-icon-core" />
          <span className="thankyou-icon-ring" />
          <span className="thankyou-icon-ring delayed" />
        </div>

        {/* Main Heading */}
        <h1 className="thankyou-heading">Thank You!</h1>
        <p className="thankyou-subtitle">You've completed the EnPhiSim simulation</p>

        {/* Stats Grid */}
        <div className="thankyou-stats">
          <div className="thankyou-stat">
            <span className="stat-number">{formatTime(timeTaken)}</span>
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

        {/* Performance Overview */}
        <div className="performance-box">
          <h3 className="performance-title">Performance Overview</h3>
          
          {/* Performance Bars */}
          <div className="performance-bars">
            <div className="bar-item">
              <div className="bar-label">
                <span>Safe Decisions</span>
                <span>{safe} / {totalActions}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill safe"
                  style={{ width: totalActions > 0 ? `${(safe / totalActions) * 100}%` : "0%" }}
                />
              </div>
            </div>
            <div className="bar-item">
              <div className="bar-label">
                <span>Risky Decisions</span>
                <span>{risky} / {totalActions}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill risky"
                  style={{ width: totalActions > 0 ? `${(risky / totalActions) * 100}%` : "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Level Breakdown */}
          {Object.keys(levelStats).length > 0 && (
            <div className="level-breakdown">
              <h4 className="breakdown-title">Level-by-Level Results</h4>
              {Object.entries(levelStats)
                .sort(([a], [b]) => {
                  const aNum = parseInt(a.replace(/[^\d]/g, '')) || 0;
                  const bNum = parseInt(b.replace(/[^\d]/g, '')) || 0;
                  return aNum - bNum;
                })
                .map(([level, stats]) => (
                  <div key={level} className="breakdown-row">
                    <span className="breakdown-level">Level {level.toUpperCase()}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill safe"
                        style={{ width: stats.total > 0 ? `${(stats.correct / stats.total) * 100}%` : "0%" }}
                      />
                    </div>
                    <span className="breakdown-score">
                      {stats.correct}/{stats.total}
                    </span>
                  </div>
                ))}
            </div>
          )}

          {/* Privacy Note */}
          <div className="performance-note">
            <strong> Your privacy matters</strong>
            <p>
              Your anonymous session ID has been recorded for research purposes.
              No personal data was collected during this simulation.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="thankyou-actions">
          <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
            View Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/model-metrics")}>
            ML Model Performance
          </button>
          <button className="btn btn-outline" onClick={() => navigate("/")}>
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}

