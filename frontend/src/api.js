// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL_PROD || 'http://localhost:5000',
});

export default api;
