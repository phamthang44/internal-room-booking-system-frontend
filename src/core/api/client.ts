import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ENV } from "@core/config/env";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // Important: Allow credentials (httpOnly cookies) to be sent with requests
  withCredentials: true,
});

// Request interceptor - attach token and language header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach language header for backend to respond in correct language
    // Gets current language from localStorage (managed by i18n provider)
    const language = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = language;

    // NOTE: accessToken is NOT stored in localStorage for security
    // It's kept in memory in Zustand store and sent via Authorization header
    // by the calling code when needed.
    // Backend handles refreshToken in httpOnly cookies (automatic for API calls)

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor - handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth data from memory
      localStorage.removeItem("language"); // Keep language, but clear auth

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
