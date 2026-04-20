import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { formatIsoRelativeCaption } from "@shared/utils/date";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@shared/components/ui/popover";
import type { NotificationResponse, NotificationTypeApi } from "../types/notifications.api.types";
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsListQuery,
  useUnreadNotificationCountQuery,
} from "../hooks/useNotifications";

function iconForType(type?: NotificationTypeApi): string {
  switch (type) {
    case "BOOKING_STATUS":
      return "event_available";
    case "SYSTEM_ALERT":
      return "campaign";
    default:
      return "notifications";
  }
}

function canNavigate(n: NotificationResponse): boolean {
  return n.type === "BOOKING_STATUS" && Boolean(n.relatedId);
}

function bookingIdFromRelatedId(relatedId?: string): string | null {
  if (!relatedId) return null;
  const trimmed = String(relatedId).trim();
  if (!trimmed) return null;
  // Accept numeric IDs and strings like "BK-123" by extracting the last number group.
  const m = trimmed.match(/(\d+)/g);
  const last = m?.[m.length - 1] ?? null;
  return last ?? null;
}

function stablePreviewCount(size: number): number {
  return Math.min(Math.max(size, 5), 20);
}

export function NotificationsPopover() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const pageSize = useMemo(() => stablePreviewCount(20), []);
  const unread = useUnreadNotificationCountQuery();
  const list = useNotificationsListQuery({ page: 1, size: pageSize });
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();

  const unreadCount = unread.data ?? 0;
  const rows = list.data?.rows ?? [];

  const busy = markRead.isPending || markAllRead.isPending;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={t("notifications.bell.ariaLabel")}
          className="relative ml-2 flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          {unreadCount > 0 ? (
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full px-1.5 py-0.5 text-[10px] font-extrabold",
                "bg-error text-on-error shadow-sm",
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-[360px] p-0 overflow-hidden z-[80]"
      >
        <div className="border-b border-outline-variant/20 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-headline text-sm font-extrabold text-on-surface truncate">
                {t("notifications.popover.title")}
              </p>
              <p className="text-[11px] text-on-surface-variant">
                {unread.isLoading
                  ? t("notifications.popover.loadingCaption")
                  : unreadCount > 0
                    ? t("notifications.popover.unreadCount", {
                        count: unreadCount,
                      })
                    : t("notifications.popover.allCaughtUp")}
              </p>
            </div>

            <button
              type="button"
              disabled={busy || unreadCount === 0}
              onClick={() => markAllRead.mutate()}
              className={cn(
                "h-9 rounded-xl px-3 text-xs font-bold transition-colors",
                unreadCount === 0
                  ? "text-on-surface-variant/40"
                  : "text-primary hover:bg-primary/10",
                busy ? "opacity-60" : "",
              )}
            >
              {t("notifications.actions.markAllRead")}
            </button>
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {list.isLoading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-14 rounded-xl bg-surface-container-lowest/60 animate-pulse"
                />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="p-6 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-on-surface-variant">
                <span className="material-symbols-outlined text-[22px]">notifications</span>
              </div>
              <p className="text-sm font-semibold text-on-surface">
                {t("notifications.empty.title")}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                {t("notifications.empty.caption")}
              </p>
            </div>
          ) : (
            <div className="p-2">
              {rows.map((n) => {
                const id = n.id ?? 0;
                const isUnread = n.isRead === false || n.isRead == null;
                const caption = n.createdAt ? formatIsoRelativeCaption(n.createdAt) : "";
                const clickable = canNavigate(n);

                return (
                  <button
                    key={String(n.id ?? `${n.title}-${n.createdAt}`)}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      if (id > 0 && isUnread) {
                        markRead.mutate(id);
                      }
                      if (clickable) {
                        const bookingId = bookingIdFromRelatedId(n.relatedId ?? undefined);
                        if (bookingId) {
                          navigate(`/bookings/${bookingId}`);
                        }
                      }
                    }}
                    className={cn(
                      "w-full rounded-xl px-3 py-2 text-left transition-colors",
                      "hover:bg-surface-container-lowest/70 disabled:opacity-60",
                      isUnread ? "bg-primary/5" : "",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          isUnread
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-container-low text-on-surface-variant",
                        )}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {iconForType(n.type)}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "truncate text-sm font-semibold",
                              isUnread ? "text-on-surface" : "text-on-surface-variant",
                            )}
                          >
                            {n.title ?? t("notifications.item.fallbackTitle")}
                          </p>
                          {caption ? (
                            <span className="shrink-0 text-[10px] text-on-surface-variant/70">
                              {caption}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-on-surface-variant">
                          {n.message ?? ""}
                        </p>

                        {clickable ? (
                          <div className="mt-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary/80">
                            <span>{t("notifications.item.viewDetails")}</span>
                            <span className="material-symbols-outlined text-[14px]">
                              chevron_right
                            </span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {list.isError ? (
          <div className="border-t border-outline-variant/20 px-4 py-3 text-xs text-error">
            {t("notifications.popover.loadFailed")}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

