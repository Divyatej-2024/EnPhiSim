import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
import './PhishingGame.css';
import api from '../services/api';
import { useProgress } from '../context/ProgressContext';

// Store timeouts OUTSIDE component
const activeTimeouts = new Set();

export default function PhishingGame() {
  console.log('🔥 PHISHING GAME LOADED at', new Date().toLocaleTimeString());
  
  const navigate = useNavigate();
  const { recordAction, completeLevel, setSessionTimeTaken } = useProgress();
  const gameStartTime = useRef(Date.now());
  const timeoutsRef = useRef(activeTimeouts);
  const actionInProgress = useRef(false);

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

  const currentLevelKey = sortedLevelKeys[currentLevelIndex] || '';
  const isLastLevel = currentLevelIndex >= sortedLevelKeys.length - 1;

  // Check consent
  useEffect(() => {
    const consent = localStorage.getItem('consentGiven');
    if (!consent) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadScenarios();
  }, [sessionId]);

  useEffect(() => {
    if (sortedLevelKeys.length > 0 && levels[currentLevelKey]) {
      console.log('📊 Loading level:', currentLevelKey, 'with', levels[currentLevelKey].length, 'scenarios');
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
      console.log('📥 Loading scenarios...');
      const allScenarios = await api.getLevels();
      console.log('✅ Loaded', allScenarios.length, 'scenarios');

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
      console.log('📊 Levels loaded:', keys.length, 'levels');
      
    } catch (error) {
      console.error('❌ Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMLPrediction = async (emailText, links) => {
    try {
      return await api.getPrediction({
        text: emailText,
        links: links || [],
      });
    } catch (error) {
      console.log('⚠️ ML prediction failed, using fallback');
      return {
        distilbert: { prediction: 'unknown', confidence: 0 },
        cnn: { prediction: 'unknown', confidence: 0 }
      };
    }
  };

  const handleAction = async (action) => {
    if (actionInProgress.current || locked || !scenarios[currentScenarioIndex]) {
      console.log('🚫 Action blocked:', { actionInProgress: actionInProgress.current, locked, hasScenario: !!scenarios[currentScenarioIndex] });
      return;
    }
    
    actionInProgress.current = true;
    console.log('\n🎯 ACTION TRIGGERED at', new Date().toLocaleTimeString());
    console.log('   Action:', action);
    console.log('   Level:', currentLevelKey);
    console.log('   Scenario:', currentScenarioIndex + 1, 'of', scenarios.length);
    
    setLocked(true);

    const currentScenario = scenarios[currentScenarioIndex];
    const startTime = sessionStorage.getItem('scenario_start');
    const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;

    const mlResults = await getMLPrediction(
      currentScenario.body_text || currentScenario.content,
      currentScenario.links
    );

    const isCorrect = action === currentScenario.correct_action;
    console.log('   Correct?', isCorrect, '(Expected:', currentScenario.correct_action, ')');

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
      console.error('❌ Failed to save action:', error);
    }

    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      mlResults,
      explanation: getExplanation(action, isCorrect)
    });

    // Capture current values for timeout
    const currentIdx = currentScenarioIndex;
    const totalInLevel = scenarios.length;
    const isLastLevelNow = isLastLevel;
    const currentLevel = currentLevelKey;
    const totalTime = Date.now() - gameStartTime.current;

    console.log(`⏱️ Setting ${3000}ms timeout for next action`);
    console.log(`   Will execute at:`, new Date(Date.now() + 3000).toLocaleTimeString());

    const feedbackTimeout = setTimeout(() => {
      console.log('\n⏱️⏱️ TIMEOUT EXECUTED at', new Date().toLocaleTimeString());
      console.log('   Current index:', currentIdx, 'Total in level:', totalInLevel);
      
      setFeedback(null);
      setLocked(false);
      actionInProgress.current = false;

      if (currentIdx < totalInLevel - 1) {
        console.log(`➡️ Moving to next scenario: ${currentIdx + 1} → ${currentIdx + 2}`);
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        console.log(`🏁 Completing level ${currentLevel}`);
        completeLevel(currentLevel);

        if (!isLastLevelNow) {
          console.log(`➡️ Moving to next level: ${currentLevel} → ${sortedLevelKeys[currentLevelIndex + 1]}`);
          setShowLevelTransition(true);
          setTimeout(() => {
            console.log('   Transition complete, loading next level');
            setShowLevelTransition(false);
            setCurrentLevelIndex(prev => prev + 1);
          }, 2500);
        } else {
          console.log('🎮 GAME COMPLETE!');
          const minutes = Math.floor(totalTime / 1000 / 60);
          const seconds = Math.floor((totalTime / 1000) % 60);
          setSessionTimeTaken(`${minutes}m ${seconds}s`);
          setGameComplete(true);

          setTimeout(() => {
            console.log('   Navigating to /thankyou');
            navigate('/thankyou');
          }, 3000);
        }
      }
    }, 3000);
    
    timeoutsRef.current.add(feedbackTimeout);
  };

  const getExplanation = (action, isCorrect) => {
    if (isCorrect) {
      return "Correct! " + (action === 'Report Phish' ? "Reporting helps protect everyone." : "Good judgment!");
    } else {
      return "Incorrect. " + (action === 'Trust & Click' ? "Never click suspicious links." : "This should be reported.");
    }
  };

  // Render states
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
          <h2>Simulation Complete!</h2>
          <p>You scored <strong>{score}</strong> points</p>
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
          <h2>Level {currentLevelKey.toUpperCase()} Complete!</h2>
          <p>Score so far: {score} points</p>
          <div className="transition-next">
            <span>Next up:</span>
            <strong>Level {nextKey.toUpperCase()}</strong>
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">Level {currentLevelKey.toUpperCase()}</span>
          <span className="scenario-progress">
            {currentScenarioIndex + 1}/{scenarios.length}
          </span>
        </div>
        <div className="score-display">
          <span className="score-value">{score}</span>
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
            <p className="next-hint">Next in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}
