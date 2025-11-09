// src/pages/levels/easy/L1.jsx
import React from "react";
import "./l1.css";

export default function L1() {
  return (
    <div className="level1-wrapper">
      <header className="level1-header">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="back-btn"
        >
          Back to Dashboard
        </button>
        <h1>Level 1 — Phishing Email Basics</h1>
        <p>Understand how attackers trick users through social engineering.</p>
      </header>

      <section className="level1-content">
        <h2>Scenario:</h2>
        <p>
          You’ve received an email claiming to be from your university IT
          department. It asks you to “verify your account immediately” by
          clicking a link.
        </p>

        <h3>Your Task:</h3>
        <ul>
          <li>Inspect the sender’s address carefully.</li>
          <li>Hover over the link without clicking it.</li>
          <li>Identify suspicious elements and report the email.</li>
        </ul>
      </section>

      <footer className="level1-footer">
       copyright 2025@ Enphisim 
      </footer>
    </div>
  );
}
