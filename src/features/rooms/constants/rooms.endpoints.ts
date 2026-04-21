/**
 * Rooms API endpoints (relative to axios baseURL).
 */
export const ROOMS_ENDPOINTS = {
  LIST: "/rooms",
  DETAIL: (roomId: number | string) =>
    `/rooms/${encodeURIComponent(String(roomId))}`,
} as const;

