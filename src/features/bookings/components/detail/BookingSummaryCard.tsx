import { StatusChip } from "@shared/components/StatusChip";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { ReactNode } from "react";

interface BookingSummaryCardProps {
  readonly status: string;
  readonly chipStatus: "confirmed" | "pending" | "cancelled" | "rejected" | null;
  readonly title: string;
  readonly bookingCode: string;
  readonly location: {
    readonly primary: string;
    readonly secondary?: string;
  };
  readonly schedule: {
    readonly dateLabel: string;
    readonly timeLabel: string;
  };
  readonly children?: ReactNode;
}

export function BookingSummaryCard({
  status,
  chipStatus,
  title,
  bookingCode,
  location,
  schedule,
  children,
}: BookingSummaryCardProps) {
  const { t } = useI18n();

  return (
    <section className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          {chipStatus ? (
            <StatusChip
              status={chipStatus}
              className="px-3 py-1 text-xs font-bold tracking-wider uppercase"
            />
          ) : (
            <span
              className={cn(
                "px-3 py-1 text-xs font-bold tracking-wider rounded-full uppercase",
                status === "inUse"
                  ? "bg-primary-container text-on-primary-container"
                  : status === "completed"
                    ? "bg-tertiary-fixed/20 text-on-tertiary-container border border-tertiary-fixed/30"
                  : "bg-surface-container-high text-on-surface-variant",
              )}
            >
              {t(`bookings.status.${status}`)}
            </span>
          )}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
            {title}
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            {bookingCode}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-surface-container-low rounded-xl text-primary">
            <span className="material-symbols-outlined">location_on</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              {t("bookings.detail.labels.location")}
            </p>
            <p className="text-base font-medium text-on-surface">
              {location.primary}
            </p>
            {location.secondary ? (
              <p className="text-sm text-on-surface-variant">
                {location.secondary}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-3 bg-surface-container-low rounded-xl text-primary">
            <span className="material-symbols-outlined">calendar_today</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              {t("bookings.detail.labels.dateTime")}
            </p>
            <p className="text-base font-medium text-on-surface">
              {schedule.dateLabel}
            </p>
            <p className="text-sm text-on-surface-variant">
              {schedule.timeLabel}
            </p>
          </div>
        </div>
      </div>

      {children && <div className="mt-6">{children}</div>}
    </section>
  );
}
