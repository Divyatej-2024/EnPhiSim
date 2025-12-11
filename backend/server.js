import dotenv from "dotenv";
dotenv.config();   // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mlRoutes from "./routes/mlanalysis.js";

const app = express();
app.use(cors());
app.use(express.json());

// Debug log
console.log("Loaded MONGO_URI =", process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

// Routes
app.use("/api", mlRoutes);

// Optional root route
app.get("/", (req, res) => res.send("Backend running. Use /api/levels for data."));
app.get("/api/levels", async (req, res) => {
  try {
    const Level = mongoose.model("Level"); // or import your Level model
    const levels = await Level.find();
    res.json(levels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend Running on port:", process.env.PORT || 4000)
);
