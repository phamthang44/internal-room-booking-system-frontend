import { cn } from "@shared/utils/cn";

export function AdminRoomAuditImageCarousel(props: {
  images: string[];
  idx: number;
  setIdx: (idx: number) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const { images, idx, setIdx, t } = props;
  const activeIdx = images.length > 0 ? idx % images.length : 0;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl">
      <div className="relative aspect-[21/9] w-full bg-surface-container-low">
        <img
          src={images[activeIdx]}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/10" />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={String(i)}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                "h-3 w-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                i === activeIdx ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
              aria-label={t("adminRooms.audit.carousel.dotLabel", {
                index: i + 1,
              })}
            />
          ))}
        </div>
        <button
          type="button"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setIdx((idx - 1 + images.length) % images.length)}
          aria-label={t("adminRooms.audit.carousel.prev")}
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-3 text-white backdrop-blur-md transition-colors hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setIdx((idx + 1) % images.length)}
          aria-label={t("adminRooms.audit.carousel.next")}
        >
          <span className="material-symbols-outlined text-[20px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}

