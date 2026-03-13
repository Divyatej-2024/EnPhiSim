// frontend/src/pages/levels/templates/AnalysisLevel.jsx
import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./AnalysisLevel.css";

export default function AnalysisLevel({ level: scenario, onAction, locked }) {
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showHint, setShowHint] = useState(false);

  if (!scenario) {
    console.error('AnalysisLevel: No scenario provided');
    return <div className="error-message">Error: No level data available</div>;
  }

  // Nature analogy questions based on the bonus level
  const questions = [
    {
      id: 1,
      text: "What animal behavior does this phishing attack mimic?",
      options: ["Anglerfish", "Porcupine", "Mockingbird", "Cuckoo", "Army Ants", "Zombie Ant Fungus"],
      correct: scenario.taxonomy === "Phishing" ? "Anglerfish" :
               scenario.taxonomy === "Ransomware" ? "Porcupine" :
               scenario.taxonomy === "DDoS Attacks" ? "Army Ants" :
               scenario.taxonomy === "Social Engineering" ? "Mockingbird" :
               scenario.taxonomy === "Trojan Horse" ? "Cuckoo" :
               scenario.taxonomy === "Botnets" ? "Zombie Ant Fungus" : "Anglerfish"
    },
    {
      id: 2,
      text: "What type of lure or deception is being used in this attack?",
      options: ["Financial bait", "Security scare", "Emotional manipulation", "Trust exploitation", "Urgency tactics", "Authority impersonation"],
      correct: "Emotional manipulation"
    },
    {
      id: 3,
      text: "What is the most effective defense against this type of attack?",
      options: ["User awareness training", "Technical controls", "Multi-factor authentication", "Regular backups", "Network monitoring", "Email filtering"],
      correct: "User awareness training"
    },
    {
      id: 4,
      text: "How does this attack technique relate to its animal counterpart?",
      options: ["Uses attractive bait", "Hides in plain sight", "Overwhelms with numbers", "Mimics trusted sources", "Lies dormant then activates", "Controls from within"],
      correct: "Uses attractive bait"
    }
  ];

  return (
    <BaseLevel 
      levelType="analysis" 
      scenario={scenario} 
      onAction={onAction} 
      locked={locked}
    >
      {({ level, onAction: handleAction, locked: isLocked }) => {
        // ✅ ALL logic MUST be INSIDE this function
        
        const handleAnswer = (answer) => {
          const newAnswers = { ...answers, [currentQuestion]: answer };
          setAnswers(newAnswers);
          setShowHint(false);
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            setCompleted(true);
          }
        };

        const handleSubmit = () => {
          // Calculate score
          const correctCount = Object.keys(answers).filter(qIndex => 
            answers[qIndex] === questions[qIndex].correct
          ).length;
          
          const score = Math.round((correctCount / questions.length) * 100);
          
          handleAction(level.correct_action || "Complete Analysis", { 
            answers,
            score,
            completed: true,
            totalQuestions: questions.length,
            correctAnswers: correctCount
          });
        };

        const resetAnalysis = () => {
          setAnswers({});
          setCompleted(false);
          setCurrentQuestion(0);
          setShowHint(false);
        };

        return (
          <div className="analysis-container">
            {/* Header with Nature Theme */}
            <div className="analysis-header">
              <div className="nature-icon">
                {level.taxonomy === "Phishing" && "🐟"}
                {level.taxonomy === "Ransomware" && "🦔"}
                {level.taxonomy === "DDoS Attacks" && "🐜"}
                {level.taxonomy === "Social Engineering" && "🐦"}
                {level.taxonomy === "Trojan Horse" && "🥚"}
                {level.taxonomy === "Botnets" && "🍄"}
              </div>
              <h2>{level.title || "Nature's Cybersecurity Lesson"}</h2>
              <p className="analysis-description">{level.content}</p>
              <div className="bonus-badge">🌟 BONUS ANALYSIS LEVEL</div>
            </div>

            {/* Main Content Area */}
            <div className="analysis-content">
              {/* Educational Content from Database */}
              {level.body_html && (
                <div 
                  className="analysis-html"
                  dangerouslySetInnerHTML={{ __html: level.body_html }} 
                />
              )}

              {/* Interactive Analysis Section */}
              {!completed ? (
                <div className="analysis-questions">
                  <div className="question-header">
                    <h3>Question {currentQuestion + 1} of {questions.length}</h3>
                    <button 
                      className="hint-btn"
                      onClick={() => setShowHint(!showHint)}
                      disabled={isLocked}
                    >
                      {showHint ? "Hide Hint" : "Show Hint"}
                    </button>
                  </div>

                  <div className="question-card">
                    <p className="question-text">{questions[currentQuestion].text}</p>
                    
                    {showHint && (
                      <div className="hint-box">
                        <strong>💡 Hint:</strong> Think about how nature's predators use deception...
                      </div>
                    )}

                    <div className="options-grid">
                      {questions[currentQuestion].options.map((option, idx) => (
                        <button
                          key={idx}
                          className={`analysis-option ${
                            answers[currentQuestion] === option ? 'selected' : ''
                          }`}
                          onClick={() => handleAnswer(option)}
                          disabled={isLocked}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="question-progress">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`progress-dot ${
                          idx === currentQuestion ? 'active' : ''
                        } ${answers[idx] ? 'completed' : ''}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="analysis-complete">
                  <div className="success-animation">
                    <div className="checkmark">✓</div>
                  </div>
                  <h3>Analysis Complete!</h3>
                  <p>You've successfully completed the bonus analysis level.</p>
                  
                  {/* Score Summary */}
                  <div className="score-summary">
                    <div className="score-circle">
                      <span className="score-number">
                        {Object.keys(answers).filter(qIndex => 
                          answers[qIndex] === questions[qIndex].correct
                        ).length}
                      </span>
                      <span className="score-total">/{questions.length}</span>
                    </div>
                    <p className="score-text">Correct Answers</p>
                  </div>

                  {/* Download Worksheet */}
                  {level.attachments && level.attachments.length > 0 && (
                    <div className="worksheet-download">
                      <p>📥 Download your analysis worksheet:</p>
                      {level.attachments.map((att, idx) => (
                        <div key={idx} className="attachment-item">
                          <span className="attachment-icon">📄</span>
                          <span className="attachment-name">{att.name}</span>
                          <span className="attachment-size">({att.size})</span>
                          <button className="download-btn">Download</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nature Facts */}
                  <div className="nature-fact">
                    <h4>🌿 Nature Fact</h4>
                    <p>
                      {level.taxonomy === "Phishing" && "The anglerfish's lure is actually a modified dorsal spine that glows due to symbiotic bacteria."}
                      {level.taxonomy === "Ransomware" && "Porcupine quills have microscopic barbs that make them impossible to remove without medical attention."}
                      {level.taxonomy === "DDoS Attacks" && "Army ants can consume up to 100,000 prey animals in a single day through sheer numbers."}
                      {level.taxonomy === "Social Engineering" && "Mockingbirds can learn up to 200 different songs throughout their lifetime."}
                      {level.taxonomy === "Trojan Horse" && "Cuckoo chicks push the host's eggs out of the nest within hours of hatching."}
                      {level.taxonomy === "Botnets" && "The cordyceps fungus can control an ant's brain, forcing it to climb to the perfect height for spore dispersal."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="analysis-actions">
              {!completed ? (
                <>
                  <button
                    className="analysis-btn skip"
                    disabled={isLocked}
                    onClick={() => handleAction(level.neutral_action || "Skip", { 
                      skipped: true,
                      currentQuestion 
                    })}
                  >
                    ⏭️ Skip Analysis
                  </button>
                  <button
                    className="analysis-btn reset"
                    disabled={isLocked || currentQuestion === 0}
                    onClick={resetAnalysis}
                  >
                    🔄 Restart
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="analysis-btn review"
                    disabled={isLocked}
                    onClick={resetAnalysis}
                  >
                    🔍 Review Again
                  </button>
                  <button
                    className="analysis-btn complete"
                    disabled={isLocked}
                    onClick={handleSubmit}
                  >
                    ✅ {level.correct_action || "Complete Bonus Level"}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}
