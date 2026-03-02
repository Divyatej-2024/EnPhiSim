// backend/routes/actions.js
const express = require('express');
const router = express.Router();
const Scenario = require('../models/Scenario');

// POST user action
router.post('/action', async (req, res) => {
  try {
    const { 
      scenario_id, 
      user_action, 
      ml_predictions,
      time_taken_seconds,
      session_id 
    } = req.body;
    
    // Find and update the scenario with user action
    const scenario = await Scenario.findOneAndUpdate(
      { scenario_id },
      {
        $set: {
          user_selected_action: user_action,
          timestamp: new Date(),
          ml_prediction_distilbert: ml_predictions?.distilbert?.prediction,
          ml_confidence_distilbert: ml_predictions?.distilbert?.confidence,
          ml_prediction_cnn: ml_predictions?.cnn?.prediction,
          ml_confidence_cnn: ml_predictions?.cnn?.confidence,
          time_taken: time_taken_seconds,
          session_id: session_id
        }
      },
      { new: true }
    );
    
    // Also save to analytics collection
    await db.collection('user_actions').insertOne({
      scenario_id,
      user_action,
      ml_predictions,
      time_taken_seconds,
      session_id,
      timestamp: new Date(),
      correct: user_action === scenario.correct_action
    });
    
    res.json({ 
      success: true, 
      correct: user_action === scenario.correct_action,
      scenario: scenario 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET analytics for dashboard
router.get('/analytics/:sessionId', async (req, res) => {
  try {
    const actions = await db.collection('user_actions')
      .find({ session_id: req.params.sessionId })
      .sort({ timestamp: -1 })
      .toArray();
    
    const total = actions.length;
    const correct = actions.filter(a => a.correct).length;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    
    res.json({
      session_id: req.params.sessionId,
      total_actions: total,
      correct_actions: correct,
      accuracy_percent: accuracy.toFixed(2),
      actions: actions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;