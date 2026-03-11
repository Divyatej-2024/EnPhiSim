// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
import LevelComplete from './levels/LevelComplete';
import './PhishingGame.css';
import api from '../services/api';
import { useProgress } from '../context/ProgressContext';

export default function PhishingGame() {
  const navigate = useNavigate();
  const { recordAction, completeLevel, setSessionTimeTaken } = useProgress();
  const gameStartTime = useRef(Date.now());

  // Game state
  const [levels, setLevels] = useState({});
  const [sortedLevelKeys, setSortedLevelKeys] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  
  // Stats
  const [score, setScore] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalActions, setTotalActions] = useState(0);
  const [levelScores, setLevelScores] = useState({});
  
  // UI state
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [showLevelTransition, setShowLevelTransition] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [levelStats, setLevelStats] = useState({
    correct: 0,
    total: 0,
    timeSpent: 0
  });

  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || generateSessionId();
  });

  // Current level key
  const currentLevelKey = sortedLevelKeys[currentLevelIndex] || '';
  const isLastLevel = currentLevelIndex >= sortedLevelKeys.length - 1;
  const totalScenarios = Object.values(levels).reduce((sum, arr) => sum + arr.length, 0);

  // Progress calculation
  const completedScenarios = Object.values(levels).reduce((sum, arr, idx) => {
    if (idx < currentLevelIndex) return sum + arr.length;
    if (idx === currentLevelIndex) return sum + currentScenarioIndex;
    return sum;
  }, 0);

  const progressPercentage = totalScenarios > 0 
    ? ((completedScenarios + currentScenarioIndex) / totalScenarios) * 100 
    : 0;

  // Consent protection
  useEffect(() => {
    const consent = localStorage.getItem("consentGiven");
    if (!consent) {
      navigate("/");
    }
  }, [navigate]);

  // Initialize session
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadScenarios();
  }, [sessionId]);

  // Load scenarios when level changes
  useEffect(() => {
    if (sortedLevelKeys.length > 0 && levels[currentLevelKey]) {
      setScenarios(levels[currentLevelKey]);
      setCurrentScenarioIndex(0);
      sessionStorage.setItem('scenario_start', Date.now().toString());
      
      // Load saved progress for this level
      const savedProgress = JSON.parse(localStorage.getItem(`level_${currentLevelKey}_progress`) || 'null');
      if (savedProgress) {
        setLevelStats({
          correct: savedProgress.correct || 0,
          total: savedProgress.total || 0,
          timeSpent: savedProgress.timeSpent || 0
        });
      } else {
        setLevelStats({ correct: 0, total: 0, timeSpent: 0 });
      }
    }
  }, [currentLevelIndex, sortedLevelKeys, levels, currentLevelKey]);

  function generateSessionId() {
    const array = new Uint32Array(4);
    window.crypto.getRandomValues(array);
    const id = Array.from(array, dec => dec.toString(16)).join('');
    localStorage.setItem('sessionId', id);
    return id;
  }

  // Load scenarios from API
  const loadScenarios = async () => {
    try {
      setLoading(true);
      const allScenarios = await api.getLevels();

      if (!Array.isArray(allScenarios)) {
        throw new Error("Invalid levels format");
      }

      // Group by level
      const grouped = allScenarios.reduce((acc, scenario) => {
        const level = scenario.level_no || 'l1';
        if (!acc[level]) acc[level] = [];
        acc[level].push(scenario);
        return acc;
      }, {});

      // Sort levels naturally (l1, l2, l3... then b1, b2...)
      const keys = Object.keys(grouped).sort((a, b) => {
        const aNum = parseInt(a.replace(/\D/g, ''));
        const bNum = parseInt(b.replace(/\D/g, ''));
        const aPrefix = a.replace(/\d/g, '');
        const bPrefix = b.replace(/\d/g, '');
        
        if (aPrefix === bPrefix) return aNum - bNum;
        return aPrefix === 'l' ? -1 : 1;
      });

      setLevels(grouped);
      setSortedLevelKeys(keys);
      
      // Initialize level scores
      const initialScores = {};
      keys.forEach(key => {
        initialScores[key] = {
          total: grouped[key].length,
          completed: 0,
          correct: 0,
          score: 0
        };
      });
      setLevelScores(initialScores);
      
      setScenarios(grouped[keys[0]] || []);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    } catch (error) {
      console.error('Failed to load scenarios:', error);
      setLevels({});
    } finally {
      setLoading(false);
    }
  };

  // Get level configuration based on level key and scenarios
  const getLevelConfig = (levelKey) => {
    const levelScenarios = levels[levelKey] || [];
    if (levelScenarios.length === 0) return null;

    const firstScenario = levelScenarios[0];
    const isBonus = levelKey.startsWith('b') || firstScenario.category === 'bonus_analysis';
    
    // Map taxonomy to template
    const getTemplate = () => {
      if (firstScenario.template) return firstScenario.template;
      
      const templateMap = {
        'Credential Phishing': 'mail',
        'Financial Fraud': 'mail',
        'Messaging Attacks': 'message',
        'Executive Targeting': 'mail',
        'Social Engineering': 'mail',
        'Voice Phishing': 'mail',
        'QR Code Phishing': 'mail',
        'MITM Attack': 'browser',
        'Watering Hole': 'mail',
        'Credential Stuffing': 'mail',
        'Session Hijacking': 'browser',
        'Tech Support Fraud': 'mail',
        'Shipping Fraud': 'mail',
        'Government Fraud': 'mail',
        'Emergency Fraud': 'mail',
        'Crypto Fraud': 'mail',
        'Wi-Fi Phishing': 'browser',
        'DNS Poisoning': 'browser',
        'Clone Phishing': 'mail',
        'Scareware': 'browser',
        'Ransomware': 'analysis',
        'DDoS Attacks': 'analysis',
        'Trojan Horse': 'analysis',
        'Botnets': 'analysis'
      };
      
      return templateMap[firstScenario.taxonomy] || 'mail';
    };

    // Determine difficulty from scenario data
    const getDifficulty = () => {
      const diff = firstScenario.difficulty || 0.5;
      if (diff < 0.3) return 'easy';
      if (diff < 0.4) return 'advanced_easy';
      if (diff < 0.5) return 'medium';
      if (diff < 0.7) return 'hard';
      return 'expert';
    };

    // Time limit based on difficulty
    const getTimeLimit = () => {
      const difficulty = getDifficulty();
      const limits = {
        'easy': 60,
        'advanced_easy': 45,
        'medium': 30,
        'hard': 20,
        'expert': 15
      };
      return limits[difficulty] || 30;
    };

    // Colors based on difficulty
    const getColors = () => {
      const colors = {
        'easy': { primary: '#4caf50', secondary: '#45a049' },
        'advanced_easy': { primary: '#ff9800', secondary: '#f57c00' },
        'medium': { primary: '#f44336', secondary: '#d32f2f' },
        'hard': { primary: '#d32f2f', secondary: '#b71c1c' },
        'expert': { primary: '#b71c1c', secondary: '#8e0000' }
      };
      return colors[getDifficulty()] || { primary: '#667eea', secondary: '#764ba2' };
    };

    return {
      template: getTemplate(),
      timeLimit: getTimeLimit(),
      showHints: getDifficulty() === 'easy' || isBonus,
      feedbackDelay: 3000,
      mlEnabled: firstScenario.ml_prediction_distilbert !== null,
      difficulty: getDifficulty(),
      theme: getTemplate() === 'browser' ? 'browser' : 
             getTemplate() === 'message' ? 'mobile' : 
             isBonus ? 'educational' : 'professional',
      category: firstScenario.taxonomy || 'General',
      isBonus: isBonus,
      description: `${firstScenario.taxonomy || 'Phishing'} - Level ${levelKey.toUpperCase()}`,
      colors: getColors()
    };
  };

  // Get ML prediction (use DB data if available)
  const getMLPrediction = async (scenario) => {
    if (scenario.ml_prediction_distilbert || scenario.ml_prediction_cnn) {
      return {
        distilbert: { 
          prediction: scenario.ml_prediction_distilbert || 'unknown', 
          confidence: scenario.ml_confidence_distilbert || 0 
        },
        cnn: { 
          prediction: scenario.ml_prediction_cnn || 'unknown', 
          confidence: scenario.ml_confidence_cnn || 0 
        }
      };
    }

    try {
      const response = await api.getPrediction({
        text: scenario.body_text || scenario.content,
        links: scenario.links || [],
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

    const levelConfig = getLevelConfig(currentLevelKey);
    const mlResults = await getMLPrediction(currentScenario);
    const isCorrect = action === currentScenario.correct_action;

    // Calculate points
    let pointsEarned = 0;
    if (isCorrect) {
      const multiplier = {
        'easy': 1,
        'advanced_easy': 1.5,
        'medium': 2,
        'hard': 3,
        'expert': 5
      }[levelConfig?.difficulty] || 1;
      
      pointsEarned = Math.round(100 * multiplier);
      if (levelConfig?.isBonus) pointsEarned = 500;
    }

    // Update stats
    const newLevelStats = {
      correct: levelStats.correct + (isCorrect ? 1 : 0),
      total: levelStats.total + 1,
      timeSpent: levelStats.timeSpent + timeTaken
    };
    setLevelStats(newLevelStats);

    if (isCorrect) {
      setScore(prev => prev + pointsEarned);
      setTotalCorrect(prev => prev + 1);
      
      setLevelScores(prev => ({
        ...prev,
        [currentLevelKey]: {
          ...prev[currentLevelKey],
          correct: (prev[currentLevelKey]?.correct || 0) + 1,
          score: (prev[currentLevelKey]?.score || 0) + pointsEarned
        }
      }));
    }
    setTotalActions(prev => prev + 1);

    // Save progress
    localStorage.setItem(`level_${currentLevelKey}_progress`, JSON.stringify(newLevelStats));

    // Record in context
    recordAction(currentLevelKey, {
      scenario_id: currentScenario.scenario_id,
      action,
      isCorrect,
      level: currentLevelKey,
      timeTaken,
      points: pointsEarned
    });

    // Save to backend
    try {
      await api.saveAction({
        scenario_id: currentScenario.scenario_id,
        user_action: action,
        time_taken_seconds: timeTaken,
        session_id: sessionId,
        level: currentLevelKey,
        is_correct: isCorrect,
        points_earned: pointsEarned
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
      explanation: getExplanation(action, isCorrect, currentScenario),
      points: pointsEarned
    });

    // Auto-advance
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        // Level complete
        setLevelScores(prev => ({
          ...prev,
          [currentLevelKey]: {
            ...prev[currentLevelKey],
            completed: prev[currentLevelKey]?.total || 0
          }
        }));
        
        completeLevel(currentLevelKey);
        setShowLevelComplete(true);
      }
    }, 3000);
  };

  const handleLevelCompleteClose = (action) => {
    setShowLevelComplete(false);
    
    if (action === 'next' && !isLastLevel) {
      setShowLevelTransition(true);
      setTimeout(() => {
        setShowLevelTransition(false);
        setCurrentLevelIndex(prev => prev + 1);
      }, 2500);
    } else if (action === 'retry') {
      setCurrentScenarioIndex(0);
      setLevelStats({ correct: 0, total: 0, timeSpent: 0 });
      localStorage.removeItem(`level_${currentLevelKey}_progress`);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    } else if (action === 'dashboard') {
      navigate('/dashboard');
    } else if (action === 'complete') {
      // Game complete
      const totalTime = Math.round((Date.now() - gameStartTime.current) / 1000);
      const minutes = Math.floor(totalTime / 60);
      const seconds = totalTime % 60;
      setSessionTimeTaken(`${minutes}m ${seconds}s`);
      setGameComplete(true);

      setTimeout(() => {
        navigate('/thankyou');
      }, 3000);
    }
  };

  const getExplanation = (action, isCorrect, scenario) => {
    if (isCorrect) {
      const explanations = {
        'Report Phish': "✅ Correct! Reporting helps protect everyone.",
        'Report & Isolate': "✅ Correct! Isolate and report immediately.",
        'Ignore': "✅ Correct! When in doubt, ignore.",
        'Verify with Sender': "✅ Correct! Always verify through another channel.",
        'Call Family Directly': "✅ Correct! Verify emergencies directly.",
        'Call Official Number': "✅ Correct! Use official numbers only.",
        'Use VPN': "✅ Correct! VPN protects on public WiFi.",
        'Research Charity': "✅ Correct! Research before donating.",
        'Check Official Site': "✅ Correct! Check the official website directly.",
        'Inspect QR URL': "✅ Correct! Always inspect QR code URLs.",
        'Investigate': "✅ Correct! Investigate before acting.",
        'Compare with Original': "✅ Correct! Compare with legitimate messages.",
        'Complete Analysis': "✅ Excellent! Knowledge is power.",
        'Monitor': "✅ Correct! Monitor suspicious activity.",
        'Research': "✅ Correct! Research first, act second.",
        'Check Account': "✅ Correct! Check your account directly."
      };
      return explanations[action] || "✅ Correct! Good judgment!";
    } else {
      const explanations = {
        'Trust & Click': "❌ Never click suspicious links.",
        'Call Provided Number': "❌ Use official numbers only.",
        'Scan QR Code': "❌ QR codes can hide malicious URLs.",
        'Process Transfer': "❌ Never wire money based on email.",
        'Send Money': "❌ Verify emergencies directly.",
        'Provide Information': "❌ Never share personal info via email.",
        'Connect & Login': "❌ Avoid login on public WiFi.",
        'Connect': "❌ Be cautious with unknown networks.",
        'Claim Prize': "❌ If it's too good to be true...",
        'Donate Now': "❌ Research charities first.",
        'Apply Now': "❌ Research companies before applying.",
        'Invest Now': "❌ Crypto guarantees are scams.",
        'Download Antivirus': "❌ Fake alerts are scareware.",
        'Ignore Lesson': "❌ Don't skip important lessons!",
        'Engage': "❌ Never engage with attackers.",
        'Proceed Anyway': "❌ Don't ignore security warnings.",
        'Call Back Number': "❌ Always use verified numbers."
      };
      return explanations[action] || `❌ Incorrect. The correct action was: ${scenario.correct_action}`;
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
    const nextConfig = getLevelConfig(nextKey);
    
    return (
      <div className="level-transition-overlay">
        <div className="transition-content">
          <div className="transition-check" aria-hidden="true">
            <span className="transition-check-core" />
            <span className="transition-check-ring" />
          </div>
          <h2>Level {currentLevelKey.toUpperCase()} Complete!</h2>
          <p>Score this level: {levelScores[currentLevelKey]?.score || 0} points</p>
          <p>Accuracy: {levelStats.total > 0 ? ((levelStats.correct / levelStats.total) * 100).toFixed(1) : 0}%</p>
          <div className="transition-next">
            <span>Next up:</span>
            <strong>Level {nextKey.toUpperCase()}</strong>
            <span className="next-difficulty">({nextConfig?.difficulty || 'medium'})</span>
          </div>
          <div className="transition-loader"></div>
        </div>
      </div>
    );
  }

  if (showLevelComplete) {
    const accuracy = levelStats.total > 0 
      ? ((levelStats.correct / levelStats.total) * 100).toFixed(1) 
      : 0;
    
    return (
      <LevelComplete
        levelKey={currentLevelKey}
        levelConfig={getLevelConfig(currentLevelKey)}
        stats={{
          correct: levelStats.correct,
          total: levelStats.total,
          accuracy,
          timeSpent: Math.round(levelStats.timeSpent),
          score: levelScores[currentLevelKey]?.score || 0
        }}
        isLastLevel={isLastLevel}
        onClose={handleLevelCompleteClose}
      />
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const levelConfig = getLevelConfig(currentLevelKey);

  return (
    <div className={`game-container theme-${levelConfig?.theme || 'default'}`}>
      {/* Game Header */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge" style={{ background: levelConfig?.colors?.primary }}>
            Level {currentLevelKey.toUpperCase()}
            {levelConfig?.isBonus && ' ⭐ BONUS'}
          </span>
          <span className="scenario-progress">
            {currentScenarioIndex + 1}/{scenarios.length}
          </span>
          {levelConfig?.difficulty && (
            <span className={`difficulty-badge ${levelConfig.difficulty}`}>
              {levelConfig.difficulty.replace('_', ' ')}
            </span>
          )}
          {currentScenario?.taxonomy && (
            <span className="category-badge">
              {currentScenario.taxonomy}
            </span>
          )}
        </div>

        <div className="header-controls">
          {/* Level Progress */}
          <div className="level-progress">
            <div className="progress-text">
              Level: {currentScenarioIndex + 1}/{scenarios.length}
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%`,
                  background: `linear-gradient(90deg, ${levelConfig?.colors?.primary}, ${levelConfig?.colors?.secondary})`
                }}
              ></div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="overall-progress">
            <div className="progress-text">
              Overall: {completedScenarios + currentScenarioIndex + 1}/{totalScenarios}
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="score-display">
            <span className="score-label">Score</span>
            <span className="score-value">{score}</span>
          </div>

          {levelConfig?.timeLimit && (
            <Timer 
              initialTime={levelConfig.timeLimit} 
              key={currentScenarioIndex}
            />
          )}

          <button onClick={() => navigate('/dashboard')} className="dashboard-button">
            Dashboard
          </button>
        </div>

        {/* Level Stats */}
        <div className="level-stats">
          <div className="stat-item">
            <span className="stat-label">Level Accuracy:</span>
            <span className="stat-value">
              {levelStats.total > 0 ? ((levelStats.correct / levelStats.total) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Correct:</span>
            <span className="stat-value">{levelStats.correct}/{levelStats.total}</span>
          </div>
        </div>
      </div>

      {/* Level Description */}
      {levelConfig?.description && (
        <div className="level-description">
          <span className="desc-icon">📌</span>
          <span className="desc-text">{levelConfig.description}</span>
        </div>
      )}

      {/* Template Renderer */}
      <TemplateRenderer
        scenario={currentScenario}
        onAction={handleAction}
        locked={locked}
        levelConfig={levelConfig}
      />

      {/* Feedback Overlay */}
      {feedback?.show && (
        <div className={`feedback-overlay ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-content">
            <h2>{feedback.isCorrect ? 'CORRECT!' : 'INCORRECT'}</h2>

            {feedback.points > 0 && (
              <div className="points-earned">+{feedback.points} points</div>
            )}

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
                    <span className={`prediction ${feedback.mlResults.distilbert?.prediction?.toLowerCase()}`}>
                      {feedback.mlResults.distilbert?.prediction}
                    </span>
                    <span className="confidence">
                      {feedback.mlResults.distilbert?.confidence ?
                        `${(feedback.mlResults.distilbert.confidence * 100).toFixed(0)}%` : ''}
                    </span>
                  </div>
                  <div className="ml-model">
                    <span className="model-name">CNN:</span>
                    <span className={`prediction ${feedback.mlResults.cnn?.prediction?.toLowerCase()}`}>
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
            <p className="next-hint">Next in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Timer Component
const Timer = ({ initialTime }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <div className={`timer ${timeLeft < 10 ? 'timer-warning' : ''}`}>
      ⏱️ {timeLeft}s
    </div>
  );
};