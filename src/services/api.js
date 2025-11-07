import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:3000/api",
  withCredentials: false,
  httpsAgent: process.env.NODE_ENV === 'development' ? {
    rejectUnauthorized: false
  } : undefined
});

// Add request interceptor to handle SSL issues
api.interceptors.request.use(
  (config) => {
    // For development, ignore SSL certificate errors
    if (process.env.NODE_ENV === 'development') {
      process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
