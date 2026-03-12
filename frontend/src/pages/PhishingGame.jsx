import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
import './PhishingGame.css';
import api from '../services/api';
import { useProgress } from '../context/ProgressContext';

// Store timeouts outside component to prevent cleanup on re-render
const activeTimeouts = new Set();

export default function PhishingGame() {
  const navigate = useNavigate();
  const { recordAction, completeLevel, setSessionTimeTaken } = useProgress();
  const gameStartTime = useRef(Date.now());
  
  // Use a ref that persists across renders but doesn't trigger cleanup
  const timeoutsRef = useRef(activeTimeouts);

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

  // Current level key
  const currentLevelKey = sortedLevelKeys[currentLevelIndex] || '';
  const isLastLevel = currentLevelIndex >= sortedLevelKeys.length - 1;
  const totalScenarios = sortedLevelKeys.reduce(
    (sum, key) => sum + (levels[key]?.length || 0),
    0
  );

  const completedScenarios = sortedLevelKeys.reduce((sum, key, idx) => {
    const levelCount = levels[key]?.length || 0;
    if (idx < currentLevelIndex) return sum + levelCount;
    if (idx === currentLevelIndex) return sum + currentScenarioIndex;
    return sum;
  }, 0);
  const overallScenarioIndex = Math.min(completedScenarios + 1, totalScenarios);

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

      const keys = Object.keys(grouped).sort((a, b) => {
        const aNum = Number(a.replace(/^\D+/, ''));
        const bNum = Number(b.replace(/^\D+/, ''));
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) return aNum - bNum;
        return a.localeCompare(b);
      });
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

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();
  };

  // Handle user action
  const handleAction = async (action) => {
    console.log('🎮 HANDLE ACTION STARTED');
    
    if (locked || !scenarios[currentScenarioIndex]) {
      console.log('🚫 Blocked - locked or no scenario');
      return;
    }
    
    // Clear any pending timeouts before starting new one
    clearAllTimeouts();
    setLocked(true);

    const currentScenario = scenarios[currentScenarioIndex];
    const startTime = sessionStorage.getItem('scenario_start');
    const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;

    console.log('📊 Current state:', {
      index: currentScenarioIndex,
      totalInLevel: scenarios.length,
      isLastLevel,
      level: currentLevelKey
    });

    const mlResults = await getMLPrediction(
      currentScenario.body_text || currentScenario.content,
      currentScenario.links
    );

    const isCorrect = action === currentScenario.correct_action;
    console.log('✅ isCorrect:', isCorrect);

    if (isCorrect) {
      setScore(prev => prev + 100);
      setTotalCorrect(prev => prev + 1);
    }
    setTotalActions(prev => prev + 1);

    recordAction(currentLevelKey, {
      scenario_id: currentScenario.scenario_id,
      action,
      isCorrect,
      level: currentLevelKey,
      timeTaken,
    });

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

    // Store current values
    const currentIdx = currentScenarioIndex;
    const totalInLevel = scenarios.length;
    const isLastLevelNow = isLastLevel;
    const currentLevel = currentLevelKey;
    const totalTime = Date.now() - gameStartTime.current;

    console.log('⏱️ Setting timeout for 3 seconds');

    // Auto-advance timeout
    const feedbackTimeout = setTimeout(() => {
      console.log('⏱️⏱️ TIMEOUT EXECUTED at', new Date().toLocaleTimeString());
      console.log('Values:', { currentIdx, totalInLevel, isLastLevelNow });
      
      setFeedback(null);
      setLocked(false);

      if (currentIdx < totalInLevel - 1) {
        console.log('➡️ Moving to next scenario');
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        console.log('🏁 Completing level');
        completeLevel(currentLevel);

        if (!isLastLevelNow) {
          console.log('➡️ Moving to next level');
          setShowLevelTransition(true);
          const transitionTimeout = setTimeout(() => {
            console.log('   Transition complete - loading next level');
            setShowLevelTransition(false);
            setCurrentLevelIndex(prev => prev + 1);
          }, 2500);
          timeoutsRef.current.add(transitionTimeout);
        } else {
          console.log('🏁 Game complete - navigating to thank you');
          const minutes = Math.floor(totalTime / 1000 / 60);
          const seconds = Math.floor((totalTime / 1000) % 60);
          setSessionTimeTaken(`${minutes}m ${seconds}s`);
          setGameComplete(true);

          const navigateTimeout = setTimeout(() => {
            console.log('   Navigating to /thankyou');
            navigate('/thankyou');
          }, 3000);
          timeoutsRef.current.add(navigateTimeout);
        }
      }
    }, 3000);
    
    timeoutsRef.current.add(feedbackTimeout);
    console.log('⏱️ Timeout added. Total timeouts:', timeoutsRef.current.size);
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

  // RENDER STATES
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
          <div className="overall-progress">
            <div className="progress-text">
              {totalScenarios > 0 ? `${overallScenarioIndex}/${totalScenarios} total` : '0/0 total'}
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: totalScenarios > 0
                    ? `${(overallScenarioIndex / totalScenarios) * 100}%`
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

      <TemplateRenderer
        scenario={currentScenario}
        onAction={handleAction}
        locked={locked}
      />

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
