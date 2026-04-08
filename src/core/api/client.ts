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

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null,
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - attach token and language header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach language header for backend to respond in correct language
    const language = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = language;

    // Attach access token from Zustand store if available
    const authStoreRaw = localStorage.getItem("auth-store");
    if (authStoreRaw) {
      try {
        const parsed = JSON.parse(authStoreRaw) as {
          state?: { token?: string };
        };
        if (parsed.state?.token) {
          config.headers["Authorization"] = `Bearer ${parsed.state.token}`;
        }
      } catch {
        // If parsing fails, continue without token
      }
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor - handle 401 and refresh token
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request to retry after token refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
              resolve(apiClient(originalRequest));
            },
            reject: (err: AxiosError) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Attempt to refresh token using refresh token from httpOnly cookie
      return apiClient
        .post<{ accessToken: string }>("/auth/refresh")
        .then((response) => {
          const { accessToken } = response.data;

          // Update token in Zustand store
          const authStoreRaw = localStorage.getItem("auth-store");
          if (authStoreRaw) {
            try {
              const parsed = JSON.parse(authStoreRaw);
              if (parsed.state) {
                parsed.state.token = accessToken;
                localStorage.setItem("auth-store", JSON.stringify(parsed));
              }
            } catch {
              // If parsing fails, clear auth
              localStorage.removeItem("auth-store");
              window.location.href = "/login";
            }
          }

          // Retry original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);
          isRefreshing = false;

          return apiClient(originalRequest);
        })
        .catch((err: AxiosError) => {
          // Token refresh failed - redirect to login
          localStorage.removeItem("auth-store");
          processQueue(err, null);
          isRefreshing = false;
          window.location.href = "/login";
          return Promise.reject(err);
        });
    }

    return Promise.reject(error);
  },
);

export default apiClient;
