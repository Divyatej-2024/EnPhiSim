import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import levelRoutes from "./routes/levelRoutes.js";
import mlRoutes from "./routes/mlanalysis.js";
import predictRoutes from "./routes/predict.js";
import actionRoutes from "./routes/actionRoutes.js";
import levelDatasetRoutes from "./routes/levelDataset.js";
import scenarioRoutes from "./routes/scenarioRoutes.js";
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ==============================
// CORS CONFIGURATION
// ==============================

const explicitAllowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://en-phi-sim.vercel.app",
  "https://www.en-phi-sim.vercel.app",
]);

if (process.env.CORS_ORIGINS) {
  process.env.CORS_ORIGINS.split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((origin) => explicitAllowedOrigins.add(origin));
}

const allowedOriginPatterns = [
  /^https:\/\/.*\.vercel\.app$/,
];

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (explicitAllowedOrigins.has(origin)) return true;
  return allowedOriginPatterns.some((pattern) => pattern.test(origin));
}

app.use(cors({
  origin(origin, callback) {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
  } else {
    console.warn("Blocked CORS origin:", origin);
    callback(new Error("Not allowed by CORS"));
  }
},
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
}));

// ==============================
// MIDDLEWARE
// ==============================

app.use(express.json());

// ==============================
// ROUTES
// ==============================

app.use('/api/analytics', analyticsRoutes);
app.use("/api", levelRoutes);
app.use("/api", scenarioRoutes);
app.use('/api/scenarios', levelDatasetRoutes);
app.use("/api", mlRoutes);
app.use("/api", predictRoutes);
app.use("/api", actionRoutes);

app.get("/", (req, res) => {
  res.send("EnPhiSim Backend is running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "EnPhiSim Backend",
    mongo: mongoose.connection.readyState === 1
      ? "connected"
      : "disconnected",
  });
});

// ==============================
// DATABASE + SERVER STARTUP
// ==============================

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not defined in environment variables");
    }

await mongoose.connect(process.env.MONGODB_URI);

app.locals.db = mongoose.connection.db;

console.log("MongoDB Connected");

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
    app.listen(PORT, () => {
      console.log(`Backend running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
}
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

startServer();