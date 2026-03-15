// Sections: imports, configuration, logic, render/exports

import express from 'express';
import { MongoClient } from 'mongodb';
import { validateActionPayload } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', validateActionPayload, async (req, res) => {
  let client;
  try {
    // âœ… FIX: Include is_correct from frontend
    const { 
      scenario_id, 
      user_action, 
      ml_predictions, 
      time_taken_seconds, 
      session_id,
      level,
      is_correct  // â† ADD THIS (it was missing!)
    } = req.body;
    
    console.log('ðŸ“¥ Backend received action:', {  // Add debug log
      scenario_id,
      user_action,
      is_correct_from_frontend: is_correct,
      session_id,
      level
    });
    
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');
    
    // Get the scenario for reference only (don't recalculate)
    const scenarios = database.collection('levelDataset');
    const scenario = await scenarios.findOne({ scenario_id });
    
    // âœ… USE the frontend's is_correct value
    const actionDoc = {
      scenario_id,
      user_action,
      is_correct: is_correct,  // â† Use frontend's value, don't recalculate
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
    
    console.log('ðŸ’¾ Saving to MongoDB:', {
      is_correct_saved: is_correct,
      backend_match: user_action === scenario?.correct_action
    });
    
    await actions.insertOne(actionDoc);
    
    // âœ… Return the frontend's correctness
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
