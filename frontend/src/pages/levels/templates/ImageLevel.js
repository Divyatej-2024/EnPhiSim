// Sections: imports, configuration, logic, render/exports

import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./AnalysisLevel.css";

export default function AnalysisLevel({ level: scenario, onAction, locked }) {
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!scenario) {
    console.error('AnalysisLevel: No scenario provided');
    return <div>Error: No level data</div>;
  }

  // Sample questions for bonus levels
  const questions = [
    {
      id: 1,
      text: "What animal behavior does this phishing attack mimic?",
      options: ["Anglerfish", "Porcupine", "Mockingbird", "Cuckoo"]
    },
    {
      id: 2,
      text: "What type of lure is being used in this attack?",
      options: ["Financial", "Security", "Emotional", "Package Delivery"]
    },
    {
      id: 3,
      text: "What is the best defense against this type of attack?",
      options: ["Verify with sender", "Click the link", "Download attachment", "Forward to friends"]
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
        // All component logic MUST be INSIDE this function
        
        const handleAnswer = (answer) => {
          const newAnswers = { ...answers, [currentQuestion]: answer };
          setAnswers(newAnswers);
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            setCompleted(true);
          }
        };

        const handleSubmit = () => {
          // Submit analysis results
          handleAction(level.correct_action || "Complete Analysis", { 
            answers,
            completed: true 
          });
        };

        return (
          <div className="analysis-container">
            <div className="analysis-header">
              <h2>{level.title || "Bonus Analysis"}</h2>
              <p className="analysis-description">{level.content}</p>
              <div className="bonus-badge"> BONUS LEVEL</div>
            </div>

            <div className="analysis-content">
              {/* Educational content from body_html */}
              {level.body_html && (
                <div 
                  className="analysis-html"
                  dangerouslySetInnerHTML={{ __html: level.body_html }} 
                />
              )}

              {!completed ? (
                <div className="analysis-questions">
                  <h3>Question {currentQuestion + 1} of {questions.length}</h3>
                  <p className="question-text">{questions[currentQuestion].text}</p>
                  
                  <div className="options-grid">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        className="analysis-option"
                        onClick={() => handleAnswer(option)}
                        disabled={isLocked}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="analysis-complete">
                  <h3>Analysis Complete!</h3>
                  <p>You've completed the bonus analysis.</p>
                  
                  {level.attachments && level.attachments.length > 0 && (
                    <div className="worksheet-download">
                      <p>Download your worksheet:</p>
                      {level.attachments.map((att, idx) => (
                        <div key={idx} className="attachment">
                           {att.name} ({att.size})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="analysis-actions">
              {!completed ? (
                <button
                  className="analysis-btn skip"
                  disabled={isLocked}
                  onClick={() => handleAction(level.neutral_action || "Skip", { skipped: true })}
                >
                  {level.neutral_action || "Skip Analysis"}
                </button>
              ) : (
                <button
                  className="analysis-btn complete"
                  disabled={isLocked}
                  onClick={handleSubmit}
                >
                  {level.correct_action || "Complete Bonus Level"}
                </button>
              )}
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}

