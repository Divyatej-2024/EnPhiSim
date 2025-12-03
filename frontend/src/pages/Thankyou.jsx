import React from "react";
import "../level.css";

import { useProgress } from "../context/ProgressContext";

export default function ThankYouPage() {
  const { progress } = useProgress();

  const timeTaken = progress?.timeTaken || "{timeTaken}";
  const totalActions = Object.values(progress?.attempts || {}).flat().length || 0;

  return (
    <div className="thankyou-container">
      <div className="thankyou-card">
        {/* Logo Circle */}
        <div className="logo-wrapper">
          <div className="logo-circle">LOGO</div>
        </div>

        {/* Title */}
        <h1 className="ty-title">Thank You</h1>

        {/* Time Section */}
        <p className="ty-line">You completed it in</p>
        <p className="ty-value">00:00:00</p>

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
      </div>
    </div>
  );
}
