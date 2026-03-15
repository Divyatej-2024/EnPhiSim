// Sections: imports, configuration, logic, render/exports

import express from 'express';
import { MongoClient } from 'mongodb';
import { validateSessionIdParam } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.get('/:sessionId', validateSessionIdParam, async (req, res) => {
  let client;
  try {
    const sessionId = req.params.sessionId;
    const timeRange = req.query.range || 'week';

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI not set');
    }

    client = new MongoClient(uri);
    await client.connect();

    const database = client.db('EnPhiSimdb');
    const actions = database.collection('user_actions');

    const dateFilter = {};
    const now = new Date();
    if (timeRange === 'today') {
      dateFilter.$gte = new Date(now.setHours(0, 0, 0, 0));
    } else if (timeRange === 'week') {
      dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
    }

    const query = {
      session_id: sessionId,
      timestamp: { $exists: true },
    };

    if (Object.keys(dateFilter).length > 0) {
      query.timestamp = dateFilter;
    }

    const userActions = await actions.find(query).sort({ timestamp: -1 }).toArray();

    const total = userActions.length;
    const correct = userActions.filter((a) => a.is_correct).length;
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;

    // âœ… FIX: Wrap response in success: true, data: {}
    res.json({
      success: true,
      data: {
        session_id: sessionId,
        total_actions: total,
        correct_actions: correct,
        accuracy_percent: accuracy,
        recent_actions: userActions.slice(0, 10).map(action => ({
          title: action.title || 'Phishing Scenario',
          user_action: action.user_action,
          is_correct: action.is_correct,
          timestamp: action.timestamp
        }))
      }
    });
    
  } catch (error) {
    logger.error('Analytics query failed', { message: error.message });
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'ANALYTICS_ERROR',
        message: 'Failed to load analytics' 
      }
    });
  } finally {
    if (client) await client.close();
  }
});

export default router;
