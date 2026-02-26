import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../../../context/ProgressContext";
import "../../../level.css";

export default function BaseLevel({ 
  children, 
  levelType,
  onAction,
  customStyles 
}) {
  const { recordAction, completeLevel } = useProgress();
  const navigate = useNavigate();
  
  const [levels, setLevels] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locked, setLocked] = useState(false);
  const [dialog, setDialog] = useState({
    show: false,
    title: "",
    message: "",
    details: null
  });

  // Real-time level fetching with HTTP only (WebSocket optional)
  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function fetchLevels() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/levels?type=${levelType}&timestamp=${Date.now()}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        
        if (mounted) {
          const levelsArray = Array.isArray(data) ? data : data.levels || [];
          setLevels(levelsArray);
          setLoading(false);
          
          // Emit real-time event
          window.dispatchEvent(new CustomEvent('levelsLoaded', { 
            detail: { count: levelsArray.length, type: levelType }
          }));
        }
      } catch (err) {
        console.error(`Error fetching levels (attempt ${retryCount + 1}):`, err);
        
        if (retryCount < maxRetries && mounted) {
          retryCount++;
          setTimeout(fetchLevels, 2000 * retryCount);
        } else if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    fetchLevels();

    return () => {
      mounted = false;
    };
  }, [levelType]);

  const currentLevel = levels[currentIndex];

  const handleUserAction = useCallback(async (action, metadata = {}) => {
    if (locked || !currentLevel) return;
    setLocked(true);

    try {
      const isCorrect = action === currentLevel.correct_action;
      
      // Record action with real-time data
      const actionRecord = {
        level_id: currentLevel.id,
        level_no: currentLevel.level_no,
        title: currentLevel.page_title,
        category: currentLevel.category,
        taxonomy: currentLevel.taxonomy,
        difficulty: currentLevel.difficulty,
        template_type: currentLevel.template_type,
        user_action: action,
        correct_action: currentLevel.correct_action,
        result: isCorrect ? "correct" : "incorrect",
        timestamp: new Date().toISOString(),
        ...metadata
      };

      await recordAction(currentLevel.id, actionRecord);
      
      if (isCorrect) {
        await completeLevel(currentLevel.id);
      }

      // Show real-time feedback
      setDialog({
        show: true,
        title: isCorrect ? "Correct!" : "Incorrect!",
        message: isCorrect 
          ? currentLevel.success_message || "Great job! You made the right choice."
          : currentLevel.failure_message || "This action could be risky. Try again!",
        details: currentLevel.hint,
        isCorrect
      });

      if (onAction) {
        onAction({
          level: currentLevel,
          action,
          isCorrect
        });
      }

      // Auto-advance if correct
      if (isCorrect) {
        setTimeout(() => {
          if (currentIndex < levels.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setLocked(false);
          } else {
            navigate("/thankyou");
          }
        }, 1500);
      } else {
        setTimeout(() => setLocked(false), 2000);
      }

    } catch (err) {
      console.error("Action error:", err);
      setDialog({
        show: true,
        title: "Error",
        message: "Something went wrong. Please try again.",
        isCorrect: false
      });
      setLocked(false);
    }
  }, [currentLevel, locked, currentIndex, levels.length, navigate, onAction, recordAction, completeLevel]);

  const closeDialog = () => {
    setDialog(prev => ({ ...prev, show: false }));
  };

  // Function to render children properly
  const renderChildren = () => {
    if (!children) {
      return <div>No template provided</div>;
    }

    // If children is a function, call it with props
    if (typeof children === 'function') {
      return children({
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel
      });
    }

    // If children is a valid React element, clone it with props
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel
      });
    }

    // If it's a component type (not an instance), create it with props
    if (typeof children === 'object' && children.$$typeof === Symbol.for('react.element')) {
      return React.cloneElement(children, {
        level: currentLevel,
        onAction: handleUserAction,
        locked,
        currentLevel
      });
    }

    console.error('BaseLevel: Invalid children provided', children);
    return <div>Invalid template format</div>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading real-time scenario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Retry Connection
        </button>
      </div>
    );
  }

  if (!currentLevel) {
    return (
      <div className="error-container">
        <h3>No Levels Available</h3>
        <p>No levels found for type: {levelType}</p>
        <button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={`level-container ${levelType}-level`} style={customStyles}>
      {/* Progress indicator */}
      <div className="level-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentIndex + 1) / levels.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          Level {currentIndex + 1} of {levels.length}
        </span>
      </div>

      {/* Main content */}
      <div className="level-content">
        {renderChildren()}
      </div>

      {/* Real-time feedback dialog */}
      {dialog.show && (
        <div className="dialog-overlay" onClick={closeDialog}>
          <div className={`dialog-box ${dialog.isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>{dialog.title}</h3>
            <p>{dialog.message}</p>
            {dialog.details && (
              <div className="dialog-details">
                <small>{dialog.details}</small>
              </div>
            )}
            <button 
              className="dialog-button"
              onClick={closeDialog}
              autoFocus
            >
              {dialog.isCorrect ? 'Continue ->' : 'Try Again'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
