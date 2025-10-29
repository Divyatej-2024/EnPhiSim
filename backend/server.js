const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ML route
app.post('/predict', async (req, res) => {
  try {
    const response = await axios.post(`${process.env.ML_SERVER_URL}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Error contacting ML server:", error.message);
    res.status(500).json({ error: 'ML server unreachable' });
  }
});

// Root endpoint
app.get('/', (req, res) => res.send('🟢 EnPhiSim Backend Running'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
