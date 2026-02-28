import express from 'express';
import UserAction from '../models/UserAction.js';

const router = express.Router();

router.get('/:sessionId', async (req, res) => {
  try {
    const sessionId = req.params.sessionId;
    const timeRange = req.query.range || 'week';

    if (!sessionId || sessionId.length < 10) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    const allowedRanges = ['today', 'week', 'month'];
    if (!allowedRanges.includes(timeRange)) {
      return res.status(400).json({ error: 'Invalid time range' });
    }

    const now = new Date();
    let startDate = null;

    if (timeRange === 'today') {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    }

    if (timeRange === 'week') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    if (timeRange === 'month') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    const query = {
      session_id: sessionId,
      timestamp: { $exists: true }
    };

    if (startDate) {
      query.timestamp = { $gte: startDate };
    }

    const userActions = await UserAction.find(query)
      .sort({ timestamp: -1 })
      .lean();

    const total = userActions.length;

    if (total === 0) {
      return res.json({
        session_id: sessionId,
        total_actions: 0,
        message: "No data available for selected range."
      });
    }

    let correctCount = 0;
    let trust = 0;
    let ignore = 0;
    let report = 0;
    let distilCorrect = 0;
    let distilTotal = 0;
    let cnnCorrect = 0;
    let cnnTotal = 0;
    let totalTime = 0;

    const taxonomyStats = {};

    for (const a of userActions) {
      if (a.correct) correctCount++;

      if (a.user_action === 'Trust & Click') trust++;
      if (a.user_action === 'Ignore') ignore++;
      if (a.user_action === 'Report Phish') report++;

      totalTime += a.time_taken_seconds || 0;

      const expected =
        a.correct_action === 'Report Phish'
          ? 'phishing'
          : 'legitimate';

      if (a.ml_predictions?.distilbert?.prediction) {
        distilTotal++;
        if (a.ml_predictions.distilbert.prediction === expected) {
          distilCorrect++;
        }
      }

      if (a.ml_predictions?.cnn?.prediction) {
        cnnTotal++;
        if (a.ml_predictions.cnn.prediction === expected) {
          cnnCorrect++;
        }
      }

      const type = a.taxonomy || 'Credential Phishing';
      if (!taxonomyStats[type]) {
        taxonomyStats[type] = { total: 0, correct: 0 };
      }

      taxonomyStats[type].total++;
      if (a.correct) taxonomyStats[type].correct++;
    }

    const accuracy = ((correctCount / total) * 100).toFixed(2);
    const avgTime = (totalTime / total).toFixed(2);

    const mlPerformance = {
      distilbert: {
        accuracy: distilTotal > 0
          ? ((distilCorrect / distilTotal) * 100).toFixed(2)
          : 0,
        total: distilTotal
      },
      cnn: {
        accuracy: cnnTotal > 0
          ? ((cnnCorrect / cnnTotal) * 100).toFixed(2)
          : 0,
        total: cnnTotal
      }
    };

    const weaknesses = Object.entries(taxonomyStats)
      .map(([type, stats]) => {
        const typeAccuracy = (stats.correct / stats.total) * 100;
        return {
          type,
          accuracy: typeAccuracy.toFixed(2),
          attempts: stats.total,
          tip: getTipForType(type)
        };
      })
      .filter(w => w.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);

    res.json({
      session_id: sessionId,
      total_actions: total,
      correct_actions: correctCount,
      accuracy_percent: accuracy,
      average_response_time_seconds: avgTime,
      action_distribution: { trust, ignore, report },
      ml_performance: mlPerformance,
      weaknesses,
      recent_actions: userActions.slice(0, 10)
    });

  } catch (error) {
    console.error("Analytics Route Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function getTipForType(type) {
  const tips = {
    'Credential Phishing': 'Verify URLs before entering credentials.',
    'Spear Phishing': 'Confirm unusual requests through alternative channels.',
    'Whaling': 'High-value requests require secondary approval.',
    'Smishing': 'Avoid clicking links in SMS messages.',
    'Vishing': 'Call official numbers, not the one provided.',
    'Pharming': 'Check for HTTPS and certificate validity.',
    'Clone Phishing': 'Compare with previous legitimate messages.',
    'Angler Phishing': 'Avoid support via social media DMs.',
    'Pop-up Phishing': 'Ignore pop-up warnings and scan device.',
    'Search Phishing': 'Inspect sponsored search result URLs carefully.',
    'Man-in-the-Middle': 'Avoid sensitive actions on public WiFi.',
    'Malvertising': 'Use ad blockers and avoid suspicious downloads.'
  };

  return tips[type] || 'When in doubt, report it.';
}

export default router;