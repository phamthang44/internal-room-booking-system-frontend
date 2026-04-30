import axios from "axios";
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { ENV } from "@core/config/env";
import { CORE_API_ENDPOINTS } from "./endpoints";
import { clearAccessToken, getAccessToken, setAccessToken } from "@core/auth/accessToken";

const makeIdempotencyKey = (): string => {
  // Prefer Web Crypto UUID when available (modern browsers)
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as Crypto).randomUUID();
  }
  // Fallback: pseudo-random (still good enough for client-side dedupe)
  return `${Date.now()}-${Math.random().toString(16).slice(2)}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

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

/**
 * A separate raw axios instance used ONLY for the token refresh call.
 * This bypasses the response interceptor on `apiClient` to prevent
 * the refresh call itself from triggering another refresh loop when
 * the backend returns 401 (e.g., refresh token expired or missing).
 */
export const refreshClient = axios.create({
  baseURL: ENV.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Refresh endpoint authenticates via httpOnly cookie only.
// Never attach Authorization here to avoid sending expired access tokens.
refreshClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const language = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = language;

    if (config.headers) {
      delete (config.headers as Record<string, unknown>).Authorization;
      delete (config.headers as Record<string, unknown>).authorization;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

/**
 * Extract refresh endpoint to avoid magic strings
 */
const REFRESH_ENDPOINT = CORE_API_ENDPOINTS.AUTH_REFRESH;

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

/**
 * Read the current access token from in-memory storage.
 */
const getStoredToken = (): string | null => {
  return getAccessToken();
};

/**
 * Persist a new access token to in-memory storage.
 */
const persistToken = (token: string): void => {
  setAccessToken(token);
};

/**
 * Clear all in-memory auth state, then redirect to /login.
 */
const forceLogout = (): void => {
  clearAccessToken();
  window.location.href = "/login";
};

// Request interceptor — attach token and Accept-Language header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const language = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = language;

    // Idempotency: attach a unique key for non-GET requests if none provided.
    // Backend uses this to dedupe duplicate submits (e.g., double click, retry).
    const method = (config.method ?? "get").toLowerCase();

    // Tell the browser to revalidate GET responses with the server every time.
    // Without this, browsers serve a 304 from disk cache even after backend data
    // changes, because the ETag still matches the cached response.
    if (method === "get") {
      config.headers["Cache-Control"] = "no-cache";
    }

    const isIdempotencyEligible =
      method !== "get" && method !== "head" && method !== "options";
    if (isIdempotencyEligible) {
      const existing =
        (config.headers["X-Idempotency-Key"] as string | undefined) ??
        (config.headers["x-idempotency-key"] as string | undefined);
      if (!existing) {
        config.headers["X-Idempotency-Key"] = makeIdempotencyKey();
      }
    }

    const token = getStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// Response interceptor — handle token refresh on 401, emit events for 403/404
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const status = error.response?.status;

    // ──────────────────────────────────────────────
    // 401 Unauthorized — attempt silent token refresh
    // ──────────────────────────────────────────────
    if (status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue concurrent requests to retry after the ongoing refresh
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject: reject as (error: AxiosError) => void,
          });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // ⚠️  Use the raw `refreshClient` (NOT `apiClient`) so that a
        //     401 from /auth/refresh does NOT re-enter this interceptor,
        //     which would cause an infinite loop or ghost queuing.
        const response = await refreshClient.post<{
          data: { accessToken: string };
        }>(REFRESH_ENDPOINT);
        const { accessToken } = response.data.data;

        persistToken(accessToken);
        processQueue(null, accessToken);

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token is absent, expired, or revoked — force logout
        processQueue(refreshError as AxiosError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 / 404 / other HTTP errors: global UX via React Query caches (mutations
    // by default; queries opt in with meta.showGlobalError) — see createAppQueryClient.

    return Promise.reject(error);
  },
);

export default apiClient;
