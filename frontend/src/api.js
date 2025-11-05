import axios from "axios";

const BACKEND_URL = "https://enphisim-1.onrender.com"; // your backend

export const sendUserAction = async (actionData) => {
  await axios.post(`${BACKEND_URL}/api/actions`, actionData);
};

export const getPrediction = async (emailText) => {
  const res = await axios.post(`${BACKEND_URL}/api/predict`, { emailText });
  return res.data;
};
