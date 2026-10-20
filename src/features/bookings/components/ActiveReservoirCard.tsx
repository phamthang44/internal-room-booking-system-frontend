import { useI18n } from "@shared/i18n/useI18n";

export interface ActiveReservoirCardProps {
  readonly title: string;
  readonly description: string;
  readonly reservedSlots: number;
  readonly className?: string;
}

export function ActiveReservoirCard({
  title,
  description,
  reservedSlots,
  className,
}: Readonly<ActiveReservoirCardProps>) {
  const { t } = useI18n();

  return (
    <section
      className={[
        "relative overflow-hidden rounded-3xl bg-surface-container-lowest p-6 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)] flex flex-col justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">event_seat</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {reservedSlots > 0 ? "Đang giữ chỗ" : "Sẵn sàng"}
          </span>
        </div>

        <h3 className="text-base font-bold text-on-surface font-headline mb-1">{title}</h3>
        <p className="text-on-surface-variant text-xs leading-relaxed font-medium">{description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/10">
        <div className="text-4xl font-extrabold font-headline text-primary tracking-tight">
          {reservedSlots}
        </div>
        <div className="text-xs font-semibold text-on-surface-variant/80 mt-1 uppercase tracking-wider">
          {t("bookings.summary.reservedSlotsLabel")}
        </div>
      </div>
    </section>
  );
}

