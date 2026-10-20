import { useI18n } from "@shared/i18n/useI18n";

interface BookingAttendeesSectionProps {
  readonly attendeesCount: number;
}

export function BookingAttendeesSection({ attendeesCount }: BookingAttendeesSectionProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl bg-surface-container-lowest p-6 sm:p-7 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[18px]">groups</span>
          </div>
          <h3 className="text-base font-bold text-on-surface font-headline">
            {t("bookings.detail.sections.attendees")}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          <span className="material-symbols-outlined text-[14px]">person</span>
          {t("bookings.detail.attendeesCount", { count: attendeesCount })}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant font-medium">
        {t("bookings.detail.attendeesHidden")}
      </p>
    </section>
  );
}
