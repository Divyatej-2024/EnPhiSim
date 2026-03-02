import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { text, links } = req.body;
    console.log('🤖 Prediction for text length:', text?.length);
    
    // Mock predictions - replace with real ML later
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
    console.error('❌ Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
});

export default router;