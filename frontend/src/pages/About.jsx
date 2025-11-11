import React from "react";
import { useNavigate } from "react-router-dom";
//import "../level.css"; // reuse your main CSS file


export default function About() {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate("/dashboard");
  };

  return (
    <div className="level-container level-final">
      <div className="level-content">
        <h1>About EnPhiSim</h1>
        <p style={{ fontSize: "1.1rem", lineHeight: "1.8rem", marginTop: "1rem" }}>
          <strong>EnPhiSim (Enhanced Phishing Simulation)</strong> is an interactive WalkThrough
          cybersecurity learning platform designed to raise awareness and train users
          to identify and respond to phishing attacks in real time.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.8rem" }}>
          In today’s digital world, phishing remains one of the most common and
          effective cyberattack methods. EnPhiSim bridges the gap between theory and
          practice by simulating real-world phishing scenarios where users learn by
          doing. Each level represents a unique phishing vector — from deceptive emails
          to malicious web pages — helping users build critical thinking and detection
          skills essential for modern cybersecurity defense.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.8rem" }}>
          The platform also integrates <strong>machine learning models</strong> for
          phishing detection, demonstrating how intelligent systems can analyze message
          patterns and behaviors to prevent attacks before they reach users.
          EnPhiSim not only trains individuals but also helps organizations test and
          enhance their employee security awareness programs.
        </p>

        <p style={{ fontSize: "1.1rem", lineHeight: "1.8rem", marginBottom: "2rem" }}>
          Join the simulation, challenge yourself, and strengthen your defense against
          social engineering threats.
        </p>


        <button onClick={handlePlay} className="level-button">
          Let’s Play →
        </button>
      </div>
    </div>
  );
}
