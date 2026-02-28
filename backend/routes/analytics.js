// backend/routes/analytics.js - ES Module version
import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

// Get analytics for a session
router.get('/:sessionId', async (req, res) => {
  let client;
  try {
    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    const database = client.db('enphisim');
    const actions = database.collection('user_actions');
    
    const sessionId = req.params.sessionId;
    const timeRange = req.query.range || 'week';
    
    // Calculate date filter
    const dateFilter = {};
    const now = new Date();
    if (timeRange === 'today') {
      dateFilter.$gte = new Date(now.setHours(0,0,0,0));
    } else if (timeRange === 'week') {
      dateFilter.$gte = new Date(now.setDate(now.getDate() - 7));
    } else if (timeRange === 'month') {
      dateFilter.$gte = new Date(now.setMonth(now.getMonth() - 1));
    }
    
    // Get all actions for session
    const userActions = await actions.find({
      session_id: sessionId,
      timestamp: { $exists: true }
    }).sort({ timestamp: -1 }).toArray();
    
    // Calculate basic stats
    const total = userActions.length;
    const correct = userActions.filter(a => a.correct).length;
    const accuracy = total > 0 ? ((correct / total) * 100).toFixed(2) : 0;
    
    // Calculate action distribution
    const actionDist = {
      trust: userActions.filter(a => a.user_action === 'Trust & Click').length,
      ignore: userActions.filter(a => a.user_action === 'Ignore').length,
      report: userActions.filter(a => a.user_action === 'Report Phish').length
    };
    
    // Calculate ML performance
    const mlPerf = {
      distilbert: {
        correct: userActions.filter(a => {
          const mlPred = a.ml_predictions?.distilbert?.prediction;
          const correctAction = a.correct_action;
          const expected = correctAction === 'Report Phish' ? 'phishing' : 'legitimate';
          return mlPred === expected;
        }).length,
        total: userActions.filter(a => a.ml_predictions?.distilbert?.prediction).length
      },
      cnn: {
        correct: userActions.filter(a => {
          const mlPred = a.ml_predictions?.cnn?.prediction;
          const correctAction = a.correct_action;
          const expected = correctAction === 'Report Phish' ? 'phishing' : 'legitimate';
          return mlPred === expected;
        }).length,
        total: userActions.filter(a => a.ml_predictions?.cnn?.prediction).length
      }
    };
    
    // Calculate trend data
    const trend = [];
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();
    
    for (const date of last7Days) {
      const dayActions = userActions.filter(a => {
        const ts = a.timestamp;
        return ts && new Date(ts).toISOString().split('T')[0] === date;
      });
      const dayCorrect = dayActions.filter(a => a.correct).length;
      trend.push({
        date,
        accuracy: dayActions.length > 0 ? 
          ((dayCorrect / dayActions.length) * 100).toFixed(2) : 0,
        avg_accuracy: 65 + Math.random() * 10
      });
    }
    
    // Identify weaknesses
    const weaknesses = [];
    const phishingTypes = [...new Set(userActions.map(a => a.taxonomy || 'Credential Phishing'))];
    
    for (const type of phishingTypes) {
      const typeActions = userActions.filter(a => (a.taxonomy || 'Credential Phishing') === type);
      const typeCorrect = typeActions.filter(a => a.correct).length;
      const typeAccuracy = (typeCorrect / typeActions.length) * 100;
      
      if (typeAccuracy < 70) {
        weaknesses.push({
          type,
          accuracy: typeAccuracy.toFixed(2),
          attempts: typeActions.length,
          tip: getTipForType(type, typeAccuracy)
        });
      }
    }
    
    res.json({
      session_id: sessionId,
      total_actions: total,
      correct_actions: correct,
      accuracy_percent: accuracy,
      action_distribution: actionDist,
      ml_performance: mlPerf,
      trend,
      weaknesses: weaknesses.sort((a, b) => a.accuracy - b.accuracy).slice(0, 4),
      recent_actions: userActions.slice(0, 10).map(a => ({
        ...a,
        timestamp: a.timestamp,
        taxonomy: a.taxonomy || 'Credential Phishing',
        user_action: a.user_action,
        correct_action: a.correct_action,
        correct: a.correct,
        ml_distilbert: a.ml_predictions?.distilbert,
        ml_cnn: a.ml_predictions?.cnn,
        time_taken: a.time_taken_seconds
      }))
    });
    
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) await client.close();
  }
});

function getTipForType(type, accuracy) {
  const tips = {
    'Credential Phishing': 'Always check the URL before entering passwords. Look for HTTPS and correct domain.',
    'Spear Phishing': 'Verify unusual requests through a different channel (call the person directly).',
    'Whaling': 'Executives should have additional verification steps for financial requests.',
    'Smishing': 'Never click links in text messages. Go directly to the website.',
    'Vishing': 'Hang up and call back on official numbers. Scammers create urgency.',
    'Pharming': 'Check for HTTPS and certificate errors. Use DNS security tools.',
    'Clone Phishing': 'Compare suspicious emails with previous legitimate ones. Look for slight differences.',
    'Angler Phishing': 'Only use official support channels from the company website, not social media DMs.',
    'Pop-up Phishing': 'Never call numbers in pop-ups. Use built-in security tools instead.',
    'Search Phishing': 'Check URLs carefully in sponsored results. Advertisers can fake anything.',
    'Man-in-the-Middle': 'Avoid sensitive transactions on public WiFi. Use VPN.',
    'Malvertising': 'Use ad blockers. Never click "Download" buttons on untrusted sites.'
  };
  
  return tips[type] || 'When in doubt, report it. Better safe than sorry.';
}

export default router;