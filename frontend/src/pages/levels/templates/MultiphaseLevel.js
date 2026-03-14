// frontend/src/pages/levels/templates/MultiphaseLevel.jsx
import React, { useState, useEffect } from "react";
import BaseLevel from "./BaseLevel";
import "./MultiphaseLevel.css";
import "./Template.css";

export default function MultiphaseLevel({ scenario, onAction, locked }) {
  const [phase, setPhase] = useState(1);
  const [responses, setResponses] = useState({});
  const [threatLevel, setThreatLevel] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [showEvidence, setShowEvidence] = useState({});



  // Timer effect - MUST be at top level, not conditional
  useEffect(() => {
    let timer;
    if (timerActive && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
        setThreatLevel(prev => Math.min(100, prev + 5));
      }, 1000);
    } else if (timeRemaining === 0 && timerActive) {
      // Auto-fail if timer runs out
      setTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [timerActive, timeRemaining]);
  if (!scenario) {
    console.error('MultiphaseLevel: No scenario provided');
    return <div className="error-message">Error: No level data available</div>;
  }
  const startTimer = () => {
    setTimerActive(true);
    setThreatLevel(30);
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
      {({ level, onAction: handleAction, locked: isLocked, now }) => {
        // ✅ ALL logic MUST be INSIDE this function
        
        const calculateFinalScore = () => {
          let score = 100 - threatLevel;
          Object.values(responses).forEach(r => {
            if (r.action === level.correct_action) score += 10;
            if (r.action === level.wrong_action) score -= 20;
          });
          return Math.max(0, Math.min(100, score));
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

        return (
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

              <div className="live-row">
                <span className="live-dot" aria-hidden="true" />
                <span>Live</span>
                <span className="live-time">
                  {(now || new Date()).toLocaleTimeString()}
                </span>
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
                        phase: 1 
                      })}
                    >
                      🔍 {level.neutral_action || "Inspect Email"}
                    </button>
                    <button
                      className="phase-btn correct"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction(level.correct_action, { 
                        reported: true,
                        phase: 1 
                      })}
                    >
                      🚨 {level.correct_action || "Report Phish"}
                    </button>
                  </div>
                </div>
              )}

              {/* Phase 2: Fake Login Page */}
              {phase === 2 && (
                <div className="phase-card credential-phase">
                  <div className="browser-window">
                    <div className="browser-bar">
                      <span className="browser-dot red"></span>
                      <span className="browser-dot yellow"></span>
                      <span className="browser-dot green"></span>
                      <span className="browser-url">{level.display_url || level.links?.[0]}</span>
                    </div>
                    <div className="login-page">
                      <h3>Secure Login Required</h3>
                      <div className="login-form">
                        <input type="text" placeholder="Username" className="login-input" disabled />
                        <input type="password" placeholder="Password" className="login-input" disabled />
                        <button className="login-btn" disabled>Sign In</button>
                      </div>
                      <div className="ssl-warning">⚠️ Connection is not secure</div>
                    </div>
                  </div>

                  <div className="evidence-box">
                    <h4 onClick={() => toggleEvidence('login')} className="evidence-toggle">
                      {showEvidence.login ? '▼' : '▶'} URL Analysis
                    </h4>
                    {showEvidence.login && (
                      <ul className="evidence-list">
                        <li>⚠️ Typosquatted domain: {level.display_url}</li>
                        <li>⚠️ No HTTPS encryption</li>
                        <li>⚠️ Fake security seal</li>
                      </ul>
                    )}
                  </div>

                  <div className="phase-actions">
                    <button
                      className="phase-btn wrong"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Enter Credentials", { 
                        entered: true,
                        phase: 2 
                      })}
                    >
                      ⚠️ Enter Login
                    </button>
                    <button
                      className="phase-btn neutral"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Check URL", { 
                        checked: true,
                        phase: 2 
                      })}
                    >
                      🔍 Inspect URL
                    </button>
                    <button
                      className="phase-btn correct"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Close Tab", { 
                        closed: true,
                        phase: 2 
                      })}
                    >
                      🚨 Close Tab
                    </button>
                  </div>
                </div>
              )}

              {/* Phase 3: Malware Download */}
              {phase === 3 && (
                <div className="phase-card malware-phase">
                  <div className="download-warning">
                    <div className="warning-icon">⚠️</div>
                    <h3>File Download Detected</h3>
                    <p>The website is trying to download a file</p>
                  </div>

                  <div className="file-info">
                    <div className="file-icon">📄</div>
                    <div className="file-details">
                      <div className="file-name">{level.attachments?.[0]?.name || "document.pdf"}</div>
                      <div className="file-size">{level.attachments?.[0]?.size || "2.4MB"}</div>
                      <div className="file-type">{level.attachments?.[0]?.type || "application/pdf"}</div>
                    </div>
                  </div>

                  <div className="evidence-box">
                    <h4 onClick={() => toggleEvidence('malware')} className="evidence-toggle">
                      {showEvidence.malware ? '▼' : '▶'} Malware Analysis
                    </h4>
                    {showEvidence.malware && (
                      <ul className="evidence-list">
                        <li>⚠️ Unsolicited download</li>
                        <li>⚠️ File contains macros</li>
                        <li>⚠️ Digitally unsigned</li>
                      </ul>
                    )}
                  </div>

                  <div className="phase-actions">
                    <button
                      className="phase-btn wrong"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Download File", { 
                        downloaded: true,
                        phase: 3 
                      })}
                    >
                      ⚠️ Download
                    </button>
                    <button
                      className="phase-btn neutral"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Scan File", { 
                        scanned: true,
                        phase: 3 
                      })}
                    >
                      🔍 Scan with AV
                    </button>
                    <button
                      className="phase-btn correct"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Block Download", { 
                        blocked: true,
                        phase: 3 
                      })}
                    >
                      🚨 Block Download
                    </button>
                  </div>
                </div>
              )}

              {/* Phase 4: Data Exfiltration */}
              {phase === 4 && (
                <div className="phase-card exfiltration-phase">
                  <div className="network-alert">
                    <div className="alert-glow"></div>
                    <h3>🚨 Unusual Outbound Traffic Detected</h3>
                    <p>Suspicious connection to external IP</p>
                  </div>

                  <div className="network-stats">
                    <div className="stat-item">
                      <span className="stat-label">Destination:</span>
                      <span className="stat-value">185.142.53.78</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Port:</span>
                      <span className="stat-value">4443</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Data Transfer:</span>
                      <span className="stat-value">2.4 MB/s</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Protocol:</span>
                      <span className="stat-value">HTTPS (suspicious)</span>
                    </div>
                  </div>

                  <div className="evidence-box urgent">
                    <h4 onClick={() => toggleEvidence('network')} className="evidence-toggle">
                      {showEvidence.network ? '▼' : '▶'} Immediate Threats
                    </h4>
                    {showEvidence.network && (
                      <ul className="evidence-list">
                        <li>🔴 Data exfiltration in progress</li>
                        <li>🔴 Credentials already compromised</li>
                        <li>🔴 Backdoor connection established</li>
                      </ul>
                    )}
                  </div>

                  <div className="phase-actions final">
                    <button
                      className="phase-btn wrong"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Ignore Alert", { 
                        ignored: true,
                        phase: 4 
                      })}
                    >
                      ⚠️ Ignore
                    </button>
                    <button
                      className="phase-btn neutral"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Monitor Traffic", { 
                        monitored: true,
                        phase: 4 
                      })}
                    >
                      🔍 Monitor
                    </button>
                    <button
                      className="phase-btn correct"
                      disabled={isLocked}
                      onClick={() => handlePhaseAction("Isolate System", { 
                        isolated: true,
                        phase: 4 
                      })}
                    >
                      🚨 Isolate Immediately
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Summary */}
            <div className="progress-summary">
              <h4>Attack Progress</h4>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="summary-label">Phases Complete:</span>
                  <span className="summary-value">{phase - 1}/4</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Threat Level:</span>
                  <span className="summary-value">{threatLevel}%</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Correct Choices:</span>
                  <span className="summary-value">
                    {Object.values(responses).filter(r => r.action === level.correct_action).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}
