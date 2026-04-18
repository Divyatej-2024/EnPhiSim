// Sections: imports, configuration, logic, render/exports

import express from 'express';
import { MongoClient } from 'mongodb';
import { validateActionPayload } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', validateActionPayload, async (req, res) => {
  let client;
  try {
    // FIX: Include is_correct from frontend
    const { 
      scenario_id, 
      user_action, 
      ml_predictions, 
      time_taken_seconds, 
      session_id,
      level,
      is_correct  // ADD THIS (it was missing!)
    } = req.body;
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(' Backend received action:', {
        scenario_id,
        user_action,
        is_correct_from_frontend: is_correct,
        session_id,
        level,
      });
    }
    
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');
    
    // Get the scenario for reference only (don't recalculate)
    const scenarios = database.collection('levelDataset');
    const scenario = await scenarios.findOne({ scenario_id });
    
    // USE the frontend's is_correct value
    const actionDoc = {
      scenario_id,
      user_action,
      is_correct: is_correct,  // Use frontend's value, don't recalculate
      ml_predictions,
      time_taken_seconds,
      session_id,
      level,
      timestamp: new Date(),
      correct_action: scenario?.correct_action,  // Store for reference
      // Debug fields to track what's happening
      frontend_correct: is_correct,
      backend_match: user_action === scenario?.correct_action
    };
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(' Saving to MongoDB:', {
        is_correct_saved: is_correct,
        backend_match: user_action === scenario?.correct_action,
      });
    }
    
    const insertResult = await actions.insertOne(actionDoc);

    const io = req.app.get('io');
    if (io) {
      io.to(`session:${session_id}`).emit('action:new', {
        action_id: insertResult.insertedId?.toString(),
        session_id,
        scenario_id,
        title: scenario?.title || 'Phishing Scenario',
        user_action,
        is_correct,
        timestamp: actionDoc.timestamp,
      });
    }
    
    // Return the frontend's correctness
    res.json({ 
      success: true, 
      correct: is_correct,
      message: is_correct ? 'Correct!' : 'Incorrect'
    });
    
  } catch (error) {
    logger.error('Action save failed', { message: error.message });
    res.status(500).json({
      success: false,
      error: 'Failed to save action',
    });
  } finally {
    if (client) await client.close();
  }
});

export default router;

