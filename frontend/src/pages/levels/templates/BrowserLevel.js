import React from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { levels } from "../../levels/level_data";
import "../../../level.css"; // make sure to create this file or change the path

export default function BrowserMock({ url, title, children }) {
  return (
    <div className="browser-window">

      {/* Browser Top */}
      <div className="top-bar">
        <div className="traffic-lights">
          <div className="light red"></div>
          <div className="light yellow"></div>
          <div className="light green"></div>
        </div>

        <div className="tabs">
          <div className="tab active">{title || "ENPHISIM"}</div>
          <div className="tab">New Tab</div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-btn">←</div>
        <div className="nav-btn">→</div>
        <div className="nav-btn">⟳</div>
        <input
          className="url-bar"
          type="text"
          value={url || "https://example.com"}
          readOnly
        />
      </div>

      {/* Webpage Content */}
      <div className="webpage-container">{children}</div>
    </div>
  );
}
