import express from 'express';
import { MongoClient } from 'mongodb';

const router = express.Router();

router.post('/', async (req, res) => {
  let client;
  try {
    const { agreed, sessionId } = req.body;
    if (!agreed) {
      return res.status(400).json({ error: 'Consent not agreed' });
    }

    const uri = process.env.MONGODB_URI;
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('EnPhiSimdb');
    await db.collection('consent_logs').insertOne({
      sessionId,
      agreed: true,
      timestamp: new Date()
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Consent error:', error);
    res.status(500).json({ error: 'Failed to record consent' });
  } finally {
    if (client) await client.close();
  }
});

export default router;