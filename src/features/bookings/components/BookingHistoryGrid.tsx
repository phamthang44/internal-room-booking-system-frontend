import { cn } from "@shared/utils/cn";
import type { BookingHistoryItem } from "@/data/mockData";
import { BookingHistoryCard } from "./BookingHistoryCard";

export interface BookingHistoryGridProps {
  readonly items: readonly BookingHistoryItem[];
  readonly ctaLabel: string;
  readonly onOpenBooking: (bookingId: string) => void;
  readonly onCreateNew: () => void;
  readonly className?: string;
}

export function BookingHistoryGrid({
  items,
  ctaLabel,
  onOpenBooking,
  onCreateNew,
  className,
}: Readonly<BookingHistoryGridProps>) {
  return (
    <section className={cn("col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4", className)}>
      {items.map((item) => (
        <BookingHistoryCard key={item.id} item={item} onOpen={onOpenBooking} />
      ))}

      <button
        type="button"
        onClick={onCreateNew}
        className={cn(
          "min-h-[160px] bg-gradient-to-b from-surface-container-low/40 to-surface-container-lowest p-6 rounded-3xl border-2 border-dashed border-outline-variant/30",
          "flex flex-col justify-center items-center text-center group cursor-pointer",
          "hover:border-primary/50 hover:from-primary/5 hover:to-surface-container-lowest transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-xs">
          <span className="material-symbols-outlined text-2xl">
            add
          </span>
        </div>
        <span className="text-sm font-bold mt-3 text-on-surface group-hover:text-primary transition-colors">
          {ctaLabel}
        </span>
        <span className="text-xs text-on-surface-variant/70 mt-0.5 font-medium">
          Khám phá không gian học tập trống
        </span>
      </button>
    </section>
  );
}

