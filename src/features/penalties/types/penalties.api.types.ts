// ─────────────────────────────────────────────────────────────────────────────
// Penalties — API Types
// Sources:
// - documents/docs/penalty_system_architecture.md (high-level)
// - documents/docs/penalty_system_architecture_2.md (revoke/extend contract)
// ─────────────────────────────────────────────────────────────────────────────

export type PenaltyTypeApi =
  | "WARNING"
  | "APPROVAL_REQUIRED"
  | "TEMPORARY_BAN"
  | "PERMANENT_BAN";

export type PenaltyStatusApi = "ACTIVE" | "EXPIRED" | "REVOKED";

export type ViolationTypeApi = "LATE_CHECKIN" | "NO_SHOW" | "DAMAGE" | "MISCONDUCT";
export type ViolationSourceApi = "SYSTEM" | "ADMIN";

export interface AuditResponse {
  createdAt?: string; // Instant ISO-8601
  updatedAt?: string; // Instant ISO-8601
  createdBy?: string;
  updatedBy?: string;
}

export interface UserBasicResponse {
  id: number;
  username?: string;
  email?: string;
  role?: string;
  status?: string;
  studentCode?: string;
}

export interface PenaltyRecordResponse {
  id: number;
  isActive?: boolean;
  action?: string; // e.g. "REVOKED"
  type?: PenaltyTypeApi | string;
  status?: PenaltyStatusApi | string;
  startDate?: string; // Instant ISO-8601 (contract doc uses startDate/endDate)
  endDate?: string | null; // Instant ISO-8601
  startTime?: string; // Some backends may use startTime/endTime
  endTime?: string | null;
  reason?: string;
  userBasicResponse?: UserBasicResponse;
  auditResponse?: AuditResponse;
}

export interface ViolationResponse {
  id: number | string;
  userId?: number;
  bookingId?: number | null;
  type?: ViolationTypeApi | string;
  source?: ViolationSourceApi | string;
  severityPoints?: number;
  reason?: string | null; // can be i18n key (e.g. booking.cancel.reason.no_show)
  notes?: string | null;
  createdAt?: string; // Instant ISO-8601
}

export interface PenaltyRevokeRequest {
  reason: string;
}

export interface PenaltyExtendRequest {
  reason: string;
  newEndDate: string; // Instant ISO-8601
}

// This repo currently has two ApiResult shapes (see bookings vs adminBookings).
// Penalty endpoints may follow the adminBookings shape, but we accept both.
export type ApiResult<T> =
  | {
      success: boolean;
      message?: string;
      data?: T;
      errorCode?: string;
      timestamp?: string;
      meta?: unknown;
    }
  | {
      data?: T;
      meta?: unknown;
      error?: unknown;
    };

export interface AdminUserPenaltiesResponse {
  activePenalty?: PenaltyRecordResponse | null;
  penalties?: PenaltyRecordResponse[];
  violations?: ViolationResponse[];
}

