import { apiClient } from "@core/api";
import type { ApiResult, NotificationResponse } from "../types/notifications.api.types";

// NOTE: VITE_API_URL is configured as ".../api/v1" (no trailing slash).
// Axios concatenates baseURL + url; this must start with "/" to avoid ".../api/v1notifications".
const BASE = "/notifications";

const unwrapApiResult = <T,>(body: unknown): { data: T | null; meta?: unknown } => {
  if (body && typeof body === "object" && "data" in body) {
    const d = (body as { data?: T }).data;
    return { data: d ?? null, meta: (body as { meta?: unknown }).meta };
  }
  return { data: (body as T) ?? null };
};

export interface NotificationsListParams {
  /** 1-indexed per API contract */
  page?: number;
  size?: number;
}

export interface NotificationsListResult {
  rows: NotificationResponse[];
  meta?: unknown;
}

export const notificationsApiService = {
  list: async (params: NotificationsListParams = {}): Promise<NotificationsListResult> => {
    const res = await apiClient.get<ApiResult<NotificationResponse[]>>(BASE, { params });
    const unwrapped = unwrapApiResult<NotificationResponse[]>(res.data);
    return { rows: unwrapped.data ?? [], meta: unwrapped.meta };
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<ApiResult<number>>(`${BASE}/unread-count`);
    const unwrapped = unwrapApiResult<number>(res.data);
    return Number(unwrapped.data ?? 0);
  },

  markRead: async (id: number): Promise<void> => {
    await apiClient.patch<ApiResult<void>>(`${BASE}/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post<ApiResult<void>>(`${BASE}/read-all`, null);
  },
};

