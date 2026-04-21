import { apiClient } from "@core/api";
import { NOTIFICATIONS_ENDPOINTS } from "../constants/notifications.endpoints";
import type { ApiResult, NotificationResponse } from "../types/notifications.api.types";

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
    const res = await apiClient.get<ApiResult<NotificationResponse[]>>(NOTIFICATIONS_ENDPOINTS.BASE, { params });
    const unwrapped = unwrapApiResult<NotificationResponse[]>(res.data);
    return { rows: unwrapped.data ?? [], meta: unwrapped.meta };
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await apiClient.get<ApiResult<number>>(NOTIFICATIONS_ENDPOINTS.UNREAD_COUNT);
    const unwrapped = unwrapApiResult<number>(res.data);
    return Number(unwrapped.data ?? 0);
  },

  markRead: async (id: number): Promise<void> => {
    await apiClient.patch<ApiResult<void>>(NOTIFICATIONS_ENDPOINTS.MARK_READ(id));
  },

  markAllRead: async (): Promise<void> => {
    await apiClient.post<ApiResult<void>>(NOTIFICATIONS_ENDPOINTS.MARK_ALL_READ, null);
  },

  deleteOne: async (id: number): Promise<void> => {
    await apiClient.delete<ApiResult<void>>(NOTIFICATIONS_ENDPOINTS.DELETE_ONE(id));
  },

  deleteBulk: async (ids: number[]): Promise<void> => {
    await apiClient.delete<ApiResult<void>>(NOTIFICATIONS_ENDPOINTS.DELETE_BULK, { data: ids });
  },

  clearAll: async (): Promise<void> => {
    await apiClient.delete<ApiResult<void>>(NOTIFICATIONS_ENDPOINTS.CLEAR_ALL);
  },
};

