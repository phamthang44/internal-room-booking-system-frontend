/**
 * Booking API endpoints (relative to axios baseURL).
 */
export const BOOKINGS_ENDPOINTS = {
  BASE: "/bookings",
  DETAIL: (id: number | string) => `/bookings/${encodeURIComponent(String(id))}`,
  CANCEL: "/bookings/cancel",
  CHECK_IN: "/bookings/checkin",
  CHECK_OUT: "/bookings/checkout",
} as const;

