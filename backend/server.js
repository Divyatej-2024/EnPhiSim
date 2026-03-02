// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Import routes
import levelsRoutes from './routes/levels.js';
import actionRoutes from './routes/action.js';
import analyticsRoutes from './routes/analytics.js';
import predictRoutes from './routes/predict.js';
import consentRoutes from './routes/consent.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/levels', levelsRoutes);
app.use('/api/action', actionRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/predict', predictRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'EnPhiSim Backend is running' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});