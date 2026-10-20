import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { BookingHistoryItem } from "@/data/mockData";

export interface BookingHistoryCardProps {
  readonly item: BookingHistoryItem;
  readonly onOpen: (bookingId: string) => void;
}

function statusClassName(status: BookingHistoryItem["status"]) {
  if (status === "completed")
    return "bg-tertiary-fixed/20 text-on-tertiary-container border-tertiary-fixed/30";
  return "bg-rose-50 text-rose-700 border-rose-200/60";
}

export function BookingHistoryCard({ item, onOpen }: Readonly<BookingHistoryCardProps>) {
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      className={cn(
        "group bg-surface-container-lowest p-5 sm:p-6 rounded-3xl border border-outline-variant/15 text-left",
        "transition-all duration-200 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/20",
        "flex flex-col justify-between"
      )}
    >
      <div>
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="bg-primary/10 w-10 h-10 rounded-2xl flex items-center justify-center text-primary border border-primary/15 transition-transform group-hover:scale-110">
            <span className="material-symbols-outlined text-[20px]">
              meeting_room
            </span>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap shrink-0",
              statusClassName(item.status)
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
            {t(`bookings.status.${item.status}`)}
          </span>
        </div>

        <h5 className="font-bold text-on-surface text-base group-hover:text-primary transition-colors tracking-tight line-clamp-1">{item.roomLabel}</h5>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-2 font-medium">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>{item.dateTimeLabel}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-outline-variant/10 flex items-center justify-between">
        <span className="text-xs font-bold text-primary inline-flex items-center gap-1">
          {t("bookings.viewDetails")}
          <span className="material-symbols-outlined text-xs transition-transform group-hover:translate-x-1">arrow_forward</span>
        </span>
        <span className="font-mono text-[11px] text-on-surface-variant/60 font-medium">
          #{item.id}
        </span>
      </div>
    </button>
  );
}

