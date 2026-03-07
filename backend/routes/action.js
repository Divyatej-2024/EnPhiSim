// backend/routes/action.js
import express from 'express';
import { MongoClient } from 'mongodb';
import { validateActionPayload } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/', validateActionPayload, async (req, res) => {
  let client;
  try {
    const { 
      scenario_id, 
      user_action, 
      ml_predictions, 
      time_taken_seconds, 
      session_id,
      level 
    } = req.body;
    
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');
    
    // Get the scenario to check correct answer
    const scenarios = database.collection('levelDataset');
    const scenario = await scenarios.findOne({ scenario_id });
    
    const isCorrect = user_action === scenario?.correct_action;
    
    const actionDoc = {
      scenario_id,
      user_action,
      is_correct: isCorrect,
      ml_predictions,
      time_taken_seconds,
      session_id,
      level,
      timestamp: new Date(),
      correct_action: scenario?.correct_action
    };
    
    await actions.insertOne(actionDoc);
    
    res.json({ 
      success: true, 
      correct: isCorrect,
      message: isCorrect ? 'Correct!' : 'Incorrect'
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
