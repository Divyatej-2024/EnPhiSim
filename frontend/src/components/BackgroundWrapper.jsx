// frontend/src/components/BackgroundWrapper.jsx
import React from "react";
import './BackgroundWrapper.css'; // Import CSS file instead

export default function BackgroundWrapper({ children }) {
  return (
    <div className="bg-wrapper">
      <div className="faded-logo"></div>
      {children}
    </div>
  );
}