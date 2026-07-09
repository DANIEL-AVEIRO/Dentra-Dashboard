import axios from "axios";
import { LOGIN_PATH } from "@/config/authPaths";
import { trackRequest, untrackRequest } from "@/api/loadingTracker";

const API_BASE = import.meta.env.VITE_API_URL || "/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((config) => {
  trackRequest(config);
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Let the browser set multipart boundary; default JSON header breaks file uploads.
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

client.interceptors.response.use(
  (res) => {
    untrackRequest(res.config);
    return res;
  },
  async (error) => {
    const original = error.config;
    if (original) untrackRequest(original);

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/token/refresh/`, {
            refresh,
          });
          localStorage.setItem("access_token", data.access);
          original.headers.Authorization = `Bearer ${data.access}`;
          trackRequest(original);
          return client(original);
        } catch {
          localStorage.clear();
          window.location.href = LOGIN_PATH;
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
