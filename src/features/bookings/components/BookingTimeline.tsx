import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { BookingTimelineEvent } from "@/data/mockData";
import { formatBookingHistoryTitle, type TranslateFn } from "../utils/formatBookingHistory";

export interface BookingTimelineProps {
  readonly title: string;
  readonly events: readonly BookingTimelineEvent[];
  readonly className?: string;
}

function resolveEventTitle(t: TranslateFn, ev: BookingTimelineEvent): string {
  const hasCodes = Boolean(ev.action?.trim() || ev.statusAfter?.trim());
  if (hasCodes) {
    return formatBookingHistoryTitle(t, ev.action, ev.statusAfter, ev.title);
  }
  return ev.title ?? "";
}

export function BookingTimeline({
  title,
  events,
  className,
}: Readonly<BookingTimelineProps>) {
  const { t } = useI18n();
  return (
    <section
      className={cn(
        "rounded-3xl bg-surface-container-lowest p-6 sm:p-8 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]",
        className
      )}
    >
      <div className="flex items-center gap-2.5 mb-7">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[18px]">history</span>
        </div>
        <h3 className="text-base font-bold text-on-surface font-headline">
          {title}
        </h3>
      </div>

      <div className="relative space-y-7 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-outline-variant/20">
        {events.map((ev) => (
          <div key={ev.id} className="relative pl-11">
            <div
              className={cn(
                "absolute left-0.5 top-0.5 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest shadow-2xs",
                ev.tone === "primary"
                  ? "bg-emerald-600 text-white"
                  : ev.tone === "danger"
                    ? "bg-rose-600 text-white"
                    : "bg-surface-container-high text-on-surface-variant"
              )}
            >
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {ev.icon}
              </span>
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-bold tracking-tight",
                  ev.tone === "danger" ? "text-error" : "text-on-surface",
                )}
              >
                {resolveEventTitle(t, ev)}
              </p>
              <p className="text-xs text-on-surface-variant/80 mt-0.5">{ev.atLabel}</p>
              {ev.note ? (
                <p className="text-xs text-on-surface-variant mt-2 p-2.5 rounded-xl bg-surface-container-low/50 border border-outline-variant/10 italic">
                  {ev.note}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

