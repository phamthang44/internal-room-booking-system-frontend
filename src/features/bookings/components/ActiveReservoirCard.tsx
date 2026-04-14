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
  return (
    <section
      className={[
        "bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div>
        <span
          className="material-symbols-outlined text-4xl mb-4"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          calendar_month
        </span>
        <h3 className="text-xl font-bold mb-1 font-headline">{title}</h3>
        <p className="text-on-primary-container text-sm opacity-80">{description}</p>
      </div>

      <div className="mt-8">
        <div className="text-4xl font-extrabold font-headline">
          {String(reservedSlots).padStart(2, "0")}
        </div>
        <div className="text-xs uppercase tracking-widest opacity-60">
          Reserved Slots
        </div>
      </div>
    </section>
  );
}

