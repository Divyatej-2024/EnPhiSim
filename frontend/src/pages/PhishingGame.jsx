// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
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

  // ADDED: ML Prediction function
  const getMLPrediction = async (emailText, links) => {
    try {
      const response = await axios.post(`${API_BASE}/api/predict`, {
        text: emailText,
        links: links || []
      });
      return response.data;
    } catch (error) {
      console.error('ML prediction failed:', error);
      // Fallback so game continues
      return {
        distilbert: { prediction: 'unknown', confidence: 0 },
        cnn: { prediction: 'unknown', confidence: 0 }
      };
    }
  };

  //  FIXED: handleAction with proper error handling and removed undefined metadata
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
    }

    // Save to backend - FIXED: removed undefined metadata
    try {
      await axios.post(`${API_BASE}/api/action`, {
        scenario_id: currentScenario.scenario_id,
        user_action: action,
        time_taken_seconds: timeTaken,
        session_id: sessionId,
        level: currentLevel,
        is_correct: isCorrect
      });
      console.log('Action saved to database');
    } catch (error) {
      console.error(' Failed to save action:', error);
    }

    // Show feedback
    console.log('Showing feedback dialog for:', action);
    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      mlResults,
      explanation: getExplanation(action, isCorrect)
    });

    // Auto-advance or complete level
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        setLevelComplete(true);
      }
    }, 3000);
  };

  const getExplanation = (action, isCorrect) => {
    if (isCorrect) {
      return " Correct! " + (action === 'Report Phish' 
        ? "Reporting helps protect everyone." 
        : "Good judgment!");
    } else {
      return "Incorrect. " + (action === 'Trust & Click' 
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
        <h2> Level Complete!</h2>
        <p>You scored {score} points</p>
        <p>Completed {scenarios.length} scenarios</p>
        <div className="complete-actions">
          <button onClick={resetLevel}> Replay Level</button>
          <button onClick={goToDashboard}> Dashboard</button>
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
            Dashboard
          </button>

          {/* About button added for better navigation */}
          <button onClick={() => navigate('/about')} className="about-button">
            About
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

      {/* ENHANCED: Feedback Overlay with ML results */}
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
