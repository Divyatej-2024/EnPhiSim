// frontend/src/pages/PhishingGame.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhishingGame.css';
import './Dashboard';

export default function PhishingGame() {
  const [levels, setLevels] = useState({});
  const [currentLevel, setCurrentLevel] = useState('l1');
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scenarios, setScenarios] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [mlPrediction, setMlPrediction] = useState(null);
  const [sessionId] = useState(() => localStorage.getItem('sessionId') || generateSessionId());

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId);
    loadScenarios();
  }, [sessionId]);

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
        if (!acc[scenario.level_no]) {
          acc[scenario.level_no] = [];
        }
        acc[scenario.level_no].push(scenario);
        return acc;
      }, {});
      
      setLevels(grouped);
      setScenarios(grouped['l1'] || []);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMLPrediction = async (emailText, links) => {
    try {
      // Call your ML server
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/predict`, {
        text: emailText,
        links: links
      });
      
      return response.data;
    } catch (error) {
      console.error('ML prediction failed:', error);
      return {
        distilbert: { prediction: 'unknown', confidence: 0 },
        cnn: { prediction: 'unknown', confidence: 0 }
      };
    }
  };

  const handleAction = async (action) => {
    const currentScenario = scenarios[currentScenarioIndex];
    const startTime = sessionStorage.getItem('scenario_start');
    const timeTaken = startTime ? (Date.now() - parseInt(startTime)) / 1000 : 0;
    
    // Show loading state
    setFeedback({ loading: true });
    
    // Get ML prediction
    const mlResults = await getMLPrediction(
      currentScenario.body_text,
      currentScenario.links
    );
    
    // Save action to backend
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/action`, {
      scenario_id: currentScenario.scenario_id,
      user_action: action,
      ml_predictions: mlResults,
      time_taken_seconds: timeTaken,
      session_id: sessionId
    });
    
    const isCorrect = response.data.correct;
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 100);
    }
    
    // Show feedback
    setFeedback({
      show: true,
      isCorrect,
      userAction: action,
      correctAction: currentScenario.correct_action,
      mlResults,
      explanation: getExplanation(currentScenario, action, mlResults)
    });
    
    // Auto-advance after 3 seconds
    setTimeout(() => {
      setFeedback(null);
      
      // Move to next scenario
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
        sessionStorage.setItem('scenario_start', Date.now().toString());
      } else {
        // Level complete
        alert(`Level ${currentLevel} complete! Moving to next level...`);
        const nextLevel = getNextLevel(currentLevel);
        if (nextLevel) {
          setCurrentLevel(nextLevel);
          setScenarios(levels[nextLevel] || []);
          setCurrentScenarioIndex(0);
        }
      }
    }, 3000);
  };

  const getExplanation = (scenario, action, mlResults) => {
    const explanations = {
      'Trust & Click': 'Clicking suspicious links can lead to credential theft.',
      'Ignore': 'Ignoring is safe but reporting helps protect others.',
      'Report Phish': 'Reporting helps security teams block future attacks!'
    };
    
    const mlAdvice = mlResults.distilbert?.prediction === 'phishing' 
      ? 'Our AI also detected this as phishing.' 
      : 'Our AI is learning to detect this type.';
    
    return `${explanations[action] || ''} ${mlAdvice}`;
  };

  const getNextLevel = (current) => {
    const levelOrder = ['l1', 'l2', 'l3', 'l4', 'l5'];
    const currentIndex = levelOrder.indexOf(current);
    return currentIndex < levelOrder.length - 1 ? levelOrder[currentIndex + 1] : null;
  };

  if (loading) {
    return <div className="loading-screen">Loading Phishing Training Scenarios...</div>;
  }

  if (scenarios.length === 0) {
    return <div className="error-screen">No scenarios found for this level.</div>;
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
    <div className="game-container">
      {/* GAME HEADER */}
      <div className="game-header">
        <div className="level-info">
          <span className="level-badge">Level {currentLevel}</span>
          <span className="scenario-progress">
            Scenario {currentScenarioIndex + 1} / {scenarios.length}
          </span>
          {/* <Link to="/dashboard" className="dashboard-link">
  📊 View Dashboard
</Link> */}
        </div>
        <div className="score-display">
          <span className="score-label">Score</span>
          <span className="score-value">{score}</span>
        </div>
      </div>

      {/* PHISHING TYPE INFO */}
      <div className="phishing-type-header">
        <h2>{currentScenario.taxonomy}</h2>
        <span className={`difficulty-badge ${currentScenario.category}`}>
          {currentScenario.category}
        </span>
      </div>

      {/* EMAIL CARD */}
      <div className="email-card">
        <div className="email-header">
          <div className="email-field">
            <span className="field-label">From:</span>
            <span className="field-value">{currentScenario.from_address}</span>
          </div>
          <div className="email-field">
            <span className="field-label">Reply-To:</span>
            <span className="field-value warning">{currentScenario.reply_to || "No-Reply to"}</span>
          </div>
          <div className="email-field">
            <span className="field-label">To:</span>
            <span className="field-value">{currentScenario.to_address}</span>
          </div>
        </div>

        <div className="email-body">
          <h3>{currentScenario.title}</h3>
          <div 
            className="email-content"
            dangerouslySetInnerHTML={{ __html: currentScenario.body_html }}
          />
          
          {/* LINKS SECTION */}
          {currentScenario.links && currentScenario.links.length > 0 && (
            <div className="links-section">
              <p className="links-label">Links in this email:</p>
              <ul className="links-list">
                {currentScenario.links.map((link, index) => (
                  <li key={index} className="suspicious-link">
                    🔗 {link}
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
            onClick={() => handleAction('Trust & Click')}
          >
            🔗 Trust & Click
          </button>
          <button 
            className="action-btn ignore"
            onClick={() => handleAction('Ignore')}
          >
            ⏭️ Ignore
          </button>
          <button 
            className="action-btn report"
            onClick={() => handleAction('Report Phish')}
          >
            🚨 Report Phish
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
            <div className="ml-feedback">
              <h3>🤖 AI Analysis</h3>
              <div className="ml-models">
                <div className="ml-model">
                  <span className="model-name">DistilBERT:</span>
                  <span className={`prediction ${feedback.mlResults.distilbert?.prediction}`}>
                    {feedback.mlResults.distilbert?.prediction}
                  </span>
                  <span className="confidence">
                    {(feedback.mlResults.distilbert?.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
                <div className="ml-model">
                  <span className="model-name">CNN:</span>
                  <span className={`prediction ${feedback.mlResults.cnn?.prediction}`}>
                    {feedback.mlResults.cnn?.prediction}
                  </span>
                  <span className="confidence">
                    {(feedback.mlResults.cnn?.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
              </div>
            </div>

            <p className="explanation">{feedback.explanation}</p>
            <p className="next-hint">Next scenario in 3 seconds...</p>
          </div>
        </div>
      )}
    </div>
  );
}