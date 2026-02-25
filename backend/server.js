import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import levelRoutes from "./routes/levelRoutes.js";
import mlRoutes from "./routes/mlanalysis.js";
import predictRoutes from "./routes/predict.js";

const app = express();
const PORT = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:3000",
  "https://en-phi-sim.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

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
app.use("/api", mlRoutes);
app.use("/api", predictRoutes);

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn("MONGO_URI is not set. Starting backend without a database connection.");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("DB Error:", err.message);
  }
}

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log("Backend Running on port:", PORT);
  });
}

startServer();
