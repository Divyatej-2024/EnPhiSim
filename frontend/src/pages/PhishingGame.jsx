// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from '../levels/TemplateRenderer';
import './PhishingGame.css';

const API_BASE = process.env.REACT_APP_API_URL || "https://enphisim-1.onrender.com";

export default function PhishingGame() {
  const navigate = useNavigate();

  const [levels, setLevels] = useState({});
  const [currentLevel, setCurrentLevel] = useState('l1');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);
  const [locked, setLocked] = useState(false);

  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || generateSessionId();
  });

  // 🔐 CONSENT PROTECTION
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

  useEffect(() => {
    if (levels[currentLevel]) {
      setScenarios(levels[currentLevel]);
      setCurrentScenarioIndex(0);
      setLevelComplete(false);
    }
  }, [currentLevel, levels]);

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
      const response = await axios.get(`${API_BASE}/api/levels`);
      const allScenarios = response.data;

      if (!Array.isArray(allScenarios)) {
        throw new Error("Invalid levels format");
      }

      const grouped = allScenarios.reduce((acc, scenario) => {
        const level = scenario.level_no || 'l1';
        if (!acc[level]) acc[level] = [];
        acc[level].push(scenario);
        return acc;
      }, {});

      setLevels(grouped);
      setScenarios(grouped['l1'] || []);

    } catch (error) {
      console.error('Failed to load scenarios:', error);
      setLevels({});
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, metadata = {}) => {
    if (locked || !scenarios[currentScenarioIndex]) return;
    setLocked(true);

    const currentScenario = scenarios[currentScenarioIndex];

    // Determine if correct (with fallback)
    const isCorrect = action === currentScenario.correct_action;

    if (isCorrect) {
      setScore(prev => prev + 100);
    }

    // Save to backend
    try {
      await axios.post(`${API_BASE}/api/action`, {
        scenario_id: currentScenario.scenario_id,
        user_action: action,
        time_taken_seconds: 0, // You can track this if needed
        session_id: sessionId,
        level: currentLevel,
        metadata: metadata,
        is_correct: isCorrect
      });
      console.log('✅ Action saved');
    } catch (error) {
      console.error('Failed to save action:', error);
    }

    // Show feedback
    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      explanation: getExplanation(action, isCorrect)
    });

    // Auto-advance or complete level
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
      } else {
        setLevelComplete(true);
      }
    }, 2000);
  };

  const getExplanation = (action, isCorrect) => {
    if (isCorrect) {
      return "✅ Correct! " + (action === 'Report Phish' 
        ? "Reporting helps protect everyone." 
        : "Good judgment!");
    } else {
      return "❌ Incorrect. " + (action === 'Trust & Click' 
        ? "Never click suspicious links." 
        : "This should be reported.");
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const resetLevel = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setLevelComplete(false);
  };

  if (loading) {
    return <div className="loading-screen">Loading Training Scenarios...</div>;
  }

  if (levelComplete) {
    return (
      <div className="level-complete">
        <h2>🎉 Level Complete!</h2>
        <p>You scored {score} points</p>
        <p>Completed {scenarios.length} scenarios</p>
        <div className="complete-actions">
          <button onClick={resetLevel}>🔄 Replay Level</button>
          <button onClick={goToDashboard}>📊 Dashboard</button>
        </div>
      </div>
    );
  }

  if (!scenarios.length) {
    return (
      <div className="error-screen">
        <h2>No Scenarios Available</h2>
        <button onClick={() => navigate('/')}>Back</button>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      {/* Game Header */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">Level {currentLevel.toUpperCase()}</span>
          <span className="scenario-progress">
            {currentScenarioIndex + 1}/{scenarios.length}
          </span>
        </div>

        <div className="header-controls">
          <div className="score-display">
            <span className="score-label">Score</span>
            <span className="score-value">{score}</span>
          </div>

          <button onClick={goToDashboard} className="dashboard-button">
            📊 Dashboard
          </button>

          <select 
            onChange={(e) => setCurrentLevel(e.target.value)} 
            value={currentLevel}
            className="level-select-header"
          >
            {Object.keys(levels).sort().map(level => (
              <option key={level} value={level}>
                Level {level.toUpperCase()} ({levels[level].length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Template-based Level Renderer */}
      <TemplateRenderer 
        scenario={currentScenario}
        onAction={handleAction}
        locked={locked}
      />

      {/* Feedback Overlay (optional - templates may have their own) */}
      {feedback?.show && (
        <div className={`feedback-overlay ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-content">
            <h2>{feedback.isCorrect ? '✅ CORRECT!' : '❌ INCORRECT'}</h2>
            <p>{feedback.explanation}</p>
            <p className="next-hint">Next scenario in 2 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}