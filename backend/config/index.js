import dotenv from "dotenv";

dotenv.config();

const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || "",
  mlServerUrl: process.env.ML_SERVER_URL || "",
  mlApiUrl: process.env.ML_API_URL || "",
};

export default config;