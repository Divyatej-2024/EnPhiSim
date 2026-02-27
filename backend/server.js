import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import levelRoutes from "./routes/levelRoutes.js";
import mlRoutes from "./routes/mlanalysis.js";
import predictRoutes from "./routes/predict.js";
import actionRoutes from "./routes/actionRoutes.js";
import scenarioRoutes from "./routes/scenarioRoutes.js";

const app = express();
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

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("EnPhiSim Backend is running");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "EnPhiSim Backend",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api", levelRoutes);
app.use("/api", scenarioRoutes);
app.use("/api", mlRoutes);
app.use("/api", predictRoutes);
app.use("/api", actionRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend Running on port:", process.env.PORT || 4000)
);
