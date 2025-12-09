import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import mlRoutes from "./routes/mlanalysis.js";
app.use("/api", mlRoutes);


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI,{
 UserNewUrlParser: true,
 userUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("DB Error:",err));

app.listen(4000, () => console.log("Backend Running on port:",process.env.PORT));