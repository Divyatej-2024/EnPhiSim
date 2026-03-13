// frontend/src/pages/levels/templates/MultiphaseLevel.jsx
import React, { useState, useEffect } from "react";
import BaseLevel from "./BaseLevel";
import "./MultiphaseLevel.css";

export default function MultiphaseLevel({ level: scenario, onAction, locked }) {
  const [phase, setPhase] = useState(1);
  const [responses, setResponses] = useState({});
  const [threatLevel, setThreatLevel] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [showEvidence, setShowEvidence] = useState({});

  if (!scenario) {
    console.error('MultiphaseLevel: No scenario provided');
    return <div className="error-message">Error: No level data available</div>;
  }

  // Timer effect for urgency
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        setThreatLevel(prev => Math.min(100, prev + 5));
      }, 1000);
    } else if (timeRemaining === 0) {
      // Auto-fail if timer runs out
      handleAction(level.wrong_action || "Timeout");
    }
    return () => clearTimeout(timer);
  }, [timerActive, timeRemaining]);

  const startTimer = () => {
    setTimerActive(true);
    setThreatLevel(30);
  };

  const handlePhaseAction = (action, phaseData = {}) => {
    setResponses({ ...responses, [phase]: { action, ...phaseData } });
    
    // Increase threat level based on actions
    if (action === level.wrong_action) {
      setThreatLevel(prev => Math.min(100, prev + 25));
    } else if (action === level.correct_action) {
      setThreatLevel(prev => Math.max(0, prev - 10));
    }

    if (phase < 4) {
      setPhase(phase + 1);
      if (phase === 1) startTimer();
    } else {
      // Final phase - submit all responses
      const finalScore = calculateFinalScore();
      handleAction(level.correct_action || "Report & Isolate", { 
        phases: responses,
        finalAction: action,
        threatLevel: threatLevel,
        score: finalScore,
        completed: true
      });
    }
  };

  const calculateFinalScore = () => {
    let score = 100 - threatLevel;
    Object.values(responses).forEach(r => {
      if (r.action === level.correct_action) score += 10;
      if (r.action === level.wrong_action) score -= 20;
    });
    return Math.max(0, Math.min(100, score));
  };

  const toggleEvidence = (evidenceId) => {
    setShowEvidence(prev => ({ ...prev, [evidenceId]: !prev[evidenceId] }));
  };

  return (
    <BaseLevel 
      levelType="multiphase" 
      scenario={scenario} 
      onAction={onAction} 
      locked={locked}
    >
      {({ level, onAction: handleAction, locked: isLocked }) => (
        <div className="multiphase-container">
          {/* Header with Threat Level */}
          <div className="multiphase-header">
            <div className="threat-indicator">
              <div className="threat-label">THREAT LEVEL</div>
              <div className="threat-bar">
                <div 
                  className={`threat-fill ${threatLevel > 70 ? 'critical' : threatLevel > 40 ? 'high' : 'medium'}`}
                  style={{ width: `${threatLevel}%` }}
                />
              </div>
              <span className="threat-value">{threatLevel}%</span>
            </div>
            
            {timerActive && (
              <div className="timer-container">
                <div className="timer-icon">⏱️</div>
                <div className="timer-value">{timeRemaining}s</div>
                <div className="timer-bar">
                  <div 
                    className="timer-fill"
                    style={{ width: `${(timeRemaining / 30) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Phase Timeline */}
          <div className="phase-timeline">
            {[1, 2, 3, 4].map(p => (
              <div key={p} className="phase-marker">
                <div 
                  className={`phase-dot ${phase >= p ? 'active' : ''} ${
                    responses[p]?.action === level.correct_action ? 'correct' : 
                    responses[p]?.action === level.wrong_action ? 'wrong' : ''
                  }`}
                >
                  {p}
                </div>
                <div className="phase-label">Phase {p}</div>
                {responses[p] && (
                  <div className="phase-status">
                    {responses[p].action === level.correct_action ? '✓' : '⚠️'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="multiphase-content">
            <h2 className="phase-title">Phase {phase}: {
              phase === 1 ? "Initial Contact" :
              phase === 2 ? "Credential Harvesting" :
              phase === 3 ? "Malware Delivery" :
              "Data Exfiltration"
            }</h2>

            {/* Phase 1: Initial Phishing Email */}
            {phase === 1 && (
              <div className="phase-card email-phase">
                <div className="email-preview">
                  <div className="email-header">
                    <div className="email-from">
                      <strong>From:</strong> {level.from_address}
                    </div>
                    <div className="email-subject">
                      <strong>Subject:</strong> {level.title}
                    </div>
                  </div>
                  <div className="email-body">
                    {level.body_html ? (
                      <div dangerouslySetInnerHTML={{ __html: level.body_html }} />
                    ) : (
                      <p>{level.body_text || level.content}</p>
                    )}
                  </div>
                </div>

                <div className="evidence-box">
                  <h4 onClick={() => toggleEvidence('email')} className="evidence-toggle">
                    {showEvidence.email ? '▼' : '▶'} Suspicious Indicators
                  </h4>
                  {showEvidence.email && (
                    <ul className="evidence-list">
                      <li>⚠️ Sender domain doesn't match legitimate company</li>
                      <li>⚠️ Urgent language creates false urgency</li>
                      <li>⚠️ Suspicious link: {level.links?.[0]}</li>
                      {level.has_attachment && <li>⚠️ Unexpected attachment: {level.attachments?.[0]?.name}</li>}
                    </ul>
                  )}
                </div>

                <div className="phase-actions">
                  <button
                    className="phase-btn wrong"
                    disabled={isLocked}
                    onClick={() => handlePhaseAction(level.wrong_action, { 
                      clicked: true,
                      phase: 1 
                    })}
                  >
                    ⚠️ {level.wrong_action || "Click Link"}
                  </button>
                  <button
                    className="phase-btn neutral"
                    disabled={isLocked}
                    onClick={() => handlePhaseAction(level.neutral_action, { 
                      analyzed: true,
                     
