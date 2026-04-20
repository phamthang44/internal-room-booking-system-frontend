// ─────────────────────────────────────────────────────────────────────────────
// Notifications — API Types (from documents/docs/notification_api_analysis.md)
// Base: /api/v1/notifications
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiMeta {
  serverTime?: number;
  message?: string;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  traceId?: string;
}

export interface ApiErrorDetail {
  code?: string;
  message?: string;
  traceId?: string;
  details?: unknown;
}

export interface ApiResult<T> {
  data?: T;
  meta?: ApiMeta;
  error?: ApiErrorDetail;
}

export type NotificationTypeApi =
  | "BOOKING_STATUS"
  | "SYSTEM_ALERT"
  | (string & {});

export interface NotificationResponse {
  id?: number;
  title?: string;
  message?: string;
  type?: NotificationTypeApi;
  isRead?: boolean;
  relatedId?: string;
  createdAt?: string; // Instant ISO-8601
}

