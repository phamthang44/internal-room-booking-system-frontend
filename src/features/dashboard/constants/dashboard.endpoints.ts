/**
 * Dashboard API endpoints (relative to axios baseURL).
 */
export const DASHBOARD_ENDPOINTS = {
  STUDENT_DASHBOARD: "/students/dashboard",
  ADMIN_OVERVIEW: "/admin/dashboard/overview",
  ADMIN_BOOKING_TREND: "/admin/dashboard/trend",
  ADMIN_ROOM_STATS: "/admin/dashboard/room-stats",
  ADMIN_VIOLATION_TREND: "/admin/dashboard/violation-trend",
} as const;

