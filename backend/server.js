import dotenv from "dotenv";
dotenv.config();   // ← MUST COME FIRST

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mlRoutes from "./routes/mlanalysis.js";

const app = express();
app.use(cors());
app.use(express.json());

// Debug log
console.log("Loaded MONGO_URI =", process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:", err));

app.use("/api", mlRoutes);

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend Running on port:", process.env.PORT || 4000)
);
