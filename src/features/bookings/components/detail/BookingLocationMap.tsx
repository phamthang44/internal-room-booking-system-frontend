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
    <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
      <div className="h-48 w-full bg-surface-container-high">
        <img
          alt={t("bookings.detail.map.alt")}
          className="w-full h-full object-cover"
          src={map.imageUrl}
        />
      </div>
      <div className="p-6">
        <h4 className="text-sm font-bold text-on-surface mb-1 font-headline">
          {map.title}
        </h4>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          {map.description}
        </p>
        <button
          type="button"
          className="mt-4 w-full py-2 px-4 bg-surface-container-low hover:bg-surface-container-high text-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">directions</span>
          {t("bookings.detail.map.viewFloorMap")}
        </button>
      </div>
    </section>
  );
}
