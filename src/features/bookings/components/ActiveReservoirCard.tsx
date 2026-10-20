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
        "bg-surface-container-lowest text-on-surface p-6 rounded-2xl flex flex-col justify-between ring-1 ring-primary/5 self-start",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <h3 className="text-base font-semibold mb-2 font-headline">{title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{description}</p>
      </div>

      <div className="mt-6">
        <div className="text-3xl font-semibold font-headline text-primary">
          {reservedSlots}
        </div>
        <div className="text-xs text-on-surface-variant mt-1">
          {t("bookings.summary.reservedSlotsLabel")}
        </div>
      </div>
    </section>
  );
}

