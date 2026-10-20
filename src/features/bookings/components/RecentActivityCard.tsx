import type { BookingActivityItem } from "@/data/mockData";
import { BookingActivityRow } from "./BookingActivityRow";

export interface RecentActivityCardProps {
  readonly title: string;
  readonly downloadLabel: string;
  readonly emptyLabel?: string;
  readonly items: readonly BookingActivityItem[];
  readonly onOpenBooking: (bookingId: string) => void;
  readonly onDownloadReport?: () => void;
  readonly onCancelBooking?: (bookingId: string) => void;
  readonly className?: string;
}

export function RecentActivityCard({
  title,
  downloadLabel,
  emptyLabel,
  items,
  onOpenBooking,
  onDownloadReport,
  onCancelBooking,
  className,
}: Readonly<RecentActivityCardProps>) {
  return (
    <section className={["rounded-3xl bg-surface-container-low/50 p-5 sm:p-7 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.03)]", className].filter(Boolean).join(" ")}>
      <div className="flex justify-between items-center mb-5 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold font-headline text-on-surface">{title}</h3>
        </div>
        {onDownloadReport && <button
          type="button"
          onClick={onDownloadReport}
          className="text-primary text-xs font-bold cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity bg-surface-container-lowest px-3 py-1.5 rounded-xl border border-outline-variant/15 shadow-2xs"
        >
          {downloadLabel}
          <span className="material-symbols-outlined text-sm">download</span>
        </button>}
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-lowest p-8 text-center text-sm text-on-surface-variant border border-outline-variant/10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/60 mb-3">
            <span className="material-symbols-outlined text-2xl">event_busy</span>
          </div>
          <p className="font-semibold text-on-surface">{emptyLabel ?? "No recent activity."}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <BookingActivityRow
              key={item.id}
              item={item}
              onOpen={onOpenBooking}
              onCancel={onCancelBooking}
            />
          ))}
        </div>
      )}
    </section>
  );
}

