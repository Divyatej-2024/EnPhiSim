import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

router.get('/:sessionId', async (req, res) => {
  let client;
  try {
    const sessionId = req.params.sessionId;
    const timeRange = req.query.range || 'week';
    
    console.log('📊 Analytics requested for:', sessionId);
    
    const uri = process.env.MONGODB_URI;
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
    
    console.log(`Found ${userActions.length} actions for session`);
    
    // If no actions, return empty structure
    if (userActions.length === 0) {
      return res.json({
        session_id: sessionId,
        total_actions: 0,
        correct_actions: 0,
        accuracy_percent: 0,
        action_distribution: { trust: 0, ignore: 0, report: 0 },
        recent_actions: []
      });
    }
    
    // Calculate stats
    const total = userActions.length;
    const correct = userActions.filter(a => a.is_correct).length;
    const accuracy = ((correct / total) * 100).toFixed(2);
    
    const actionDist = {
      trust: userActions.filter(a => a.user_action === 'Trust & Click').length,
      ignore: userActions.filter(a => a.user_action === 'Ignore').length,
      report: userActions.filter(a => a.user_action === 'Report Phish').length
    };
    
    res.json({
      session_id: sessionId,
      total_actions: total,
      correct_actions: correct,
      accuracy_percent: accuracy,
      action_distribution: actionDist,
      recent_actions: userActions.slice(0, 10).map(a => ({
        timestamp: a.timestamp,
        taxonomy: a.taxonomy || 'Unknown',
        user_action: a.user_action,
        correct_action: a.correct_action,
        is_correct: a.is_correct
      }))
    });
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

export default router;