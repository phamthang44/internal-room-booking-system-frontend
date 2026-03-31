import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { EquipmentItem } from "../types/room.types";

const ICON_MAP: Partial<Record<EquipmentItem, string>> = {
  projector: "videocam",
  whiteboard: "edit_square",
  video_conference: "video_call",
  air_conditioning: "ac_unit",
  computer_lab: "computer",
  smart_board: "smart_display",
  audio_system: "speaker",
};

interface EquipmentTagProps {
  item: EquipmentItem;
  className?: string;
}

export const EquipmentTag = ({ item, className }: EquipmentTagProps) => {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-0.5 text-xs text-on-surface-variant",
        className
      )}
    >
      <span className="material-symbols-outlined text-[11px]">
        {ICON_MAP[item] ?? "check_circle"}
      </span>
      {t(`rooms.equipment.${item}`)}
    </span>
  );
};
