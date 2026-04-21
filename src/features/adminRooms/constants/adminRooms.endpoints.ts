/**
 * Admin rooms API endpoints (relative to axios baseURL).
 */
export const ADMIN_ROOMS_ENDPOINTS = {
  BASE: "/admin/rooms",
  DETAIL: (id: number | string) => `/admin/rooms/${encodeURIComponent(String(id))}`,
  CREATE: "/admin/rooms/",
  UPDATE: "/admin/rooms",
  UPDATE_STATUS: "/admin/rooms/status",
} as const;

