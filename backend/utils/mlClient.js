// utils/mlClient.js
import axios from "axios";

const ML_API_URL = process.env.ML_API_URL;

export default async function mlPredict(payload) {
  console.log("[mlPredict] Calling ML API:", ML_API_URL, "with:", payload);

  try {
    const res = await axios.post(ML_API_URL, payload, { timeout: 8000 });
    console.log("[mlPredict] ML API response:", res.data);
    return res.data;
  } catch (err) {
    console.error("[mlPredict] ML API error:", {
      message: err.message,
      responseData: err.response?.data,
      status: err.response?.status,
    });
    throw err;
  }
}
