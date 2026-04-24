/**
 * Admin bookings API endpoints (relative to axios baseURL).
 */
export const ADMIN_BOOKINGS_ENDPOINTS = {
  BASE: "/admin/bookings",
  DETAIL: (bookingId: number | string) =>
    `/admin/bookings/${encodeURIComponent(String(bookingId))}`,
  // REST refactor: move bookingId to URL path
  APPROVE: (id: number | string) =>
    `/admin/bookings/${encodeURIComponent(String(id))}/approve`,
  REJECT: (id: number | string) =>
    `/admin/bookings/${encodeURIComponent(String(id))}/reject`,
} as const;

