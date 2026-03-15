// Sections: imports, configuration, logic, render/exports

import React, { useState } from "react";
import BaseLevel from "./BaseLevel";
import "./AnalysisLevel.css";

export default function AnalysisLevel({ scenario, onAction, locked }) {
  const [answers, setAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  if (!scenario) {
    console.error('AnalysisLevel: No scenario provided');
    return (
      <div className="error-container">
        <h3>Loading Analysis...</h3>
        <div className="spinner"></div>
      </div>
    );
  }

  console.log(' AnalysisLevel rendering:', {
    id: scenario.scenario_id,
    title: scenario.title,
    type: scenario.template
  });

  // Questions from scenario or defaults
  const questions = scenario.questions || [
    {
      id: 1,
      text: "What type of phishing attack is this?",
      options: ["Credential Phishing", "Spear Phishing", "Whaling", "Vishing"]
    },
    {
      id: 2,
      text: "What is the main red flag in this email?",
      options: ["Suspicious sender", "Urgent language", "Suspicious link", "All of the above"]
    },
    {
      id: 3,
      text: "What should you do with this email?",
      options: ["Report it", "Delete it", "Ignore it", "Forward to IT"]
    }
  ];

  return (
    <BaseLevel 
      levelType="analysis" 
      scenario={scenario} 
      onAction={onAction} 
      locked={locked}
    >
      {({ onAction: baseOnAction, locked: isLocked }) => {
        
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
          baseOnAction(scenario.correct_action || "Complete Analysis", { 
            answers,
            completed: true,
            scenario_id: scenario.scenario_id
          });
        };

        const handleSkip = () => {
          baseOnAction(scenario.neutral_action || "Skip", { 
            skipped: true,
            scenario_id: scenario.scenario_id
          });
        };

        return (
          <div className="analysis-container">
            <div className="analysis-header">
              <h2>{scenario.title || "Bonus Analysis"}</h2>
              <p className="analysis-description">{scenario.content}</p>
              <div className="bonus-badge"> BONUS LEVEL</div>
            </div>

            <div className="analysis-content">
              {scenario.body_html && (
                <div 
                  className="analysis-html"
                  dangerouslySetInnerHTML={{ __html: scenario.body_html }} 
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
                        disabled={isLocked || locked}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="analysis-complete">
                  <h3>Analysis Complete!</h3>
                  <p>You've analyzed this phishing attempt.</p>
                  
                  {scenario.has_attachment && (
                    <div className="worksheet-download">
                      <p> Download your analysis worksheet:</p>
                      <div className="attachment">
                         phishing_worksheet.pdf
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="analysis-actions">
              {!completed ? (
                <button
                  className="analysis-btn skip"
                  disabled={isLocked || locked}
                  onClick={handleSkip}
                >
                  {scenario.neutral_action || "Skip Analysis"}
                </button>
              ) : (
                <button
                  className="analysis-btn complete"
                  disabled={isLocked || locked}
                  onClick={handleSubmit}
                >
                  {scenario.correct_action || "Complete Bonus Level"}
                </button>
              )}
            </div>
          </div>
        );
      }}
    </BaseLevel>
  );
}

