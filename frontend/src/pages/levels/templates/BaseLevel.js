// Sections: imports, configuration, logic, render/exports


// frontend/src/pages/levels/templates/BaseLevel.js
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../level.css";

function toKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function inferCorrectness(level, action, metadata) {
  // Direct comparison with your data structure
  if (level?.correct_action) {
    return action === level.correct_action;
  }
  
  if (typeof metadata?.correct === "boolean") return metadata.correct;

  const normalizeTokens = (value) =>
    toKey(value)
      .split("_")
      .filter(Boolean);

  const canonicalAction = (value) => {
    const key = toKey(value);

    if (/(report|flag|phish)/.test(key)) return "report";
    if (/(mark_safe|safe|legitimate|false_positive)/.test(key)) return "safe";
    if (/(delete|trash|remove)/.test(key)) return "delete";
    if (/(ignore|dismiss)/.test(key)) return "ignore";
    if (/(close|exit)/.test(key)) return "close";
    if (/(block|ban)/.test(key)) return "block";
    if (/(investigate|review|analyze)/.test(key)) return "investigate";
    if (/(escalate|authorit)/.test(key)) return "report";

    return key;
  };

  const actionKey = canonicalAction(action);
  const actionTokens = new Set(normalizeTokens(action));
  const candidates = [
    level?.correct_action,
    level?.correct_option,
    level?.answer,
  ]
    .filter(Boolean)
    .map((item) => ({
      raw: item,
      key: toKey(item),
      canonical: canonicalAction(item),
      tokens: new Set(normalizeTokens(item)),
    }));

  return candidates.some((candidate) => {
    if (candidate.key === actionKey || candidate.canonical === actionKey) return true;
    if (candidate.key.includes(actionKey) || actionKey.includes(candidate.key)) return true;

    let overlap = 0;
    for (const token of actionTokens) {
      if (candidate.tokens.has(token)) overlap += 1;
    }
    return overlap > 0;
  });
}

function createMlInputText(level, action) {
  // Enhanced to use ALL your rich data fields
  const parts = [
    `TITLE: ${level?.title || ''}`,
    `CONTENT: ${level?.content || level?.level_text || ''}`,
    `BODY: ${level?.body_text || ''}`,
    `FROM: ${level?.from_address || ''}`,
    `REPLY-TO: ${level?.reply_to || ''}`,
    `TO: ${level?.to_address || ''}`,
    `PHISH TYPE: ${level?.taxonomy || ''}`,
    `CATEGORY: ${level?.category || ''}`,
    `LINKS: ${level?.links?.join(', ') || 'none'}`,
    `ATTACHMENT: ${level?.has_attachment ? 'yes' : 'no'}`,
    `USER ACTION: ${action}`,
  ].filter(Boolean);

  return parts.join("\n");
}

export default function BaseLevel({ children, levelType, scenario, onAction, customStyles }) {
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    details: null,
    isCorrect: false,
    mlPrediction: null,
    mlConfidence: null,
  });

  const currentLevel = scenario || null;

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUserAction = useCallback(
    async (action, metadata = {}) => {
      if (locked || !currentLevel) return;
      setLocked(true);

      try {
        // Determine correctness using your data
        const isCorrect = inferCorrectness(currentLevel, action, metadata);
        const levelId = currentLevel.level_no || currentLevel.Level_no || currentLevel.id;
        
        // Create rich ML text from your data
        const mlText = createMlInputText(currentLevel, action);
        


        // Call parent onAction with ALL data
        if (onAction) {
          await onAction(action, {
            levelId,
            isCorrect,
            metadata,
            scenario: currentLevel,
            mlText
          });
        }

        // Create feedback message using your data
        const feedbackMessage = isCorrect
          ? currentLevel.success_message || `Correct. ${currentLevel.correct_action} was the right choice.`
          : currentLevel.failure_message || `Incorrect. The correct action was: ${currentLevel.correct_action}`;

        const feedbackDetails = currentLevel.hint || 
                               currentLevel.explanation || 
                               `This is a ${currentLevel.taxonomy || 'phishing'} attack. ` +
                               `Look for: spoofed sender (${currentLevel.reply_to !== currentLevel.crct_mail ? 'reply-to mismatch' : ''})`;

        setDialog({
          show: true,
          title: isCorrect ? "Correct" : "Incorrect",
          message: feedbackMessage,
          details: feedbackDetails,
          isCorrect,
          mlPrediction: null, // Will be filled by parent when ML is ready
          mlConfidence: null,
        });

        // Auto-close dialog and unlock
        setTimeout(() => {
          setDialog(prev => ({ ...prev, show: false }));
          setLocked(false);
          
          // Navigate if correct (optional - adjust based on your flow)
          if (isCorrect && onAction) {
            // Navigation handled by parent
          }
        }, 2000);

      } catch (err) {
        console.error("Action error:", err);
        setDialog({
          show: true,
          title: "Error",
          message: "Something went wrong. Please try again.",
          details: null,
          isCorrect: false,
          mlPrediction: null,
          mlConfidence: null,
        });
        setLocked(false);
      }
    },
    [locked, currentLevel, onAction]
  );

  const closeDialog = () => setDialog((prev) => ({ ...prev, show: false }));

  if (!currentLevel) {
    return (
      <div className="error-container">
        <h3>No Level Available</h3>
        <p>Unable to render this level right now.</p>
        <button onClick={() => navigate("/dashboard")}>Return to Dashboard</button>
      </div>
    );
  }

  const renderChildren = () => {
    if (!children) return <div>No template provided</div>;

    if (typeof children === "function") {
      return children({
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel,
        now,
      });
    }

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel,
        now,
      });
    }

    return <div>Invalid template format</div>;
  };

  return (
    <div className={`level-container ${levelType}-level`} style={customStyles}>
      <div className="level-content">{renderChildren()}</div>

      {dialog.show && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className={`dialog-box ${dialog.isCorrect ? "correct" : "incorrect"}`}>
            <div className={`dialog-status-animation ${dialog.isCorrect ? "correct" : "incorrect"}`} aria-hidden="true">
              <span className="dialog-status-ring" />
              <span className="dialog-status-core" />
              <span className="dialog-status-wave" />
            </div>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            {dialog.details && (
              <div className="dialog-details">
                <small>{dialog.details}</small>
              </div>
            )}
            {dialog.mlPrediction && (
              <div className="dialog-details">
                <small>
                  ML Detection: {dialog.mlPrediction}
                  {typeof dialog.mlConfidence === "number"
                    ? ` (${Math.round(dialog.mlConfidence * 100)}% confidence)`
                    : ""}
                </small>
              </div>
            )}
            <button className="dialog-button" onClick={closeDialog} autoFocus>
              {dialog.isCorrect ? "Continue" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
