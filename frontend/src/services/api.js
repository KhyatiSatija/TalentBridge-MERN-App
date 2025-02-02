import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",  // Adjust based on your backend server
  withCredentials: true,           // Ensure cookies are sent if using sessions
});

export default api;
