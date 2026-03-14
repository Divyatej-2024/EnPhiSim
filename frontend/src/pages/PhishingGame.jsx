import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
import './PhishingGame.css';
import api from '../services/api';
import { useProgress } from '../context/ProgressContext';

// Store timeouts OUTSIDE component to prevent cleanup on re-render
const activeTimeouts = new Set();

export default function PhishingGame() {
  const navigate = useNavigate();
  const { recordAction, completeLevel, setSessionTimeTaken } = useProgress();
  const gameStartTime = useRef(Date.now());
  
  // Reference to the external Set - this persists across renders
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

  // Save progress whenever level or scenario changes
useEffect(() => {
  if (sessionId && sortedLevelKeys.length > 0 && !loading) {
    const progress = {
      levelIndex: currentLevelIndex,
      scenarioIndex: currentScenarioIndex,
      timestamp: Date.now()
    };
    localStorage.setItem(`gameProgress_${sessionId}`, JSON.stringify(progress));
    console.log('💾 Progress saved:', progress);
  }
}, [currentLevelIndex, currentScenarioIndex, sessionId, sortedLevelKeys.length, loading]);

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
 
  const savedProgress = localStorage.getItem(`gameProgress_${sessionId}`);
    console.log('📂 Checking for saved progress:', savedProgress);
    
    if (savedProgress) {
      try {
        const { levelIndex, scenarioIndex } = JSON.parse(savedProgress);
        console.log('📂 Found saved progress:', { levelIndex, scenarioIndex, keys });
        
        // Validate indices
        if (levelIndex !== undefined && levelIndex >= 0 && levelIndex < keys.length) {
          console.log(`➡️ Loading level ${keys[levelIndex]} (index ${levelIndex})`);
          setCurrentLevelIndex(levelIndex);
          setCurrentScenarioIndex(scenarioIndex || 0);
          setScenarios(grouped[keys[levelIndex]] || []);
        } else {
          console.log('⚠️ Invalid saved progress, starting at level 1');
          setCurrentLevelIndex(0);
          setCurrentScenarioIndex(0);
          setScenarios(grouped[keys[0]] || []);
        }
      } catch (e) {
        console.error('❌ Failed to parse saved progress:', e);
        setCurrentLevelIndex(0);
        setCurrentScenarioIndex(0);
        setScenarios(grouped[keys[0]] || []);
      }
    } else {
      // No saved progress, start at beginning
      console.log('🆕 No saved progress found, starting at level 1');
      setCurrentLevelIndex(0);
      setCurrentScenarioIndex(0);
      setScenarios(grouped[keys[0]] || []);
    }
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
      console.log('mlprediction recieved:', response);

      const formattedResponse = {
               distilbert: { 
                 prediction: response.prediction || 'unknown',
                 confidence: response.confidence || 0
               },
        cnn: { 
          prediction: response.prediction || 'unknown',
          confidence: response.confiidence ? response.confidence * 0.95 :0.5
        }
      };
      return formattedResponse;
    } catch (error) {
      console.log('ml prediction failed:', error);
      return {
        distilbert: { prediction: 'Unknown', confidence: 0 },
        cnn: { prediction: 'Unknown', confidence: 0}
      };
    }
  };
// Normalize both strings for comparison
const normalizeString = (str) => {
  return String(str || '')
    .trim()                    // Remove leading/trailing spaces
    .toLowerCase()             // Case insensitive
    .replace(/\s+/g, ' ')      // Normalize multiple spaces to single
    .replace(/[^\w\s]/g, '');  // Remove punctuation
};

const normalizedActual = normalizeString(actualAction);
const normalizedCorrect = normalizeString(correctAction);
const isCorrect = normalizedActual === normalizedCorrect;

console.log('✅ CORRECTNESS CHECK:', {
  original: { actual: actualAction, correct: correctAction },
  normalized: { actual: normalizedActual, correct: normalizedCorrect },
  isCorrect,
  scenario_id: currentScenario.scenario_id
});
  // Clear all timeouts (call manually when needed)
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current.clear();
  };

 // Handle user action
