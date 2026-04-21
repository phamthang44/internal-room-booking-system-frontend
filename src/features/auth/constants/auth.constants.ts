/**
 * Authentication API Endpoints
 * Centralized to avoid hardcoded URL duplication
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  GOOGLE_LOGIN: "/auth/google-login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  // Canonical “current user” endpoint used across the app.
  GET_CURRENT_USER: "/profile",
} as const;
