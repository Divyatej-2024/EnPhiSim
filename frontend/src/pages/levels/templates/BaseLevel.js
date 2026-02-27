import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import { sendUserAction } from "../../../api";
import "../../../level.css";

function toKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function inferCorrectness(level, action, metadata) {
  if (typeof metadata?.correct === "boolean") return metadata.correct;

  const actionKey = toKey(action);
  const candidates = [
    level?.correct_action,
    level?.correct_option,
    level?.answer,
  ]
    .filter(Boolean)
    .map(toKey);

  return candidates.includes(actionKey);
}

function getClientUserId() {
  try {
    const key = "enphisim-user-id";
    const saved = localStorage.getItem(key);
    if (saved) return saved;

    const generated = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, generated);
    return generated;
  } catch (err) {
    return "anonymous";
  }
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
  });

  const currentLevel = scenario || null;

  const handleUserAction = useCallback(
    async (action, metadata = {}) => {
      if (locked || !currentLevel) return;
      setLocked(true);

      try {
        const isCorrect = inferCorrectness(currentLevel, action, metadata);
        const levelId = currentLevel.level_no || currentLevel.Level_no || currentLevel.id;

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
          ...metadata,
        };

        await recordAction(levelId, actionRecord);

        void sendUserAction({
          userId: getClientUserId(),
          levelId: levelId,
          action: action,
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
            <button className="dialog-button" onClick={closeDialog} autoFocus>
              {dialog.isCorrect ? "Continue ->" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
