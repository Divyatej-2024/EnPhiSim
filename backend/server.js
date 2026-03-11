import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';

import logger from './utils/logger.js';
import levelsRoutes from './routes/levels.js';
import scenariosRoutes from './routes/scenarios.js';
import actionRoutes from './routes/action.js';
import analyticsRoutes from './routes/analytics.js';
import predictRoutes from './routes/predict.js';
import consentRoutes from './routes/consent.js';
import modelMetricsRoutes from './routes/modelMetrics.js';
import { notFoundHandler, csrfErrorHandler, generalErrorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);
const NODE_ENV = process.env.NODE_ENV || 'development';
// Add this at the VERY TOP of server.js, before any other code
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
    // Mask password for safety
    const masked = process.env.MONGODB_URI.replace(/:[^@]+@/, ':****@');
    console.log('MONGODB_URI value:', masked);
    console.log('MONGODB_URI length:', process.env.MONGODB_URI.length);
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI.substring(0, 20));
} else {
    console.log('MONGODB_URI is UNDEFINED!');
}
console.log('===================================');
app.disable('x-powered-by');
app.set('trust proxy', 1);

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: NODE_ENV,
    tracesSampleRate: 0.2,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  logger.info('Sentry initialized');
}

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  'https://en-phi-sim.vercel.app',
  'http://localhost:3000',
  ...configuredOrigins,
]);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Requested-With'],
  optionsSuccessStatus: 204,
};

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", ...allowedOrigins],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    noSniff: true,
    originAgentCluster: true,
    permittedCrossDomainPolicies: { permittedPolicies: 'none' },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

function requestKey(req) {
  return (
    req.body?.session_id ||
    req.body?.sessionId ||
    req.params?.sessionId ||
    req.ip
  );
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: requestKey,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.',
    },
  },
});

const predictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: requestKey,
  message: {
    success: false,
    error: {
      code: 'PREDICT_RATE_LIMIT_EXCEEDED',
      message: 'Prediction rate limit exceeded. Please slow down.',
    },
  },
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 8,
  keyGenerator: requestKey,
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many attempts, please try again later.',
    },
  },
});
// Add to server.js - right before your routes
app.get('/debug/check-data', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const levelData = await db.collection('levelDataset').find().limit(1).toArray();
    
    res.json({
      database: mongoose.connection.name,
      collections: collections.map(c => c.name),
      hasLevelDataset: collections.some(c => c.name === 'levelDataset'),
      sampleData: levelData.length > 0 ? 'Data exists!' : 'No data found',
      count: await db.collection('levelDataset').countDocuments()
    });
  } catch (err) {
    res.json({ error: err.message });
  }
});
app.use('/api', apiLimiter);
app.use('/api/predict', predictLimiter);
app.use('/api/consent', authLimiter);

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 3600,
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
});

app.use('/api/action', csrfProtection);
app.use('/api/consent', csrfProtection);
app.use('/api/predict', csrfProtection);

app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({
    success: true,
    data: {
      csrfToken: req.csrfToken(),
      expiresIn: 3600,
    },
  });
});

app.use((req, _res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
});

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'EnPhiSim Backend',
      env: NODE_ENV,
    },
  });
});

app.use('/api/levels', levelsRoutes);
app.use('/api/scenarios', scenariosRoutes);
app.use('/api/action', actionRoutes);
app.use('/api/model-metrics', modelMetricsRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/predict', predictRoutes);

app.use(notFoundHandler);
app.use(csrfErrorHandler);

if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(generalErrorHandler);

if (!process.env.MONGODB_URI) {
  logger.error('MONGODB_URI is not set. Refusing to start.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => logger.info('MongoDB connected successfully'))
  .catch((err) => {
    logger.error('MongoDB connection error', { message: err.message });
    process.exit(1);
  });

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { env: NODE_ENV });
});

function gracefulShutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      logger.info('Server shut down complete');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
