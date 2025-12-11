import dotenv from "dotenv";
dotenv.config();  // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
//import levelRoutes from "./routes/levels.js";
import levelRoutes from "./routes/levelRoutes.js";
import mlRoutes from "./routes/mlanalysis.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api",levelRoutes);

// DEBUG: check env
console.log("Loaded MONGO_URI =", process.env.MONGO_URI);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error:", err));

app.use("/api", mlRoutes);

app.listen(process.env.PORT || 4000, () =>
  console.log("Backend Running on port:", process.env.PORT || 4000)
);
