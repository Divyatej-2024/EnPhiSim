import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

router.post('/', async (req, res) => {
  let client;
  try {
    const { scenario_id, user_action, ml_predictions, time_taken_seconds, session_id, level } = req.body;
    
    console.log('📝 Saving action:', { scenario_id, user_action, session_id });
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');
    
    const actionDoc = {
      scenario_id,
      user_action,
      ml_predictions: ml_predictions || {},
      time_taken_seconds,
      session_id,
      level,
      timestamp: new Date()
    };
    
    await actions.insertOne(actionDoc);
    console.log('✅ Action saved');
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('❌ Action save error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;