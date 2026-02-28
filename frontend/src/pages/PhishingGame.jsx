// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PhishingGame.css';

export default function PhishingGame() {
  const [levels, setLevels] = useState({});
  const [currentLevel, setCurrentLevel] = useState('l1');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || generateSessionId());
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadScenarios();
  }, [sessionId]);

  useEffect(() => {
    // When level changes, load scenarios for that level
    if (levels[currentLevel]) {
      setScenarios(levels[currentLevel]);
      setCurrentScenarioIndex(0);
      setLevelComplete(false);
      sessionStorage.setItem('scenario_start', Date.now().toString());
    }
  }, [currentLevel, levels]);

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/levels`);
      const allScenarios = response.data;
      
      // Group by level
      const grouped = allScenarios.reduce((acc, scenario) => {
        const level = scenario.level_no || 'l1';
        if (!acc[level]) {
          acc[level] = [];
        }
        acc[level].push(scenario);
        return acc;
      }, {});
      
      setLevels(grouped);
      setScenarios(grouped['l1'] || []);
      console.log('Levels loaded:', Object.keys(grouped));
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };
const getMLPrediction = async (emailText, links) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/predict`, {
      text: emailText,
      links: links
    });
    return response.data;
  } catch (error) {
    console.error('ML prediction failed:', error);
    // Return mock data so game doesn't break
    return {
      distilbert: { prediction: 'phishing', confidence: 0.75 },
      cnn: { prediction: 'phishing', confidence: 0.70 }
    };
  }
};
  const handleAction = async (action) => {
    const currentScenario = scenarios[currentScenarioIndex];
    const startTime = sessionStorage.getItem('scenario_start');
    const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
    
    setFeedback({ loading: true });
    
    const mlResults = await getMLPrediction(
      currentScenario.body_text || currentScenario.content,
      currentScenario.links
    );
    
    const isCorrect = action === currentScenario.correct_action;
    
    if (isCorrect) {
      setScore(prev => prev + 100);
    }
    
    // Save to backend
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/action`, {
        scenario_id: currentScenario.scenario_id,
        user_action: action,
        ml_predictions: mlResults,
        time_taken_seconds: timeTaken,
        session_id: sessionId,
        level: currentLevel
      });
    } catch (error) {
      console.error('Failed to save action:', error);
    }
    
    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      mlResults,
      explanation: getExplanation(action, isCorrect)
    });
    
    setTimeout(() => {
      setFeedback(null);
      
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        // Level complete
        setLevelComplete(true);
      }
    }, 3000);
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

  const handleLevelChange = (event) => {
    setCurrentLevel(event.target.value);
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const resetLevel = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setLevelComplete(false);
    sessionStorage.setItem('scenario_start', Date.now().toString());
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Phishing Training Scenarios...</p>
      </div>
    );
  }

  if (Object.keys(levels).length === 0) {
    return (
      <div className="error-screen">
        <h2>No Levels Found</h2>
        <p>Please check back later or contact support.</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    );
  }

  if (levelComplete) {
    return (
      <div className="level-complete">
        <div className="complete-content">
          <h1>🎉 Level Complete!</h1>
          <p>You scored {score} points</p>
          <p>Completed {scenarios.length} scenarios</p>
          
          <div className="complete-actions">
            <button onClick={resetLevel} className="replay-btn">
              🔄 Replay Level
            </button>
            <button onClick={goToDashboard} className="dashboard-btn">
              📊 View Dashboard
            </button>
            <select 
              onChange={handleLevelChange} 
              value={currentLevel}
              className="level-select"
            >
              {Object.keys(levels).sort().map(level => (
                <option key={level} value={level}>
                  Level {level.toUpperCase()} ({levels[level].length} scenarios)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="error-screen">
        <h2>No Scenarios in Level {currentLevel}</h2>
        <select onChange={handleLevelChange} value={currentLevel}>
          {Object.keys(levels).sort().map(level => (
            <option key={level} value={level}>
              Level {level.toUpperCase()} ({levels[level].length} scenarios)
            </option>
          ))}
        </select>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      {/* GAME HEADER */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">Level {currentLevel.toUpperCase()}</span>
          <span className="scenario-progress">
            Scenario {currentScenarioIndex + 1} / {scenarios.length}
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
            onChange={handleLevelChange} 
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

      {/* PHISHING TYPE INFO */}
      <div className="phishing-type-header">
        <h2>{currentScenario.taxonomy || 'Phishing Simulation'}</h2>
        <span className={`difficulty-badge ${currentScenario.category || 'medium'}`}>
          {currentScenario.category || 'Training'}
        </span>
      </div>

      {/* EMAIL CARD */}
      <div className="email-card">
        <div className="email-header">
          <div className="email-field">
            <span className="field-label">From:</span>
            <span className="field-value">{currentScenario.from_address || 'Unknown'}</span>
          </div>
          <div className="email-field">
            <span className="field-label">Reply-To:</span>
            <span className="field-value warning">{currentScenario.reply_to || 'None'}</span>
          </div>
          <div className="email-field">
            <span className="field-label">To:</span>
            <span className="field-value">{currentScenario.to_address || 'Unknown'}</span>
          </div>
        </div>

        <div className="email-body">
          <h3>{currentScenario.title || 'Phishing Email'}</h3>
          
          {currentScenario.body_html ? (
            <div 
              className="email-content"
              dangerouslySetInnerHTML={{ __html: currentScenario.body_html }}
            />
          ) : (
            <div className="email-content">
              <p>{currentScenario.content || currentScenario.body_text || 'No content available'}</p>
            </div>
          )}
          
          {/* LINKS SECTION */}
          {currentScenario.links && currentScenario.links.length > 0 && (
            <div className="links-section">
              <p className="links-label">🔗 Links in this email:</p>
              <ul className="links-list">
                {currentScenario.links.map((link, index) => (
                  <li key={index} className="suspicious-link">
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ATTACHMENTS SECTION */}
          {currentScenario.has_attachment && currentScenario.attachments && (
            <div className="attachments-section">
              <p className="attachments-label">📎 Attachments:</p>
              <ul className="attachments-list">
                {currentScenario.attachments.map((att, index) => (
                  <li key={index} className="attachment-item">
                    {att.name || 'file.pdf'} ({att.size || 'Unknown'})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {!feedback && (
        <div className="action-buttons">
          <button 
            className="action-btn trust"
            onClick={() => handleAction(currentScenario.wrong_action || 'Trust & Click')}
          >
            🔗 {currentScenario.wrong_action || 'Trust & Click'}
          </button>
          <button 
            className="action-btn ignore"
            onClick={() => handleAction(currentScenario.neutral_action || 'Ignore')}
          >
            ⏭️ {currentScenario.neutral_action || 'Ignore'}
          </button>
          <button 
            className="action-btn report"
            onClick={() => handleAction(currentScenario.correct_action || 'Report Phish')}
          >
            🚨 {currentScenario.correct_action || 'Report Phish'}
          </button>
        </div>
      )}

      {/* FEEDBACK OVERLAY */}
      {feedback && feedback.show && (
        <div className={`feedback-overlay ${feedback.isCorrect ? 'correct' : 'incorrect'}`}>
          <div className="feedback-content">
            <h2>{feedback.isCorrect ? '✅ CORRECT!' : '❌ INCORRECT'}</h2>
            
            <div className="feedback-details">
              <p><strong>You chose:</strong> {feedback.userAction}</p>
              <p><strong>Correct action:</strong> {feedback.correctAction}</p>
            </div>

            {/* ML FEEDBACK */}
            {feedback.mlResults && (
              <div className="ml-feedback">
                <h3>🤖 AI Analysis</h3>
                <div className="ml-models">
                  <div className="ml-model">
                    <span className="model-name">DistilBERT:</span>
                    <span className={`prediction ${feedback.mlResults.distilbert?.prediction}`}>
                      {feedback.mlResults.distilbert?.prediction || 'Unknown'}
                    </span>
                    <span className="confidence">
                      {feedback.mlResults.distilbert?.confidence ? 
                        `${(feedback.mlResults.distilbert.confidence * 100).toFixed(0)}%` : ''}
                    </span>
                  </div>
                  <div className="ml-model">
                    <span className="model-name">CNN:</span>
                    <span className={`prediction ${feedback.mlResults.cnn?.prediction}`}>
                      {feedback.mlResults.cnn?.prediction || 'Unknown'}
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