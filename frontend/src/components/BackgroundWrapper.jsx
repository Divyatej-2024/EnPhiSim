import React from "react";
//import "./BackgroundWrapper.css";

export default function BackgroundWrapper({ children }) {
  return (
    <div
      className="bg-wrapper"
      style={{
        backgroundImage: "url(" + process.env.PUBLIC_URL + '/Enphisim.png' + ")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundSize: "400px auto",
        opacity: 0.06,
        zIndex: -1,
      }}
    >
      {children}
    </div>
  );
}
