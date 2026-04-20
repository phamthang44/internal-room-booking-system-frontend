import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApiService } from "../api/notifications.api.service";
import type { NotificationResponse } from "../types/notifications.api.types";

export const notificationsQueryKeys = {
  all: ["notifications"] as const,
  list: (params: { page: number; size: number }) =>
    [...notificationsQueryKeys.all, "list", params] as const,
  unreadCount: () => [...notificationsQueryKeys.all, "unreadCount"] as const,
};

export interface NotificationsListQueryParams {
  /** 1-indexed per API contract */
  page: number;
  size: number;
}

export function useNotificationsListQuery(params: NotificationsListQueryParams) {
  const apiParams = useMemo(
    () => ({
      page: Math.max(1, params.page),
      size: Math.max(1, params.size),
    }),
    [params.page, params.size],
  );

  return useQuery({
    queryKey: notificationsQueryKeys.list(apiParams),
    queryFn: () => notificationsApiService.list(apiParams),
    staleTime: 1000 * 20,
  });
}

export function useUnreadNotificationCountQuery() {
  return useQuery({
    queryKey: notificationsQueryKeys.unreadCount(),
    queryFn: () => notificationsApiService.getUnreadCount(),
    staleTime: 1000 * 10,
  });
}

function setReadFlag(rows: NotificationResponse[], id: number): { rows: NotificationResponse[]; changed: boolean; wasUnread: boolean } {
  let changed = false;
  let wasUnread = false;

  const next = rows.map((n) => {
    if (n.id !== id) return n;
    const unread = n.isRead === false || n.isRead == null;
    if (!unread) return { ...n, isRead: true };
    changed = true;
    wasUnread = true;
    return { ...n, isRead: true };
  });

  return { rows: next, changed, wasUnread };
}

function markAllRead(rows: NotificationResponse[]): NotificationResponse[] {
  return rows.map((n) => (n.isRead ? n : { ...n, isRead: true }));
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationsApiService.markRead(id),
    meta: { skipGlobalError: true },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKeys.all });

      const previousUnread = queryClient.getQueryData<number>(notificationsQueryKeys.unreadCount());
      const previousLists = queryClient.getQueriesData<{ rows: NotificationResponse[]; meta?: unknown }>({
        queryKey: notificationsQueryKeys.all,
      });

      let didDecrement = false;

      for (const [key, cached] of previousLists) {
        if (!cached?.rows) continue;
        const updated = setReadFlag(cached.rows, id);
        if (updated.changed) {
          queryClient.setQueryData(key, { ...cached, rows: updated.rows });
          if (updated.wasUnread && !didDecrement) {
            didDecrement = true;
          }
        }
      }

      if (didDecrement) {
        queryClient.setQueryData<number>(
          notificationsQueryKeys.unreadCount(),
          (prev) => Math.max(0, Number(prev ?? 0) - 1),
        );
      }

      return { previousUnread, previousLists };
    },
    onError: (_err, _id, context) => {
      if (!context) return;
      if (context.previousUnread != null) {
        queryClient.setQueryData(notificationsQueryKeys.unreadCount(), context.previousUnread);
      }
      for (const [key, data] of context.previousLists) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.all });
    },
  });
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApiService.markAllRead(),
    meta: { skipGlobalError: true },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKeys.all });

      const previousUnread = queryClient.getQueryData<number>(notificationsQueryKeys.unreadCount());
      const previousLists = queryClient.getQueriesData<{ rows: NotificationResponse[]; meta?: unknown }>({
        queryKey: notificationsQueryKeys.all,
      });

      for (const [key, cached] of previousLists) {
        if (!cached?.rows) continue;
        queryClient.setQueryData(key, { ...cached, rows: markAllRead(cached.rows) });
      }

      queryClient.setQueryData<number>(notificationsQueryKeys.unreadCount(), 0);

      return { previousUnread, previousLists };
    },
    onError: (_err, _vars, context) => {
      if (!context) return;
      if (context.previousUnread != null) {
        queryClient.setQueryData(notificationsQueryKeys.unreadCount(), context.previousUnread);
      }
      for (const [key, data] of context.previousLists) {
        queryClient.setQueryData(key, data);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.all });
    },
  });
}

