import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { getPrediction, sendUserAction } from "../../../api";
import { getClientUserId } from "../../../utils/userIdentity";
import "../../../level.css";

function toKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function inferCorrectness(level, action, metadata) {
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
  const parts = [
    level?.page_title,
    level?.level_text || level?.content,
    level?.subj || level?.email_subject,
    level?.phish_email || level?.from_and_to,
    level?.suspicious_url || level?.url,
    `User action: ${action}`,
  ].filter(Boolean);

  return parts.join("\n");
}

export default function BaseLevel({ children, levelType, scenario, onAction, customStyles }) {
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();
  const [locked, setLocked] = useState(false);
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

  const handleUserAction = useCallback(
    async (action, metadata = {}) => {
      if (locked || !currentLevel) return;
      setLocked(true);

      try {
        const isCorrect = inferCorrectness(currentLevel, action, metadata);
        const levelId = currentLevel.level_no || currentLevel.Level_no || currentLevel.id;
        const userId = getClientUserId();
        const mlText = createMlInputText(currentLevel, action);
        let mlResult = null;

        try {
          mlResult = await getPrediction({
            userId,
            levelId,
            text: mlText,
          });
        } catch (mlErr) {
          console.warn("ML prediction unavailable:", mlErr?.message || mlErr);
        }

        const actionRecord = {
          level_id: currentLevel.id,
          level_no: currentLevel.level_no || currentLevel.Level_no,
          title: currentLevel.page_title,
          category: currentLevel.category,
          template_type: currentLevel.template_type || levelType,
          user_action: action,
          correct_action: currentLevel.correct_action || currentLevel.correct_option,
          result: isCorrect ? "correct" : "incorrect",
          timestamp: new Date().toISOString(),
          ml_prediction: mlResult?.prediction ?? null,
          ml_confidence: mlResult?.confidence ?? null,
          ml_probabilities: mlResult?.probabilities ?? null,
          ...metadata,
        };

        await recordAction(levelId, actionRecord);

        void sendUserAction({
          userId,
          levelId: levelId,
          action: action,
          actionText: mlText,
          mlPrediction: mlResult?.prediction ?? null,
          mlConfidence: mlResult?.confidence ?? null,
          ...metadata,
        }).catch((err) => {
          console.warn("Failed to send action to backend:", err?.message || err);
        });

        if (isCorrect) {
          await completeLevel(levelId);
        }

        setDialog({
          show: true,
          title: isCorrect ? "Correct!" : "Incorrect!",
          message: isCorrect
            ? currentLevel.success_message || "Great job! You made the right choice."
            : currentLevel.failure_message || "This action could be risky. Try again!",
          details: currentLevel.hint || currentLevel.Hint || null,
          isCorrect,
          mlPrediction: mlResult?.prediction ?? null,
          mlConfidence: mlResult?.confidence ?? null,
        });

        if (onAction) {
          onAction({ level: currentLevel, action, isCorrect });
        }

        setTimeout(() => {
          if (isCorrect) {
            const isFinal = toKey(currentLevel.category) === "final";
            navigate(isFinal ? "/thankyou" : "/dashboard");
          }
          setLocked(false);
        }, isCorrect ? 1000 : 1500);
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
    [locked, currentLevel, levelType, navigate, onAction, recordAction, completeLevel]
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
      });
    }

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel,
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
              {dialog.isCorrect ? "Continue ->" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
