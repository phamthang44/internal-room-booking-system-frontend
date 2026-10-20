import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { RoomAvailabilityUI } from "../types/classroom.api.types";

/** Opaque, pale status surfaces remain legible over room photography. */
const ROOM_STATUS: Record<
  RoomAvailabilityUI,
  { chip: string; icon: string }
> = {
  available: {
    chip:
      "available",
    icon: "check_circle",
  },
  occupied: {
    chip:
      "occupied",
    icon: "do_not_disturb_on",
  },
  maintenance: {
    chip:
      "maintenance",
    icon: "construction",
  },
};

/** Retained for existing consumers; the labelled chip carries room status. */
export const roomStatusCardClasses: Record<RoomAvailabilityUI, string> = {
  available: "",
  occupied: "",
  maintenance: "",
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
        "room-status font-body whitespace-nowrap shrink-0",
        cfg.chip,
        className,
      )}
      role="status"
      aria-label={t(`rooms.status.${status}`)}
    >
      <span
        className="material-symbols-outlined text-[13px] leading-none shrink-0"
        aria-hidden
      >
        {cfg.icon}
      </span>
      <span>{t(`rooms.status.${status}`)}</span>
    </span>
  );
};
