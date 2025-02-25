// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_URL_PROD || 'http://localhost:5000',
});

export default api;
