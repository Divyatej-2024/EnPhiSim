import axios from "axios";

export async function mlPredict(payload) {
  const baseUrl = process.env.ML_SERVER_URL || process.env.ML_API_URL;
  if (!baseUrl) {
    throw new Error("ML server URL is not configured");
  }

  const url = baseUrl.endsWith("/predict") ? baseUrl : `${baseUrl}/predict`;
  const response = await axios.post(url, payload, { timeout: 10000 });
  return response.data;
}

export default mlPredict;