/**
 * Admin equipment API endpoints (relative to axios baseURL).
 *
 * Contract: documents/docs/equipment_api_integration.md
 */
export const ADMIN_EQUIPMENT_ENDPOINTS = {
  BASE: "/admin/equipment",
  DETAIL: (id: number | string) =>
    `/admin/equipment/${encodeURIComponent(String(id))}`,
  REACTIVATE: (id: number | string) =>
    `/admin/equipment/${encodeURIComponent(String(id))}/reactivate`,
} as const;

