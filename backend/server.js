// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import dotenv from 'dotenv';
import * as Sentry from '@sentry/node';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import logger
import logger from './utils/logger.js';

// Import routes
import levelsRoutes from './routes/levels.js';
import actionRoutes from './routes/action.js';
import analyticsRoutes from './routes/analytics.js';
import predictRoutes from './routes/predict.js';
import consentRoutes from './routes/consent.js';
import modelMetricsRoutes from './routes/modelMetrics.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ==================== SENTRY INITIALIZATION ====================
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());
  logger.info('Sentry initialized');
}

// ==================== SECURITY MIDDLEWARE ====================

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'https://en-phi-sim.vercel.app'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: "same-origin" },
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: "deny" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
}));
// Add BEFORE your existing CORS config
app.use((req, res, next) => {
  // Debug: See what CORS headers are being set
  console.log('Origin:', req.headers.origin);
  console.log('Current CORS headers:', res.get('Access-Control-Allow-Origin'));
  next();
});

// STRONG CORS CONFIG - Override any platform defaults
app.use((req, res, next) => {
  const allowedOrigins = ['https://en-phi-sim.vercel.app', 'http://localhost:3000'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// THEN comment out or remove your existing cors() middleware
// app.use(cors(corsOptions)); // TEMPORARILY DISABLE
// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'https://en-phi-sim.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'X-API-Key'],
  credentials: true,
  optionsSuccessStatus: 200,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Cookie parser for CSRF
app.use(cookieParser());

// Body parsing with size limit
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// ==================== RATE LIMITING ====================

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests
  message: { 
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use session ID if available, otherwise IP
    return req.body?.sessionId || req.ip;
  }
});

// Stricter limit for prediction endpoint
const predictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each session to 10 predictions per minute
  message: { 
    success: false,
    error: {
      code: 'PREDICT_RATE_LIMIT_EXCEEDED',
      message: 'Prediction rate limit exceeded. Please slow down.'
    }
  },
  keyGenerator: (req) => req.body?.sessionId || req.ip
});

// Auth endpoints limit
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 consent attempts per hour
  message: { 
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many attempts, please try again later.'
    }
  }
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/predict', predictLimiter);
app.use('/api/consent', authLimiter);

// ==================== CSRF PROTECTION ====================

// CSRF protection configuration
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 // 1 hour
  }
});

// Apply CSRF to state-changing routes (exclude GET and health)
app.use('/api/action', csrfProtection);
app.use('/api/consent', csrfProtection);
app.use('/api/predict', csrfProtection);

// CSRF token endpoint
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ 
    success: true,
    data: {
      csrfToken: req.csrfToken(),
      expiresIn: 3600
    },
    message: 'Include this token in X-CSRF-Token header for POST requests'
  });
});

// ==================== REQUEST LOGGING ====================

app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    sessionId: req.body?.sessionId || 'none',
    userAgent: req.get('User-Agent')
  });
  next();
});

// ==================== ROUTES ====================

// Health check (no auth needed)
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'EnPhiSim Backend'
    }
  });
});

// API routes
app.use('/api/levels', levelsRoutes);
app.use('/api/action', actionRoutes);
app.use('/api/model-metrics', modelMetricsRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/predict', predictRoutes);

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  logger.warn('404 Not Found', { url: req.url, method: req.method });
  res.status(404).json({ 
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// ==================== ERROR HANDLING ====================

// CSRF error handler
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    logger.error('CSRF token validation failed', { 
      ip: req.ip,
      url: req.url 
    });
    return res.status(403).json({ 
      success: false,
      error: {
        code: 'INVALID_CSRF_TOKEN',
        message: 'Invalid CSRF token'
      }
    });
  }
  next(err);
});

// Sentry error handler (if configured)
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// General error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', { 
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({ 
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred' 
        : err.message
    }
  });
});

// ==================== DATABASE CONNECTION ====================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => logger.info('✅ MongoDB connected successfully'))
  .catch(err => {
    logger.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit if database connection fails
  });

// ==================== START SERVER ====================

const server = app.listen(PORT, () => {
  logger.info(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('Server shut down complete');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('Server shut down complete');
      process.exit(0);
    });
  });
});

export default app;
