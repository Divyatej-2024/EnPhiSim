import React from "react";
import { useProgress } from "../context/ProgressContext";

export default function ThankYouPage() {
  const { progress } = useProgress();

  const timeTaken = progress?.timeTaken || "N/A";
  const totalActions = Array.isArray(progress?.actions) ? progress.actions.length : 0;
  const actions = Array.isArray(progress?.actions) ? progress.actions : [];
  const safe = actions.filter(a => (a?.isCorrect ?? a?.correct) === true).length;
  const risky = actions.filter(a => (a?.isCorrect ?? a?.correct) === false).length;
  const accuracy = totalActions > 0 ? ((safe / totalActions) * 100).toFixed(1) : "0";
  const completedLevels = Object.keys(progress?.completedLevels || {}).length;

  return (
    <div className="thankyou-page">
      <div className="thankyou-card-wrap">
        <div className="thankyou-icon">🎉</div>
        <h1 className="thankyou-heading">Thank You!</h1>
        <p className="thankyou-subtitle">You've completed the simulation</p>

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
          <div className="performance-note">
            Completed Levels: {completedLevels}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = "/")}
          style={{ marginTop: '28px' }}
        >
          See You Again →
        </button>
      </div>
    </div>
  );
}
