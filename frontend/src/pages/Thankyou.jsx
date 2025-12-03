import React from "react";
import "../level.css";
import avtar from "../../public/img/avtar"
import { useProgress } from "../context/ProgressContext";

export default function ThankYouPage() {
  const { progress } = useProgress();

  const timeTaken = progress?.timeTaken || "{timeTaken}";
  const totalActions = Object.values(progress?.attempts || {}).flat().length || 0;


  const actions = Object.values(progress?.attempts || {}).flat();
  const safe = actions.filter(a => a.correct).length;
  const risky = actions.filter(a => !a.correct).length;
  const accuracy = totalActions > 0 ? ((safe / totalActions) * 100).toFixed(1) : "0";

  const completedLevels = Object.keys(progress?.completedLevels || {}).length;

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        {/* Logo Circle */}
        <div className="logo-wrapper">
          <div className="logo-circle"><img src={'${process.env.PUBLIC_url}/img/avtar.png'}/></div>
        </div>

        {/* Title */}
        <h1 className="ty-title">Thank You</h1>

        {/* Time Section */}
        <p className="ty-line">You completed it in</p>
        <p className="ty-value">{timeTaken}</p>

        {/* Actions Section */}
        <p className="ty-line">Total Actions</p>
        <p className="ty-value">{totalActions} Actions</p>

        {/* Button */}
        <div className="ty-btn-wrap">
          <button
            className="ty-btn"
            onClick={() => (window.location.href = "/")}
          >
            See You Again
          </button>
          </div>
                {/* Summary Section */}
        <div className="summary-box">
          <div className="summary-title">Performance Overview</div>
          <div className="summary-main">Accuracy: {accuracy}%</div>
          <div className="summary-sub">Safe: {safe} • Risky: {risky}</div>
          <div className="summary-note">Completed Levels: {completedLevels}</div>
          </div>
      </div> 
    </div>  
  );
}
