/**
 * Admin bookings API endpoints (relative to axios baseURL).
 */
export const ADMIN_BOOKINGS_ENDPOINTS = {
  BASE: "/admin/bookings",
  DETAIL: (bookingId: number | string) =>
    `/admin/bookings/${encodeURIComponent(String(bookingId))}`,
  APPROVE: "/admin/bookings/approve",
  REJECT: "/admin/bookings/reject",
} as const;

