// backend/routes/predict.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, links } = req.body;
    
    // Forward to your ML server (if running)
    // For now, return mock predictions
    const mockResponse = {
      distilbert: { 
        prediction: Math.random() > 0.5 ? 'phishing' : 'legitimate', 
        confidence: Math.random() 
      },
      cnn: { 
        prediction: Math.random() > 0.5 ? 'phishing' : 'legitimate', 
        confidence: Math.random() 
      }
    };
    
    res.json(mockResponse);
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

export default router;