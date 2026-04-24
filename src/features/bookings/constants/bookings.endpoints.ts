/**
 * Booking API endpoints (relative to axios baseURL).
 */
export const BOOKINGS_ENDPOINTS = {
  BASE: "/bookings",
  DETAIL: (id: number | string) => `/bookings/${encodeURIComponent(String(id))}`,
  // REST refactor: move bookingId to URL path
  CANCEL: (id: number | string) => `/bookings/${encodeURIComponent(String(id))}/cancel`,
  CHECK_IN: (id: number | string) => `/bookings/${encodeURIComponent(String(id))}/check-in`,
  CHECK_OUT: (id: number | string) => `/bookings/${encodeURIComponent(String(id))}/check-out`,
} as const;

