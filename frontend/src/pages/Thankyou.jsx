import React from "react";
import "../level.css";

export default function ThankYouPage() {
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
        <p className="ty-value">0 Actions</p>

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
