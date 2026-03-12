import express from 'express';
import axios from 'axios';
import { validatePredictPayload } from '../middleware/validator.js';
import logger from '../utils/logger.js';

const router = express.Router();

const ML_SERVER_URL = process.env.ML_SERVER_URL || 'https://enphisim-ol7w.onrender.com';
const ML_API_KEY = process.env.ML_API_KEY;
const REQUEST_TIMEOUT = 30000;

const mlClient = axios.create({
  baseURL: ML_SERVER_URL.replace(/\/+$/, ''),
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': ML_API_KEY,
  },
});

router.post('/', validatePredictPayload, async (req, res) => {
  const startTime = Date.now();

  try {
    const { text, links } = req.body;

    const mlResponse = await mlClient.post('/predict', {
      text,
      links: Array.isArray(links) ? links : [],
    });

    logger.info('Prediction request completed', {
      durationMs: Date.now() - startTime,
      textLength: text.length,
    });

    res.json(mlResponse.data);
  } catch (error) {
    const duration = Date.now() - startTime;

    if (error.response) {
      logger.warn('ML server returned error response', {
        status: error.response.status,
        durationMs: duration,
      });

      return res.status(502).json({
        success: false,
        error: 'Prediction service error',
      });
    }

    if (error.request) {
      logger.warn('ML server did not respond', {
        code: error.code,
        durationMs: duration,
      });

      return res.status(503).json({
        success: false,
        error: 'Prediction service unavailable',
      });
    }

    logger.error('Prediction request setup failed', {
      message: error.message,
      durationMs: duration,
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to process prediction request',
    });
  }
});

router.get('/health', async (_req, res) => {
  try {
    const mlHealth = await mlClient.get('/health', { timeout: 5000 });

    res.json({
      status: 'healthy',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: true,
        response: mlHealth.data,
      },
    });
  } catch (error) {
    logger.warn('ML health check failed', { message: error.message });

    res.status(503).json({
      status: 'degraded',
      ml_server: {
        url: ML_SERVER_URL,
        reachable: false,
      },
    });
  }
});

router.get('/info', (_req, res) => {
  res.json({
    service: 'EnPhiSim Prediction API',
    version: '1.1.0',
    timeout_ms: REQUEST_TIMEOUT,
    features: ['text_classification', 'phishing_detection'],
  });
});

export default router;
