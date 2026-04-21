/**
 * Core API endpoints used by infrastructure code (interceptors, etc.).
 * Keep these here so core doesn't depend on feature modules.
 */
export const CORE_API_ENDPOINTS = {
  AUTH_REFRESH: "/auth/refresh",
} as const;

