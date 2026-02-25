import axios from "axios";

export const BACKEND_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://enphisim-backend.onrender.com";

export async function getUserAnalysis(userId) {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/analysis/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching user analysis:", err);
    throw err;
  }
}

export const sendUserAction = async (actionData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/api/actions`, actionData);
    return res.data;
  } catch (err) {
    console.error("Error sending user action:", err);
    throw err;
  }
};

export async function getPrediction({ userId = "user_001", levelId = null, text }) {
  const res = await axios.post(`${BACKEND_URL}/api/predict`, { userId, levelId, text });
  return res.data;
}