// ─────────────────────────────────────────────────────────────────────────────
// Admin Users — API Types (from documents/docs/user-management-contract*.md)
// Base: /api/v1/admin/users
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
  meta?: {
    message?: string;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    traceId?: string;
    serverTime?: number;
    apiVersion?: string;
  };
  error?: {
    code?: string;
    message?: string;
    traceId?: string;
    details?: Record<string, unknown>;
  };
}

export type AdminUserRoleApi = "ADMIN" | "STAFF" | "STUDENT";
export type AdminUserStatusApi = "ACTIVE" | "INACTIVE" | "BANNED";

export interface UserBasicResponse {
  id: number;
  username: string;
  email: string;
  role: AdminUserRoleApi | string;
  status: AdminUserStatusApi | string;
  studentCode: string | null;
}

/**
 * Spring-like page wrapper (shape varies by backend); keep fields optional.
 */
export interface Page<T> {
  content?: T[];
  number?: number; // 0-indexed
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
}

export interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

