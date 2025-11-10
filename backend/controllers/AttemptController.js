// backend/controllers/attemptController.js
const axios = require('axios');
const Level = require('../models/Level');
const AttemptLog = require('../models/AttemptLog'); // create below

exports.submitAttempt = async (req, res) => {
  try {
    const levelNum = parseInt(req.params.level, 10);
    const { action, timeTaken = 0, hintsUsed = 0, userId = 'anon' } = req.body;
    const level = await Level.findOne({ level: levelNum });
    if (!level) return res.status(404).json({ message: 'Level not found' });

    // call ML server
    const mlServer = process.env.ML_SERVER_URL || 'http://127.0.0.1:8001/predict';
    const text = `${level.sampleEmail.subject}\n\n${level.sampleEmail.body}`;
    let mlPrediction = null, mlConfidence = null;
    try {
      const mlRes = await axios.post(mlServer, { text }, { timeout: 8000 });
      mlPrediction = mlRes.data.prediction;
      mlConfidence = mlRes.data.confidence ?? null;
    } catch (e) {
      // ML server unavailable — continue with fallback
      mlPrediction = 'unknown';
      mlConfidence = 0;
    }

    const correct = (action === level.correctAction);
    // simple scoring
    const baseXP = level.baseXP || 10;
    const timeMultiplier = Math.max(0.5, 1 - timeTaken / 60);
    const hintPenalty = 0.15 * hintsUsed * baseXP;
    let xpAwarded = Math.round((correct ? baseXP : 0) * timeMultiplier - hintPenalty);
    if (xpAwarded < 0) xpAwarded = 0;

    // save attempt
    await AttemptLog.create({
      userId, level: levelNum, action, timeTaken, hintsUsed,
      mlPrediction, mlConfidence, correct, xpAwarded, timestamp: new Date()
    });

    res.json({ correct, xpAwarded, mlPrediction, mlConfidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing attempt' });
  }
};