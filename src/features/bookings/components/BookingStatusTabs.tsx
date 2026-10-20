import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { MyBookingsFilter } from "../hooks/useMyBookings";

export interface BookingStatusTabsProps {
  readonly value: MyBookingsFilter;
  readonly onChange: (value: MyBookingsFilter) => void;
  readonly className?: string;
}

export function BookingStatusTabs({
  value,
  onChange,
  className,
}: Readonly<BookingStatusTabsProps>) {
  const { t } = useI18n();
  const TABS: ReadonlyArray<{ readonly value: MyBookingsFilter; readonly label: string }> =
    [
      { value: "all", label: t("bookings.tabs.all") },
      { value: "pending", label: t("bookings.tabs.pending") },
      { value: "completed", label: t("bookings.tabs.completed") },
    ];

  return (
    <div className={cn("inline-flex items-center gap-1 p-1 rounded-2xl bg-surface-container-low/70 border border-outline-variant/15 shadow-2xs", className)}>
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.value)}
            className={cn(
              "px-3.5 py-1.5 text-xs rounded-xl font-bold transition-all duration-200 select-none whitespace-nowrap",
              isActive
                ? "bg-surface-container-lowest text-primary shadow-xs"
                : "text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-container-lowest/50"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

