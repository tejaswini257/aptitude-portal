import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "");

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined. Please set it in your environment variables."
  );
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
