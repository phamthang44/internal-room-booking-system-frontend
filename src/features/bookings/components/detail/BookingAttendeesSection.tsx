import { useI18n } from "@shared/i18n/useI18n";

interface BookingAttendeesSectionProps {
  readonly attendeesCount: number;
}

export function BookingAttendeesSection({ attendeesCount }: BookingAttendeesSectionProps) {
  const { t } = useI18n();

  return (
    <section className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-bold text-on-surface font-headline">
          {t("bookings.detail.sections.attendees")}
        </h3>
        <span className="text-sm font-medium text-primary bg-primary-fixed px-2 py-1 rounded">
          {t("bookings.detail.attendeesCount", { count: attendeesCount })}
        </span>
      </div>
      <p className="text-sm text-on-surface-variant">
        {t("bookings.detail.attendeesHidden")}
      </p>
    </section>
  );
}