const handleAction = async (action, meta = {}) => {
  console.log('🎯🎯🎯 PHISHING GAME HANDLEACTION STARTED at', new Date().toLocaleTimeString());
  console.log('   Raw action from button:', action);
  console.log('   Metadata:', meta);
  console.log('   Current level key:', currentLevelKey);
  console.log('   Current scenario index:', currentScenarioIndex);
  console.log('   Scenarios length:', scenarios.length);
  console.log('   Locked:', locked);
  console.log('   Has scenario:', !!scenarios[currentScenarioIndex]);
  console.log('🔍 EXACT STRING COMPARISON:');
console.log('   actualAction    :', JSON.stringify(actualAction));
console.log('   correctAction   :', JSON.stringify(correctAction));
console.log('   actual length   :', actualAction.length);
console.log('   correct length  :', correctAction.length);
console.log('   char codes      :', 
  'actual:', [...actualAction].map(c => c.charCodeAt(0)),
  'correct:', [...correctAction].map(c => c.charCodeAt(0))
);
  if (locked || !scenarios[currentScenarioIndex]) return;
  
  clearAllTimeouts();
  setLocked(true);

  const currentScenario = scenarios[currentScenarioIndex];
  const startTime = sessionStorage.getItem('scenario_start');
  const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;

  // Get the actual action value from metadata if available
  let actualAction = action;
  
  // If metadata contains the mapped action, use that instead
  if (meta.action_taken) {
    actualAction = meta.action_taken;
  } else if (meta.actionValue) {
    actualAction = meta.actionValue;
  }
  
  console.log('   Actual action being evaluated:', actualAction);

  const mlResults = await getMLPrediction(
    currentScenario.body_text || currentScenario.content,
    currentScenario.links
  );

  // 🔴 FIXED: Use the actual action value, not the button identifier
  const correctAction = currentScenario.correct_action || 'Report Phish';
  const isCorrect = actualAction === correctAction;
  
  console.log('✅ CORRECTNESS CHECK:', {
    actualAction,
    correctAction,
    isCorrect,
    scenario_id: currentScenario.scenario_id,
    fromMeta: !!meta.action_taken
  });

  if (isCorrect) {
    setScore(prev => prev + 100);
    setTotalCorrect(prev => prev + 1);
  }
  setTotalActions(prev => prev + 1);

  recordAction(currentLevelKey, {
    scenario_id: currentScenario.scenario_id,
    action: actualAction,
    isCorrect,
    level: currentLevelKey,
    timeTaken,
  });

  try {
    await api.saveAction({
      scenario_id: currentScenario.scenario_id,
      user_action: actualAction,
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
    userAction: actualAction,
    correctAction: correctAction,
    mlResults,
    explanation: getExplanation(actualAction, isCorrect)
  });
  
  console.log('📊 mlResults structure:', {
    hasDistilbert: !!mlResults?.distilbert,
    hasCnn: !!mlResults?.cnn,
    distilbertPrediction: mlResults?.distilbert?.prediction,
    cnnPrediction: mlResults?.cnn?.prediction
  });
  console.log('Feedback set with mlresults:', mlResults);

  // Store current values
  const currentIdx = currentScenarioIndex;
  const totalInLevel = scenarios.length;
  const isLastLevelNow = isLastLevel;
  const currentLevel = currentLevelKey;
  const totalTime = Date.now() - gameStartTime.current;

  // Auto-advance timeout
  const feedbackTimeout = setTimeout(() => {
    setFeedback(null);
    setLocked(false);

    if (currentIdx < totalInLevel - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    } else {
      completeLevel(currentLevel);

      if (!isLastLevelNow) {
        setShowLevelTransition(true);
        const transitionTimeout = setTimeout(() => {
          setShowLevelTransition(false);
          setCurrentLevelIndex(prev => prev + 1);
        }, 2500);
        timeoutsRef.current.add(transitionTimeout);
      } else {
        const minutes = Math.floor(totalTime / 1000 / 60);
        const seconds = Math.floor((totalTime / 1000) % 60);
        setSessionTimeTaken(`${minutes}m ${seconds}s`);
        setGameComplete(true);

        const navigateTimeout = setTimeout(() => {
          navigate('/thankyou');
        }, 3000);
        timeoutsRef.current.add(navigateTimeout);
      }
    }
  }, 3000);
  
  timeoutsRef.current.add(feedbackTimeout);
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
