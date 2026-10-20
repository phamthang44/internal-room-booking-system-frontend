import { useI18n } from "@shared/i18n/useI18n";

interface BookingPurposeSectionProps {
  readonly purpose: string;
}

export function BookingPurposeSection({ purpose }: BookingPurposeSectionProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl bg-surface-container-lowest p-6 sm:p-7 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[18px]">format_quote</span>
        </div>
        <h3 className="text-base font-bold text-on-surface font-headline">
          {t("bookings.detail.sections.purpose")}
        </h3>
      </div>
      <div className="p-4 rounded-2xl bg-surface-container-low/40 border border-outline-variant/10 text-on-surface text-sm leading-relaxed font-medium">
        {purpose || "Không có ghi chú mục đích chi tiết."}
      </div>
    </section>
  );
}
