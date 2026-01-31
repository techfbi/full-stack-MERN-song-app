import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // the backend server URL
  withCredentials: true, // to send cookies if needed
});

export default api;
