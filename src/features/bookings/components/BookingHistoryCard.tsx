import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { BookingHistoryItem } from "@/data/mockData";

export interface BookingHistoryCardProps {
  readonly item: BookingHistoryItem;
  readonly onOpen: (bookingId: string) => void;
}

function statusClassName(status: BookingHistoryItem["status"]) {
  if (status === "cancelled")
    return "bg-surface-container-highest text-on-surface-variant";
  if (status === "completed")
    return "bg-tertiary-fixed/10 text-on-tertiary-fixed-variant";
  return "bg-error-container text-on-error-container";
}

export function BookingHistoryCard({ item, onOpen }: Readonly<BookingHistoryCardProps>) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className={cn(
        "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 text-left",
        "transition-shadow hover:shadow-[0_8px_24px_rgba(24,28,30,0.06)] focus:outline-none focus:ring-2 focus:ring-primary/20"
      )}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="bg-surface-container-low w-10 h-10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-on-surface-variant">
            history
          </span>
        </div>
        <span
          className={cn(
            "px-2 py-0.5 rounded text-[9px] font-bold border border-outline-variant/10",
            statusClassName(item.status)
          )}
        >
          {t(`bookings.status.${item.status}`)}
        </span>
      </div>

      <h5 className="font-bold text-on-surface">{item.roomLabel}</h5>
      <p className="text-xs text-on-surface-variant mt-1">{item.dateTimeLabel}</p>

      <div className="mt-4 pt-4 border-t border-outline-variant/10">
        <span className="text-xs font-bold text-primary inline-flex items-center gap-1">
          {t("bookings.viewDetails")}
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </span>
      </div>
    </button>
  );
}

