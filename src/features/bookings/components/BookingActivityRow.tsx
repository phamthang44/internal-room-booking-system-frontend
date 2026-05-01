import { useMemo, type KeyboardEvent } from "react";
import { StatusChip } from "@shared/components/StatusChip";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type { BookingActivityItem, BookingStatus } from "@/data/mockData";

export interface BookingActivityRowProps {
  readonly item: BookingActivityItem;
  readonly onOpen: (bookingId: string) => void;
  readonly onCancel?: (bookingId: string) => void;
}

function mapToChipStatus(status: BookingStatus) {
  if (status === "confirmed") return "confirmed" as const;
  if (status === "pending") return "pending" as const;
  if (status === "cancelled") return "cancelled" as const;
  if (status === "rejected") return "rejected" as const;
  return null;
}

function fallbackStyles(status: BookingStatus) {
  if (status === "rejected") return "bg-error-container text-on-error-container";
  if (status === "inUse") return "bg-primary-container text-on-primary-container";
  if (status === "completed")
    return "bg-tertiary-fixed/10 text-on-tertiary-fixed-variant border border-tertiary-fixed/20";
  return "bg-surface-container-highest text-on-surface-variant";
}

export function BookingActivityRow({
  item,
  onOpen,
  onCancel,
}: Readonly<BookingActivityRowProps>) {
  const { t } = useI18n();
  const chipStatus = useMemo(() => mapToChipStatus(item.status), [item.status]);

  const rowLabel = `${item.roomCode} — ${item.roomName}`;

  const openRow = () => {
    onOpen(item.id);
  };

  const handleRowKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openRow();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openRow}
      onKeyDown={handleRowKeyDown}
      aria-label={rowLabel}
      className={cn(
        "w-full text-left bg-surface-container-lowest p-5 rounded-2xl",
        "shadow-[0px_8px_24px_rgba(24,28,30,0.04)]",
        "flex items-center justify-between gap-4 group transition-all hover:scale-[1.01] cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
      )}
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="h-12 w-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined">{item.icon}</span>
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-on-surface truncate">
            {item.roomCode}
            <span className="text-on-surface-variant font-normal mx-2">•</span>
            <span className="text-sm font-medium">{item.roomName}</span>
          </h4>
          <div className="flex flex-wrap gap-4 mt-1">
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">calendar_today</span>
              {item.dateLabel}
            </span>
            <span className="text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">schedule</span>
              {item.time.startTime} - {item.time.endTime}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {chipStatus ? (
          <StatusChip
            status={chipStatus}
            className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-tighter"
          />
        ) : (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tighter border border-outline-variant/20",
              fallbackStyles(item.status)
            )}
          >
            {t(`bookings.status.${item.status}`)}
          </span>
        )}

        {item.canCancel && onCancel ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(item.id);
            }}
            className="text-error font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
          >
            {t("bookings.detail.actions.cancelBooking")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

