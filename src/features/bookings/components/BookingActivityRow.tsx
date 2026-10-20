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
        "w-full text-left bg-surface-container-lowest p-4 sm:p-5 rounded-2xl",
        "border border-outline-variant/15 shadow-2xs",
        "flex flex-wrap items-center justify-between gap-4 group transition-all duration-200 hover:shadow-md hover:border-primary/25 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
      )}
    >
      <div className="flex flex-1 items-center gap-3.5 min-w-[220px]">
        <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary border border-primary/15 flex items-center justify-center shrink-0 transition-transform group-hover:scale-105">
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        </div>

        <div className="min-w-0">
          <h4 className="font-bold text-on-surface truncate text-sm sm:text-base flex items-center gap-1.5">
            <span>{item.roomCode}</span>
            <span className="text-on-surface-variant/40">•</span>
            <span className="text-xs sm:text-sm font-medium text-on-surface-variant truncate">{item.roomName}</span>
          </h4>
          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant bg-surface-container-low/70 px-2.5 py-0.5 rounded-md border border-outline-variant/10">
              <span className="material-symbols-outlined text-[13px]">calendar_today</span>
              {item.dateLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant bg-surface-container-low/70 px-2.5 py-0.5 rounded-md border border-outline-variant/10">
              <span className="material-symbols-outlined text-[13px]">schedule</span>
              {item.time.startTime} - {item.time.endTime}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {chipStatus ? (
          <StatusChip
            status={chipStatus}
            className="px-3 py-1 text-xs font-bold uppercase tracking-wider"
          />
        ) : (
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-bold border border-outline-variant/20 whitespace-nowrap shrink-0",
              fallbackStyles(item.status)
            )}
          >
            {t(`bookings.status.${item.status}`)}
          </span>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{t("bookings.viewDetails")}</span>
          <span className="material-symbols-outlined text-[16px] transition-transform group-hover:translate-x-0.5">arrow_forward</span>
        </div>

        {item.canCancel && onCancel ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(item.id);
            }}
            className="text-error font-semibold text-xs px-2.5 py-1 rounded-lg hover:bg-error-container/15 transition-colors"
          >
            {t("bookings.detail.actions.cancelBooking")}
          </button>
        ) : null}
      </div>
    </div>
  );
}

