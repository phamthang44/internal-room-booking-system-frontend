/**
 * Penalties/V iolations API endpoints (relative to axios baseURL).
 *
 * Docs:
 * - documents/docs/penalty_system_architecture.md
 * - documents/docs/penalty_system_architecture_2.md
 */
export const PENALTIES_ENDPOINTS = {
  ME_PENALTIES: "/profile/penalties",
  ME_VIOLATIONS: "/profile/violations",

  ADMIN_USER_PENALTIES: (userId: number | string) =>
    `/admin/users/${encodeURIComponent(String(userId))}/penalties`,

  ADMIN_REVOKE: (id: number | string) =>
    `/admin/penalties/${encodeURIComponent(String(id))}/revoke`,
  ADMIN_EXTEND: (id: number | string) =>
    `/admin/penalties/${encodeURIComponent(String(id))}/extend`,

  // Optional — if backend exposes it.
  ADMIN_CREATE_VIOLATION: "/admin/violations",
} as const;

