import axios from "axios";

const BACKEND_URL = "https://enphisim-backend.onrender.com";

// Fetch analysis for a specific user
export async function getUserAnalysis(userId) {
  const res = await axios.get(`${BACKEND_URL}/api/analysis/${userId}`);
  return res.data;
}

// Send user action (click, hover, report, etc)
export const sendUserAction = async (actionData) => {
  await axios.post(`${BACKEND_URL}/api/actions`, actionData);
};

// Get phishing prediction (text → ML)
export const getPrediction = async (emailText) => {
  const res = await axios.post(`${BACKEND_URL}/api/predict`, { emailText });
  return res.data;
};
