/**
 * Admin users API endpoints (relative to axios baseURL).
 */
export const ADMIN_USERS_ENDPOINTS = {
  BASE: "/admin/users",
  TOGGLE_BAN: (userId: number | string) =>
    `/admin/users/${encodeURIComponent(String(userId))}/ban`,
  UPDATE_ROLE: (userId: number | string) =>
    `/admin/users/${encodeURIComponent(String(userId))}/role`,
} as const;

