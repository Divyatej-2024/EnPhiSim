// backend/routes/predict.js
import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, links } = req.body;
    
    // Forward to your ML server
    const mlResponse = await axios.post('http://localhost:8000/predict', {
      text,
      links
    });
    
    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML prediction failed:', error);
    res.json({
      distilbert: { prediction: 'unknown', confidence: 0 },
      cnn: { prediction: 'unknown', confidence: 0 }
    });
  }
});

export default router;