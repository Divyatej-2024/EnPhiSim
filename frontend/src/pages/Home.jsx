import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "4rem",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        minHeight: "100vh",
        color: "white",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <img
        src={`${process.env.PUBLIC_URL}/Enphisim.png`}
        alt="EnPhiSim Logo"
        width="160"
        style={{ marginBottom: "1.5rem" }}
      />
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>
        Welcome to <span style={{ color: "#38bdf8" }}>EnPhiSim</span>
      </h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "2rem", color: "#cbd5e1" }}>
        Your phishing simulation and awareness platform.
      </p>
      <Link
        to="/LevelCard"
        style={{
          display: "inline-block",
          background: "#38bdf8",
          color: "#0f172a",
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
          textDecoration: "none",
          fontWeight: "600",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.background = "#7dd3fc")}
        onMouseLeave={(e) => (e.target.style.background = "#38bdf8")}
      >
        Let's Begin
      </Link>
    </div>
  );
}

export default Home;

