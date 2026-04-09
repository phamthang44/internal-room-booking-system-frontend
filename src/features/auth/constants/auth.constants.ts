/**
 * Authentication API Endpoints
 * Centralized to avoid hardcoded URL duplication
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  GOOGLE_LOGIN: "/auth/google-login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  GET_CURRENT_USER: "/users/me",
} as const;
