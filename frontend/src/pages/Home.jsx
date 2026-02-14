import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [showConsent, setShowConsent] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("researchConsent");
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleStart = () => {
    if (localStorage.getItem("researchConsent")) {
      navigate("/simulation"); // change to your actual route
    } else {
      setShowConsent(true);
    }
  };

  const handleConsent = () => {
    localStorage.setItem("researchConsent", "true");
    setShowConsent(false);
    navigate("/simulation"); // change route if needed
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "8rem",
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

      <button
        onClick={handleStart}
        style={{
          background: "#38bdf8",
          color: "#0f172a",
          padding: "0.75rem 1.5rem",
          borderRadius: "9999px",
          border: "none",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Let's Begin
      </button>

      {/* CONSENT MODAL */}
      {showConsent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              padding: "2rem",
              borderRadius: "12px",
              maxWidth: "600px",
              color: "white",
              textAlign: "left",
            }}
          >
            <h2 style={{ marginBottom: "1rem", color: "#38bdf8" }}>
              Informed Consent – Research Study
            </h2>

            <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
              This platform simulates phishing attack scenarios to evaluate user
              decision-making behaviour and compare machine learning classifiers
              including DistilBERT and CNN.
            </p>

            <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
              The system records anonymous interaction data such as responses,
              timestamps, and behavioural classifications. No personal
              identifiers are collected.
            </p>

            <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
              Participation is voluntary. You may withdraw at any time by
              clearing your browser storage.
            </p>

            <div style={{ marginBottom: "1rem" }}>
              <input
                type="checkbox"
                id="consent"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <label htmlFor="consent" style={{ marginLeft: "0.5rem" }}>
                I have read and understood the above information and consent to
                anonymous data processing.
              </label>
            </div>

            <button
              disabled={!checked}
              onClick={handleConsent}
              style={{
                background: checked ? "#38bdf8" : "#64748b",
                color: "#0f172a",
                padding: "0.6rem 1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: checked ? "pointer" : "not-allowed",
              }}
            >
              Start Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;