import React from "react";
import "./BackgroundWrapper.css";

export default function BackgroundWrapper({ children }) {
  return <div className="bg-wrapper">{children}</div>;
}
