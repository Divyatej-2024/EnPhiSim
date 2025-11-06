import React from "react";

export default function BackgroundWrapper({ children }) {
  const wrapperStyle = {
    position: "relative",
    minHeight: "100vh",
    overflow: "hidden",
  };

  const fadedLogoStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: `url(${process.env.PUBLIC_URL}/Enphisim.png)`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    backgroundSize: "400px auto",
    opacity: 0.06,
    zIndex: -1,
    pointerEvents: "none",
  };

  return (
    <div style={wrapperStyle}>
      <div style={fadedLogoStyle}></div>
      {children}
    </div>
  );
}
