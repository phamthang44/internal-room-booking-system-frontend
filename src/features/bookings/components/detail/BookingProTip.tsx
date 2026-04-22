interface BookingProTipProps {
  readonly title: string;
  readonly message: string;
}

export function BookingProTip({ title, message }: BookingProTipProps) {
  return (
    <section className="bg-primary-container p-6 rounded-2xl text-on-primary-container">
      <h3 className="text-sm font-bold mb-2 flex items-center gap-2 font-headline">
        <span className="material-symbols-outlined text-lg">info</span>
        {title}
      </h3>
      <p className="text-xs leading-relaxed opacity-90">
        {message}
      </p>
    </section>
  );
}
