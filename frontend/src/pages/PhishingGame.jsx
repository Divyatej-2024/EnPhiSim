// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import TemplateRenderer from './levels/TemplateRenderer';
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
  const [levelConfig, setLevelConfig] = useState(null);
  
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
  const [levelLoading, setLevelLoading] = useState(false);

  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || generateSessionId();
  });

  // Current level key
  const currentLevelKey = sortedLevelKeys[currentLevelIndex] || '';
  const isLastLevel = currentLevelIndex >= sortedLevelKeys.length - 1;
  const totalScenarios = Object.values(levels).reduce((sum, arr) => sum + arr.length, 0);

  // Count completed scenarios
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

  // Initialize session
  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadLevels();
  }, [sessionId]);

  // Load level configuration when level changes
  useEffect(() => {
    if (currentLevelKey && levels[currentLevelKey]) {
      loadLevelConfiguration(currentLevelKey);
    }
  }, [currentLevelKey, levels]);

  // Load scenarios for current level
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

  // Load all levels metadata
  const loadLevels = async () => {
    try {
      setLoading(true);
      const allScenarios = await api.getLevels();

      if (!Array.isArray(allScenarios)) {
        throw new Error("Invalid levels format");
      }

      // Group scenarios by level
      const grouped = allScenarios.reduce((acc, scenario) => {
        const level = scenario.level_no || 'l1';
        if (!acc[level]) acc[level] = [];
        acc[level].push(scenario);
        return acc;
      }, {});

      // Sort levels naturally (l1, l2, l3, etc.)
      const keys = Object.keys(grouped).sort((a, b) => {
        const numA = parseInt(a.replace('l', ''));
        const numB = parseInt(b.replace('l', ''));
        return numA - numB;
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

  // Load level-specific configuration
  const loadLevelConfiguration = async (levelKey) => {
    try {
      setLevelLoading(true);
      const config = await getLevelConfig(levelKey);
      setLevelConfig(config);
      applyLevelSettings(config);
    } catch (error) {
      console.error(`Failed to load config for level ${levelKey}:`, error);
    } finally {
      setLevelLoading(false);
    }
  };

  // Get level configuration
  const getLevelConfig = async (levelKey) => {
    try {
      const response = await api.getLevelConfig(levelKey);
      if (response) return response;
    } catch {
      return getDefaultLevelConfig(levelKey);
    }
  };

  // Default level configurations
  const getDefaultLevelConfig = (levelKey) => {
    const levelNum = parseInt(levelKey.replace('l', ''));
    
    const configs = {
      // Easy levels (l1-l5)
      l1: {
        template: 'mail',
        timeLimit: 60,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'easy',
        theme: 'basic',
        description: 'Basic email phishing detection'
      },
      l2: {
        template: 'mail',
        timeLimit: 55,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'easy',
        theme: 'basic',
        description: 'Financial fraud awareness'
      },
      l3: {
        template: 'mail',
        timeLimit: 50,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: true,
        difficulty: 'easy',
        theme: 'basic',
        description: 'Social engineering basics'
      },
      l4: {
        template: 'mail',
        timeLimit: 45,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: true,
        difficulty: 'easy',
        theme: 'basic',
        description: 'Prize and lottery scams'
      },
      l5: {
        template: 'mail',
        timeLimit: 40,
        showHints: false,
        feedbackDelay: 2000,
        mlEnabled: true,
        difficulty: 'easy',
        theme: 'basic',
        description: 'Attachment-based attacks'
      },
      
      // Advanced Easy (l6-l10)
      l6: {
        template: 'mail',
        timeLimit: 35,
        showHints: false,
        feedbackDelay: 2500,
        mlEnabled: true,
        difficulty: 'advanced_easy',
        theme: 'professional',
        description: 'Spoofed display names'
      },
      l7: {
        template: 'mail',
        timeLimit: 35,
        showHints: false,
        feedbackDelay: 2500,
        mlEnabled: true,
        difficulty: 'advanced_easy',
        theme: 'professional',
        features: ['typosquatting'],
        description: 'Typosquatted domains'
      },
      l8: {
        template: 'browser',
        timeLimit: 30,
        showHints: false,
        feedbackDelay: 2500,
        mlEnabled: true,
        difficulty: 'advanced_easy',
        theme: 'browser',
        features: ['url_shortener'],
        description: 'URL shortener redirects'
      },
      l9: {
        template: 'mail',
        timeLimit: 30,
        showHints: false,
        feedbackDelay: 2500,
        mlEnabled: true,
        difficulty: 'advanced_easy',
        theme: 'professional',
        features: ['survey'],
        description: 'Malicious surveys'
      },
      l10: {
        template: 'message',
        timeLimit: 25,
        showHints: false,
        feedbackDelay: 2500,
        mlEnabled: true,
        difficulty: 'advanced_easy',
        theme: 'mobile',
        features: ['smishing'],
        description: 'SMS phishing'
      },
      
      // Medium levels (l11-l20)
      l11: {
        template: 'mail',
        timeLimit: 30,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'corporate',
        features: ['spear_phishing'],
        description: 'Targeted spear phishing'
      },
      l12: {
        template: 'mail',
        timeLimit: 25,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'corporate',
        features: ['whaling'],
        description: 'Executive targeting'
      },
      l13: {
        template: 'mail',
        timeLimit: 25,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'professional',
        features: ['vishing'],
        description: 'Voice phishing'
      },
      l14: {
        template: 'mail',
        timeLimit: 20,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'professional',
        features: ['qr_phishing'],
        description: 'QR code phishing'
      },
      l15: {
        template: 'browser',
        timeLimit: 20,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'browser',
        features: ['pharming'],
        description: 'DNS poisoning'
      },
      l16: {
        template: 'mail',
        timeLimit: 20,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'professional',
        features: ['clone_phishing'],
        description: 'Clone phishing'
      },
      l17: {
        template: 'browser',
        timeLimit: 18,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'browser',
        features: ['mitm'],
        description: 'Man-in-the-middle'
      },
      l18: {
        template: 'mail',
        timeLimit: 18,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'professional',
        features: ['watering_hole'],
        description: 'Watering hole attacks'
      },
      l19: {
        template: 'mail',
        timeLimit: 15,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'professional',
        features: ['credential_stuffing'],
        description: 'Credential stuffing'
      },
      l20: {
        template: 'browser',
        timeLimit: 15,
        showHints: false,
        feedbackDelay: 3000,
        mlEnabled: true,
        difficulty: 'medium',
        theme: 'browser',
        features: ['session_hijacking'],
        description: 'Session hijacking'
      },
      
      // Hard levels (l21-l35)
      l21: {
        template: 'browser',
        timeLimit: 15,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['evil_twin'],
        description: 'Evil twin WiFi'
      },
      l22: {
        template: 'mail',
        timeLimit: 15,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['tech_support'],
        description: 'Tech support scams'
      },
      l23: {
        template: 'mail',
        timeLimit: 12,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['social_engineering'],
        description: 'Romance and trust scams'
      },
      l24: {
        template: 'mail',
        timeLimit: 12,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['charity_scam'],
        description: 'Fake charity appeals'
      },
      l25: {
        template: 'mail',
        timeLimit: 12,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['job_scam'],
        description: 'Fake job offers'
      },
      l26: {
        template: 'mail',
        timeLimit: 10,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['account_verification'],
        description: 'Account verification traps'
      },
      l27: {
        template: 'mail',
        timeLimit: 10,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['shipping_fraud'],
        description: 'Package delivery scams'
      },
      l28: {
        template: 'browser',
        timeLimit: 10,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['scareware'],
        description: 'Fake antivirus alerts'
      },
      l29: {
        template: 'mail',
        timeLimit: 8,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['inheritance_scam'],
        description: 'Inheritance fraud'
      },
      l30: {
        template: 'mail',
        timeLimit: 8,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['crypto_fraud'],
        description: 'Cryptocurrency scams'
      },
      l31: {
        template: 'mail',
        timeLimit: 8,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['government_fraud'],
        description: 'Government impersonation'
      },
      l32: {
        template: 'mail',
        timeLimit: 8,
        showHints: false,
        feedbackDelay: 3500,
        mlEnabled: true,
        difficulty: 'hard',
        theme: 'advanced',
        features: ['emergency_fraud'],
        description: 'Family emergency scams'
      },
      
      // Expert level (l39)
      l39: {
        template: 'multiphase',
        timeLimit: 30,
        showHints: false,
        feedbackDelay: 5000,
        mlEnabled: true,
        difficulty: 'expert',
        theme: 'advanced',
        features: ['spear_phishing', 'typosquatting', 'url_shortener', 'malware', 'clone_phishing'],
        multiStage: true,
        description: 'Multi-stage advanced persistent threat'
      },
      
      // Bonus levels (b1-b6)
      b1: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: 'Anglerfish Principle - Understanding lures'
      },
      b2: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: 'Porcupine Defense - Ransomware'
      },
      b3: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: 'Army Ant Strategy - DDoS'
      },
      b4: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: 'Mockingbird Effect - Social Engineering'
      },
      b5: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: "Cuckoo's Egg - Trojan Horses"
      },
      b6: {
        template: 'analysis',
        timeLimit: 300,
        showHints: true,
        feedbackDelay: 2000,
        mlEnabled: false,
        difficulty: 'bonus_analysis',
        theme: 'educational',
        isBonus: true,
        description: 'Zombie Ant Phenomenon - Botnets'
      }
    };

    return configs[levelKey] || {
      template: 'mail',
      timeLimit: 30,
      showHints: false,
      feedbackDelay: 3000,
      mlEnabled: true,
      difficulty: 'medium',
      theme: 'default',
      description: 'Standard phishing scenario'
    };
  };

  // Apply level settings
  const applyLevelSettings = (config) => {
    if (config.timeLimit) {
      console.log(`Time limit for this level: ${config.timeLimit}s`);
    }
    document.body.className = `theme-${config.theme || 'default'}`;
  };

  // ML Prediction
  const getMLPrediction = async (emailText, links) => {
    if (levelConfig && !levelConfig.mlEnabled) {
      return null;
    }

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

    // Check time limit
    if (levelConfig?.timeLimit && timeTaken > levelConfig.timeLimit) {
      setFeedback({
        show: true,
        isCorrect: false,
        userAction: action,
        correctAction: currentScenario.correct_action,
        explanation: "⏰ Time's up! Too slow to respond.",
        timeout: true
      });
      setTimeout(() => handleTimeout(), 3000);
      return;
    }

    const mlResults = await getMLPrediction(
      currentScenario.body_text || currentScenario.content,
      currentScenario.links
    );

    const isCorrect = action === currentScenario.correct_action;

    // Calculate points
    let pointsEarned = isCorrect ? 100 : 0;
    if (isCorrect && levelConfig?.isBonus) {
      pointsEarned = 500;
    }

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

    // Record in ProgressContext
    recordAction(currentLevelKey, {
      scenario_id: currentScenario.scenario_id,
      action,
      isCorrect,
      level: currentLevelKey,
      timeTaken,
      points: pointsEarned,
      mlResults
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
    const delay = levelConfig?.feedbackDelay || 3000;
    setTimeout(() => {
      setFeedback(null);
      setLocked(false);

      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        const completedCount = (levelScores[currentLevelKey]?.completed || 0) + 1;
        setLevelScores(prev => ({
          ...prev,
          [currentLevelKey]: {
            ...prev[currentLevelKey],
            completed: completedCount
          }
        }));
        
        completeLevel(currentLevelKey);

        if (!isLastLevel) {
          setShowLevelTransition(true);
          setTimeout(() => {
            setShowLevelTransition(false);
            setCurrentLevelIndex(prev => prev + 1);
          }, 2500);
        } else {
          const totalTime = Math.round((Date.now() - gameStartTime.current) / 1000);
          const minutes = Math.floor(totalTime / 60);
          const seconds = totalTime % 60;
          setSessionTimeTaken(`${minutes}m ${seconds}s`);
          setGameComplete(true);

          setTimeout(() => {
            navigate('/thankyou');
          }, 3000);
        }
      }
    }, delay);
  };

  const handleTimeout = () => {
    setFeedback(null);
    setLocked(false);
    
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    }
  };

  const getExplanation = (action, isCorrect, scenario) => {
    if (isCorrect) {
      const explanations = {
        'Report Phish': "✅ Correct! Reporting suspicious emails helps protect your organization from cyber threats.",
        'Report & Isolate': "✅ Correct! Multi-stage attacks require immediate isolation and reporting to security teams.",
        'Ignore': "✅ Correct! When in doubt, it's safer to ignore suspicious messages.",
        'Verify with Sender': "✅ Correct! Always verify sensitive requests through a different communication channel.",
        'Call Family Directly': "✅ Correct! Verify emergencies by calling the person directly on their known number.",
        'Call Official Number': "✅ Correct! Always use official phone numbers from trusted sources.",
        'Use VPN': "✅ Correct! Using a VPN on public WiFi protects your data from interception.",
        'Research Charity': "✅ Correct! Research charities before donating to ensure they're legitimate.",
        'Check Official Site': "✅ Correct! Verify account issues by going directly to the official website.",
        'Inspect QR URL': "✅ Correct! Always inspect QR code URLs before scanning.",
        'Investigate': "✅ Correct! Take time to investigate suspicious messages before acting.",
        'Compare with Original': "✅ Correct! Compare suspicious messages with legitimate ones from the same sender.",
        'Complete Analysis': "✅ Excellent! Understanding these concepts helps build stronger security awareness."
      };
      return explanations[action] || "✅ Correct! You made the right security decision.";
    } else {
      const explanations = {
        'Trust & Click': "❌ Incorrect. Clicking suspicious links can lead to malware infection or credential theft.",
        'Call Provided Number': "❌ Incorrect. Always use official phone numbers, not the one in the message.",
        'Scan QR Code': "❌ Incorrect. QR codes can lead to malicious websites. Always verify the URL first.",
        'Process Transfer': "❌ Incorrect. Never process financial transactions based on email requests alone.",
        'Send Money': "❌ Incorrect. Never send money based on email requests. Verify through official channels.",
        'Provide Information': "❌ Incorrect. Never provide personal information in response to unsolicited requests.",
        'Connect & Login': "❌ Incorrect. Avoid logging into accounts on public WiFi without VPN.",
        'Connect': "❌ Incorrect. Be cautious with unknown WiFi networks - they could be evil twins.",
        'Claim Prize': "❌ Incorrect. If it sounds too good to be true, it probably is.",
        'Donate Now': "❌ Incorrect. Research charities before donating to avoid scams.",
        'Apply Now': "❌ Incorrect. Research companies before applying - this could be a job scam.",
        'Invest Now': "❌ Incorrect. Cryptocurrency investment guarantees are almost always scams.",
        'Download Antivirus': "❌ Incorrect. Fake antivirus alerts are scareware trying to install malware.",
        'Ignore Lesson': "❌ These bonus lessons contain valuable security insights. Don't skip them!"
      };
      return explanations[action] || `❌ Incorrect. The correct action was: ${scenario.correct_action}`;
    }
  };

  // Render loading states
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <h2>Loading Training Scenarios...</h2>
        <p>Preparing your cybersecurity training</p>
      </div>
    );
  }

  if (!scenarios.length) {
    return (
      <div className="error-screen">
        <h2>⚠️ No Scenarios Available</h2>
        <p>Please check back later or contact your administrator.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Game complete
  if (gameComplete) {
    return (
      <div className="game-complete-overlay">
        <div className="game-complete-content">
          <div className="complete-icon">🏆</div>
          <h2>🎉 Simulation Complete! 🎉</h2>
          <p>You scored <strong>{score}</strong> points across <strong>{sortedLevelKeys.length}</strong> levels</p>
          <p className="accuracy-stat">
            Accuracy: {totalActions > 0 ? ((totalCorrect / totalActions) * 100).toFixed(1) : 0}%
          </p>
          <div className="level-breakdown">
            <h3>Level Performance:</h3>
            {Object.entries(levelScores).map(([level, data]) => (
              <div key={level} className="level-stat">
                <span>Level {level.toUpperCase()}:</span>
                <span>{data.correct}/{data.total} correct ({data.score} pts)</span>
              </div>
            ))}
          </div>
          <p className="redirect-hint">Redirecting to results page...</p>
        </div>
      </div>
    );
  }

  // Level transition
  if (showLevelTransition) {
    const nextKey = sortedLevelKeys[currentLevelIndex + 1] || '';
    const nextConfig = getDefaultLevelConfig(nextKey);
    
    return (
      <div className="level-transition-overlay">
        <div className="transition-content">
          <div className="transition-check">✓</div>
          <h2>Level {currentLevelKey.toUpperCase()} Complete!</h2>
          <p>Score this level: {levelScores[currentLevelKey]?.score || 0} points</p>
          <p>Accuracy: {
            levelScores[currentLevelKey]?.total ? 
              ((levelScores[currentLevelKey].correct / levelScores[currentLevelKey].total) * 100).toFixed(1) : 0
          }%</p>
          
          <div className="transition-next">
            <span>Next up:</span>
            <strong>Level {nextKey.toUpperCase()}</strong>
            <span className="next-difficulty">({nextConfig?.difficulty?.replace('_', ' ') || 'medium'})</span>
          </div>
          
          {nextConfig?.description && (
            <div className="next-description">
              <small>{nextConfig.description}</small>
            </div>
          )}
          
          {nextConfig?.features && (
            <div className="next-features">
              <small>Features: {nextConfig.features.join(' • ')}</small>
            </div>
          )}
          
          <div className="transition-loader"></div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];
  const levelNum = parseInt(currentLevelKey.replace('l', ''));

  return (
    <div className={`game-container theme-${levelConfig?.theme || 'default'}`}>
      {/* Game Header */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">
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
        </div>

        <div className="header-controls">
          {/* Overall progress bar */}
          <div className="overall-progress">
            <div className="progress-text">
              Level {currentLevelKey.toUpperCase()}: {currentScenarioIndex + 1}/{scenarios.length}
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentScenarioIndex + 1) / scenarios.length) * 100}%`
                }}
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
            📊 Dashboard
          </button>
        </div>
      </div>

      {/* Level description */}
      {levelConfig?.description && (
        <div className="level-description">
          📌 {levelConfig.description}
        </div>
      )}

      {/* Template-based Level Renderer */}
      {levelLoading ? (
        <div className="level-loading">Loading level configuration...</div>
      ) : (
        <TemplateRenderer
          scenario={currentScenario}
          onAction={handleAction}
          locked={locked}
          levelConfig={levelConfig}
          levelNumber={levelNum}
        />
      )}

      {/* Feedback Overlay */}
      {feedback?.show && (
        <div className={`feedback-overlay ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-content">
            <h2>{feedback.isCorrect ? '✅ CORRECT!' : '❌ INCORRECT'}</h2>

            {feedback.points > 0 && (
              <div className="points-earned">
                +{feedback.points} points
              </div>
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
                    <span className={`prediction ${feedback.mlResults.distilbert?.prediction}`}>
                      {feedback.mlResults.distilbert?.prediction || 'unknown'}
                    </span>
                    <span className="confidence">
                      {feedback.mlResults.distilbert?.confidence ?
                        `${(feedback.mlResults.distilbert.confidence * 100).toFixed(0)}%` : ''}
                    </span>
                  </div>
                  <div className="ml-model">
                    <span className="model-name">CNN:</span>
                    <span className={`prediction ${feedback.mlResults.cnn?.prediction}`}>
                      {feedback.mlResults.cnn?.prediction || 'unknown'}
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
            
            {levelConfig?.showHints && feedback.isCorrect && (
              <div className="learning-tip">
                💡 Tip: {getLearningTip(currentScenario.taxonomy)}
              </div>
            )}
            
            <p className="next-hint">Next scenario in {levelConfig?.feedbackDelay ? levelConfig.feedbackDelay/1000 : 3} seconds...</p>
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

// Learning tips helper
const getLearningTip = (taxonomy) => {
  const tips = {
    'Credential Phishing': 'Always check the sender\'s email address carefully. Legitimate companies use their official domain.',
    'Financial Fraud': 'Be skeptical of urgent payment requests. Verify through official channels.',
    'Messaging Attacks': 'Hover over links before clicking to see the actual URL.',
    'Executive Targeting': 'Executives should always verify unusual requests through a phone call.',
    'Social Engineering': 'Attackers exploit emotions like urgency, fear, or excitement. Take a moment to think.',
    'Voice Phishing': 'Never trust caller ID. Hang up and call back using the official number.',
    'QR Code Phishing': 'QR codes can hide malicious URLs. Always inspect the URL before visiting.',
    'MITM Attack': 'Avoid using public WiFi for sensitive transactions. Use a VPN.',
    'Watering Hole': 'Be cautious even on trusted websites. Keep your browser updated.',
    'Credential Stuffing': 'Use unique passwords for each account and enable 2FA.',
    'Session Hijacking': 'Always log out of websites, especially on shared computers.',
    'Tech Support Fraud': 'Legitimate tech support will never contact you unsolicited.',
    'Shipping Fraud': 'Track packages through the official carrier website, not email links.',
    'Government Fraud': 'Government agencies never demand immediate payment or personal info via email.',
    'Emergency Fraud': 'Verify emergencies by calling the person directly on their known number.',
    'Crypto Fraud': 'If it sounds too good to be true, it probably is.',
    'Ransomware': 'Regular backups are your best defense against ransomware.',
    'DDoS Attacks': 'Organizations should have DDoS mitigation strategies in place.',
    'Trojan Horse': 'Never download attachments or software from untrusted sources.',
    'Botnets': 'Keep all devices updated to prevent them from becoming part of a botnet.',
    'Advanced Persistent Phishing': 'Multi-stage attacks require vigilance. Report suspicious patterns immediately.'
  };

  return tips[taxonomy] || 'Stay vigilant and think before you click.';
};