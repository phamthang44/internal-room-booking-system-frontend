interface BookingProTipProps {
  readonly title: string;
  readonly message: string;
}

export function BookingProTip({ title, message }: BookingProTipProps) {
  return (
    <section className="rounded-3xl bg-primary/5 p-5 border border-primary/15 text-on-surface">
      <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs font-headline">
        <span className="material-symbols-outlined text-[18px]">verified</span>
        <span>{title}</span>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
        {message}
      </p>
    </section>
  );
}
