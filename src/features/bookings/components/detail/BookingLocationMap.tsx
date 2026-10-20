import { useI18n } from "@shared/i18n/useI18n";

interface BookingLocationMapProps {
  readonly map: {
    readonly imageUrl: string;
    readonly title: string;
    readonly description: string;
  };
}

export function BookingLocationMap({ map }: BookingLocationMapProps) {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl bg-surface-container-lowest overflow-hidden border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]">
      <div className="relative h-44 w-full bg-surface-container-high overflow-hidden">
        <img
          alt={t("bookings.detail.map.alt")}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          src={map.imageUrl}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 text-white text-xs font-bold drop-shadow-md">
          <span className="material-symbols-outlined text-[16px] text-amber-300">location_on</span>
          <span>{map.title}</span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {map.description}
        </p>
        <button
          type="button"
          className="mt-4 w-full py-2.5 px-4 bg-surface-container-low hover:bg-surface-container text-primary text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-outline-variant/15 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          {t("bookings.detail.map.viewFloorMap")}
        </button>
      </div>
    </section>
  );
}
