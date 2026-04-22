import { useI18n } from "@shared/i18n/useI18n";

interface BookingPurposeSectionProps {
  readonly purpose: string;
}

export function BookingPurposeSection({ purpose }: BookingPurposeSectionProps) {
  const { t } = useI18n();

  return (
    <section className="bg-surface-container-lowest p-5 sm:p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
      <h3 className="text-lg font-bold mb-4 text-on-surface font-headline">
        {t("bookings.detail.sections.purpose")}
      </h3>
      <p className="text-on-surface-variant leading-relaxed">
        {purpose}
      </p>
    </section>
  );
}
