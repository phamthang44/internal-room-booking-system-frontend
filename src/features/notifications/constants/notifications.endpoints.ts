/**
 * Notifications API endpoints (relative to axios baseURL).
 */
export const NOTIFICATIONS_ENDPOINTS = {
  BASE: "/notifications",
  UNREAD_COUNT: "/notifications/unread-count",
  MARK_READ: (id: number | string) =>
    `/notifications/${encodeURIComponent(String(id))}/read`,
  MARK_ALL_READ: "/notifications/read-all",
  DELETE_ONE: (id: number | string) =>
    `/notifications/${encodeURIComponent(String(id))}`,
  DELETE_BULK: "/notifications/bulk",
  CLEAR_ALL: "/notifications/clear-all",
} as const;

