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
    <section className="relative overflow-hidden rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-[0_12px_36px_-6px_rgba(24,28,30,0.06)]">
      {/* Decorative top accent line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary-container" />

      <div className="p-6 sm:p-8">
        {/* Pass Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-outline-variant/15">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
              Mã đặt phòng
            </span>
            <span className="font-mono text-xs font-bold text-on-surface bg-surface-container-low px-2 py-0.5 rounded-md">
              {bookingCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {chipStatus ? (
              <StatusChip
                status={chipStatus}
                className="px-3 py-1 text-xs font-bold tracking-normal uppercase"
              />
            ) : (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full uppercase whitespace-nowrap",
                  status === "inUse"
                    ? "bg-primary-container text-on-primary-container border border-primary/20"
                    : status === "completed"
                      ? "bg-tertiary-fixed/20 text-on-tertiary-container border border-tertiary-fixed/30"
                      : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20",
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-75 shrink-0" />
                {t(`bookings.status.${status}`)}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="pt-6 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
            <span className="material-symbols-outlined text-[16px]">meeting_room</span>
            <span>Không gian học tập & nghiên cứu</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
            {title}
          </h2>
        </div>

        {/* Bento Coordinates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Date */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 transition-colors hover:bg-surface-container-low">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary shrink-0">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                {t("bookings.detail.labels.dateTime")}
              </p>
              <p className="text-sm font-bold text-on-surface mt-0.5">
                {schedule.dateLabel}
              </p>
              <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                {schedule.timeLabel}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-surface-container-low/50 border border-outline-variant/10 transition-colors hover:bg-surface-container-low">
            <div className="p-2.5 bg-tertiary-fixed/40 rounded-xl text-on-tertiary-fixed shrink-0">
              <span className="material-symbols-outlined text-[20px]">location_on</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                {t("bookings.detail.labels.location")}
              </p>
              <p className="text-sm font-bold text-on-surface mt-0.5 truncate">
                {location.primary}
              </p>
              {location.secondary ? (
                <p className="text-xs text-on-surface-variant mt-0.5 truncate">
                  {location.secondary}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action button section (checkin/checkout) */}
        {children && <div className="mt-6 pt-6 border-t border-outline-variant/15">{children}</div>}
      </div>
    </section>
  );
}
