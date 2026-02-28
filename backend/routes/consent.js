import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

const consentSchema = new mongoose.Schema({
  session_id: String,
  consent_given: Boolean,
  timestamp: { type: Date, default: Date.now }
});

const Consent = mongoose.model('Consent', consentSchema);

router.post('/', async (req, res) => {
  try {
    const { session_id, consent_given } = req.body;

    const record = new Consent({
      session_id,
      consent_given
    });

    await record.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save consent' });
  }
});

export default router;