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
        "bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]",
        className
      )}
    >
      <h3 className="text-lg font-bold mb-8 text-on-surface font-headline">
        {title}
      </h3>

      <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-surface-container-high">
        {events.map((ev) => (
          <div key={ev.id} className="relative pl-10">
            <div
              className={cn(
                "absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-surface-container-lowest",
                ev.tone === "primary"
                  ? "bg-tertiary-fixed"
                  : ev.tone === "danger"
                    ? "bg-error"
                    : "bg-surface-container-high"
              )}
            >
              <span
                className={cn(
                  "material-symbols-outlined text-sm",
                  ev.tone === "primary"
                    ? "text-on-tertiary-fixed"
                    : ev.tone === "danger"
                      ? "text-on-error"
                      : "text-on-surface-variant"
                )}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {ev.icon}
              </span>
            </div>
            <div>
              <p
                className={cn(
                  "text-sm font-bold",
                  ev.tone === "danger" ? "text-error" : "text-on-surface",
                )}
              >
                {resolveEventTitle(t, ev)}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">{ev.atLabel}</p>
              {ev.note ? (
                <p className="text-sm text-on-surface-variant mt-2 italic">
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

