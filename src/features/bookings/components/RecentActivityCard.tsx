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
    <section className={["bg-surface-container-low p-4 sm:p-6 md:p-8 rounded-2xl", className].filter(Boolean).join(" ")}>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h3 className="text-lg font-bold font-headline text-on-surface">{title}</h3>
        <button
          type="button"
          onClick={onDownloadReport}
          className="text-primary text-sm font-bold cursor-pointer flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          {downloadLabel}
          <span className="material-symbols-outlined text-sm">download</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
          {emptyLabel ?? "No recent activity."}
        </div>
      ) : (
        <div className="space-y-4">
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

