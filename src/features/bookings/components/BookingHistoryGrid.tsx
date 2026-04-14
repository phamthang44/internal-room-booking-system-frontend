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
          "bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10",
          "flex flex-col justify-center items-center text-center group cursor-pointer",
          "hover:bg-surface-container-low transition-colors border-dashed border-outline-variant/40",
          "focus:outline-none focus:ring-2 focus:ring-primary/20"
        )}
      >
        <span className="material-symbols-outlined text-3xl text-outline-variant group-hover:text-primary transition-colors">
          add_circle
        </span>
        <span className="text-sm font-bold mt-2 text-on-surface-variant group-hover:text-primary transition-colors">
          {ctaLabel}
        </span>
      </button>
    </section>
  );
}

