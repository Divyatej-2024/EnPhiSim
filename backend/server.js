import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// Example route that talks to ML Server
app.post('/api/predict', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.ML_SERVER_URL}/predict`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('ML Server error:', err.message);
    res.status(500).json({ error: 'ML Server failed to respond' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
