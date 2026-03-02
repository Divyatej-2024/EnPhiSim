import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

router.get('/:sessionId', async (req, res) => {
  let client;
  try {
    const sessionId = req.params.sessionId;
    const timeRange = req.query.range || 'week';
    
    console.log('📊 Analytics for:', sessionId);
    
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    
    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');
    
    // Date filter
    const dateFilter = {};
    const now = new Date();
    if (timeRange === 'today') {
      dateFilter.$gte = new Date(now.setHours(0,0,0,0));
    } else if (timeRange === 'week') {
      dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    const userActions = await actions.find({
      session_id: sessionId,
      timestamp: { $exists: true }
    }).sort({ timestamp: -1 }).toArray();
    
    const total = userActions.length;
    const correct = userActions.filter(a => a.is_correct).length;
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
    
    res.json({
      session_id: sessionId,
      total_actions: total,
      correct_actions: correct,
      accuracy_percent: accuracy,
      recent_actions: userActions.slice(0, 10)
    });
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;