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
    <div className={cn("flex gap-2 rounded-xl bg-surface-container-low p-1", className)}>
      {TABS.map((tab) => {
        const isActive = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              "px-6 py-2 text-sm rounded-lg transition-colors",
              isActive
                ? "bg-surface-container-lowest shadow-sm font-bold text-primary"
                : "font-medium text-on-surface-variant hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

