// frontend/src/services/api.js
import axios from 'axios';

const BACKEND = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';
const ML = process.env.REACT_APP_ML_BASE || 'http://127.0.0.1:8001';

export const getLevels = () => axios.get(`${BACKEND}/levels`);
export const getLevel = (id) => axios.get(`${BACKEND}/levels/${id}`);
export const submitAttempt = (level, payload) => axios.post(`${BACKEND}/attempts/${level}`, payload);

export const mlPredict = (text) => axios.post(`${ML}/predict`, { text });
