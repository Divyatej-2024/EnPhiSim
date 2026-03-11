// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
import './PhishingGame.css';
import api from '../services/api';
import { useProgress } from '../context/ProgressContext';

export default function PhishingGame() {
  const navigate = useNavigate();
  const { recordAction, completeLevel, setSessionTimeTaken } = useProgress();
  const gameStartTime = useRef(Date.now());

  const [levels, setLevels] = useState({});
  const [sortedLevelKeys, setSortedLevelKeys] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalActions, setTotalActions] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || generateSessionId();
  });

  // Current level key (e.g. 'l1', 'l2', 'l3')
  const currentLevelKey = sortedLevelKeys[currentLevelIndex] || '';
  const isLastLevel = currentLevelIndex >= sortedLevelKeys.length - 1;
  const totalScenarios = Object.values(levels).reduce((sum, arr) => sum + arr.length, 0);

  // Count how many scenarios have been completed across all levels
  const completedScenarios = Object.values(levels).reduce((sum, arr, idx) => {
    if (idx < currentLevelIndex) return sum + arr.length;
    if (idx === currentLevelIndex) return sum + currentScenarioIndex;
    return sum;
  }, 0);

  // CONSENT PROTECTION
  useEffect(() => {
    const consent = localStorage.getItem("consentGiven");
    if (!consent) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadScenarios();
  }, [sessionId]);

  // When level changes, load its scenarios
  useEffect(() => {
    if (sortedLevelKeys.length > 0 && levels[currentLevelKey]) {
      setScenarios(levels[currentLevelKey]);
      setCurrentScenarioIndex(0);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    }
  }, [currentLevelIndex, sortedLevelKeys, levels, currentLevelKey]);

  function generateSessionId() {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    const id = Array.from(array, dec => dec.toString(16)).join('');
    localStorage.setItem('sessionId', id);
    return id;
  }

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const allScenarios = await api.getLevels();

      if (!Array.isArray(allScenarios)) {
        throw new Error("Invalid levels format");
      }

      const grouped = allScenarios.reduce((acc, scenario) => {
        const level = scenario.level_no || 'l1';
        if (!acc[level]) acc[level] = [];
        acc[level].push(scenario);
        return acc;
      }, {});

      const keys = Object.keys(grouped).sort();
      setLevels(grouped);
      setSortedLevelKeys(keys);
      setScenarios(grouped[keys[0]] || []);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      setLevels({});
    } finally {
      setLoading(false);
    }
  };

  // ML Prediction
  const getMLPrediction = async (emailText, links) => {
    try {
      const response = await api.getPrediction({
        text: emailText,
        links: links || [],
      });
      return response;
    } catch (error) {
      return {
        distilbert: { prediction: 'unknown', confidence: 0 },
        cnn: { prediction: 'unknown', confidence: 0 }
      };
    }
  };

  // Handle user action
  const handleAction = async (action) => {
    if (locked || !scenarios[currentScenarioIndex]) return;
    setLocked(true);

    const currentScenario = scenarios[currentScenarioIndex];
    const startTime = sessionStorage.getItem('scenario_start');
    const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;

    const mlResults = await getMLPrediction(
      currentScenario.body_text || currentScenario.content,
      currentScenario.links
    );

    const isCorrect = action === currentScenario.correct_action;

    if (isCorrect) {
      setScore(prev => prev + 100);
      setTotalCorrect(prev => prev + 1);
    }
    setTotalActions(prev => prev + 1);

    // Record in ProgressContext (used by Thank You page)
    recordAction(currentLevelKey, {
      scenario_id: currentScenario.scenario_id,
      action,
      isCorrect,
      level: currentLevelKey,
      timeTaken,
    });

    // Save to backend
    try {
      await api.saveAction({
        scenario_id: currentScenario.scenario_id,
        user_action: action,
        time_taken_seconds: timeTaken,
        session_id: sessionId,
        level: currentLevelKey,
        is_correct: isCorrect
      });
    } catch (error) {
      console.error('Failed to save action:', error);
    }

    // Show feedback
    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      mlResults,
      explanation: getExplanation(action, isCorrect)
    });

    // Auto-advance
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      if (currentScenarioIndex < scenarios.length - 1) {
        // Next scenario in same level
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        // Level complete — mark it
        completeLevel(currentLevelKey);

        if (!isLastLevel) {
          // Show level transition, then move to next level
          setShowLevelTransition(true);
          setTimeout(() => {
            setShowLevelTransition(false);
            setCurrentLevelIndex(prev => prev + 1);
          }, 2500);
        } else {
          // ALL levels done — go to Thank You
          const totalTime = Math.round((Date.now() - gameStartTime.current) / 1000);
          const minutes = Math.floor(totalTime / 60);
          const seconds = totalTime % 60;
          setSessionTimeTaken(`${minutes}m ${seconds}s`);
          setGameComplete(true);

          // Brief delay then navigate
          setTimeout(() => {
            navigate('/thankyou');
          }, 3000);
        }
      }
    }, 3000);
  };

  const getExplanation = (action, isCorrect) => {
    if (isCorrect) {
      return "Correct! " + (action === 'Report Phish'
        ? "Reporting helps protect everyone."
        : "Good judgment!");
    } else {
      return "Incorrect. " + (action === 'Trust & Click'
        ? "Never click suspicious links."
        : "This should be reported.");
    }
  };

  // ── RENDER STATES ──

  if (loading) {
    return <div className="loading-screen">Loading Training Scenarios...</div>;
  }

  if (!scenarios.length) {
    return (
      <div className="error-screen">
        <h2>No Scenarios Available</h2>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  // Game complete — waiting to navigate
  if (gameComplete) {
    return (
      <div className="game-complete-overlay">
        <div className="game-complete-content">
          <div className="complete-icon" aria-hidden="true">
            <span className="complete-icon-core" />
            <span className="complete-icon-wave" />
          </div>
          <h2>Simulation Complete!</h2>
          <p>You scored <strong>{score}</strong> points across <strong>{sortedLevelKeys.length}</strong> levels</p>
          <p className="accuracy-stat">
            Accuracy: {totalActions > 0 ? ((totalCorrect / totalActions) * 100).toFixed(1) : 0}%
          </p>
          <p className="redirect-hint">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  // Level transition overlay
  if (showLevelTransition) {
    const nextKey = sortedLevelKeys[currentLevelIndex + 1] || '';
    return (
      <div className="level-transition-overlay">
        <div className="transition-content">
          <div className="transition-check" aria-hidden="true">
            <span className="transition-check-core" />
            <span className="transition-check-ring" />
          </div>
          <h2>Level {currentLevelKey.toUpperCase()} Complete!</h2>
          <p>Score so far: {score} points</p>
          <div className="transition-next">
            <span>Next up:</span>
            <strong>Level {nextKey.toUpperCase()}</strong>
          </div>
          <div className="transition-loader"></div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">Level {currentLevelKey.toUpperCase()}</span>
          <span className="scenario-progress">
            {currentScenarioIndex + 1}/{scenarios.length}
          </span>
        </div>

        <div className="header-controls">
          {/* Overall progress bar */}
          <div className="overall-progress">
            <div className="progress-text">
              {completedScenarios + currentScenarioIndex}/{totalScenarios} total
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: totalScenarios > 0
                    ? `${((completedScenarios + currentScenarioIndex) / totalScenarios) * 100}%`
                    : '0%'
                }}
              ></div>
            </div>
          </div>

          <div className="score-display">
            <span className="score-label">Score</span>
            <span className="score-value">{score}</span>
          </div>

          <button onClick={() => navigate('/dashboard')} className="dashboard-button">
            Dashboard
          </button>
        </div>
      </div>

      {/* Template-based Level Renderer */}
      <TemplateRenderer
        scenario={currentScenario}
        onAction={handleAction}
        locked={locked}
      />

      {/* Feedback Overlay with ML results */}
      {feedback?.show && (
        <div className={`feedback-overlay ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-content">
            <h2>{feedback.isCorrect ? 'CORRECT!' : 'INCORRECT'}</h2>

            <div className="feedback-details">
              <p><strong>You chose:</strong> {feedback.userAction}</p>
              <p><strong>Correct action:</strong> {feedback.correctAction}</p>
            </div>

            {feedback.mlResults && (
              <div className="ml-feedback">
                <h3>AI Analysis</h3>
                <div className="ml-models">
                  <div className="ml-model">
                    <span className="model-name">DistilBERT:</span>
                    <span className={`prediction ${feedback.mlResults.distilbert?.prediction}`}>
                      {feedback.mlResults.distilbert?.prediction}
                    </span>
                    <span className="confidence">
                      {feedback.mlResults.distilbert?.confidence ?
                        `${(feedback.mlResults.distilbert.confidence * 100).toFixed(0)}%` : ''}
                    </span>
                  </div>
                  <div className="ml-model">
                    <span className="model-name">CNN:</span>
                    <span className={`prediction ${feedback.mlResults.cnn?.prediction}`}>
                      {feedback.mlResults.cnn?.prediction}
                    </span>
                    <span className="confidence">
                      {feedback.mlResults.cnn?.confidence ?
                        `${(feedback.mlResults.cnn.confidence * 100).toFixed(0)}%` : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="explanation">{feedback.explanation}</p>
            <p className="next-hint">Next scenario in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}