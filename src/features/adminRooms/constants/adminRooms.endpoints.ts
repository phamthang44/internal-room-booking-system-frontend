/**
 * Admin rooms API endpoints (relative to axios baseURL).
 */
export const ADMIN_ROOMS_ENDPOINTS = {
  BASE: "/admin/rooms",
  DETAIL: (id: number | string) => `/admin/rooms/${encodeURIComponent(String(id))}`,
  CREATE: "/admin/rooms/",
  // REST refactor: move classroomId to URL path
  UPDATE: (id: number | string) => `/admin/rooms/${encodeURIComponent(String(id))}`,
  UPDATE_STATUS: (id: number | string) => `/admin/rooms/${encodeURIComponent(String(id))}/status`,
} as const;

