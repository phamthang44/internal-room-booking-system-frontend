import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { RoomAvailabilityUI } from "../types/classroom.api.types";

/** Solid fills + white label/icon: readable on photos and on light surfaces (WCAG-friendly). */
const ROOM_STATUS: Record<
  RoomAvailabilityUI,
  { chip: string; icon: string }
> = {
  available: {
    chip:
      "bg-emerald-700 text-white ring-2 ring-white/25 shadow-md [text-shadow:0_1px_1px_rgba(0,0,0,0.15)] dark:bg-emerald-600 dark:ring-emerald-300/35",
    icon: "check_circle",
  },
  occupied: {
    chip:
      "bg-rose-700 text-white ring-2 ring-white/25 shadow-md [text-shadow:0_1px_1px_rgba(0,0,0,0.15)] dark:bg-rose-600 dark:ring-rose-300/35",
    icon: "do_not_disturb_on",
  },
  maintenance: {
    chip:
      "bg-amber-700 text-white ring-2 ring-white/25 shadow-md [text-shadow:0_1px_1px_rgba(0,0,0,0.12)] dark:bg-amber-600 dark:ring-amber-200/40",
    icon: "construction",
  },
};

/** Card / row accent: colored left bar so status is visible in grid and list */
export const roomStatusCardClasses: Record<RoomAvailabilityUI, string> = {
  available: "border-l-[5px] border-l-emerald-500",
  occupied: "border-l-[5px] border-l-rose-500",
  maintenance: "border-l-[5px] border-l-amber-500",
};

interface RoomStatusChipProps {
  status: RoomAvailabilityUI;
  className?: string;
}

export const RoomStatusChip = ({ status, className }: RoomStatusChipProps) => {
  const { t } = useI18n();
  const cfg = ROOM_STATUS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold font-body",
        cfg.chip,
        className,
      )}
      role="status"
      aria-label={t(`rooms.status.${status}`)}
    >
      <span
        className="material-symbols-outlined text-[14px] leading-none text-white"
        aria-hidden
      >
        {cfg.icon}
      </span>
      {t(`rooms.status.${status}`)}
    </span>
  );
};
