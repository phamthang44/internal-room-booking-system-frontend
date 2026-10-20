import { useId } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useAuthStore } from "@features/auth";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";
import type { RoomStatusApi } from "../types/classroom.api.types";

export const ROOM_STATUS_OPTIONS: { value: RoomStatusApi; labelKey: string }[] = [
  { value: "AVAILABLE", labelKey: "rooms.status.available" },
  { value: "INACTIVE", labelKey: "rooms.status.occupied" },
  { value: "MAINTENANCE", labelKey: "rooms.status.maintenance" },
  { value: "DELETED", labelKey: "rooms.status.cancelled" },
];
export const ROOM_EQUIPMENT_OPTIONS = [
  { id: 1, key: "projector" }, { id: 2, key: "whiteboard" },
  { id: 3, key: "video_conference" }, { id: 4, key: "air_conditioning" },
  { id: 5, key: "computer_lab" }, { id: 6, key: "smart_board" }, { id: 7, key: "audio_system" },
];

export const FilterSidebar = ({ className }: { className?: string }) => {
  const { t } = useI18n();
  const groupId = useId();
  const { user } = useAuthStore();
  const { equipmentId, setEquipmentId, roomStatus, setRoomStatus } = useRoomFilterStore();
  const count = Number(equipmentId > 0) + Number(Boolean(roomStatus));
  return <aside className={cn("room-filter-panel", className)}>
    <div className="room-filter-heading">
      <h2>{t("rooms.filters.refine")}</h2>
      {count > 0 && <button type="button" className="filter-reset" onClick={() => { setEquipmentId(0); setRoomStatus(""); }}>{t("rooms.filters.resetRefine")}</button>}
    </div>
    <p className="field-hint mb-5">{t("rooms.filters.autoApply")}</p>
    <fieldset className="room-filter-group">
      <legend>{t("rooms.filters.status")}</legend>
      <div className="filter-choices">
        {[{ value: "" as const, labelKey: "rooms.filters.allStatuses" }, ...ROOM_STATUS_OPTIONS.filter(option => option.value !== "DELETED" || user?.roleName === "ADMIN")].map(option => <label key={option.value} className={cn("filter-choice", roomStatus === option.value && "is-selected")}>
          <input type="radio" name={`${groupId}-status`} id={`filter-status-${option.value || 'all'}`} checked={roomStatus === option.value} onChange={() => setRoomStatus(option.value)} />
          <span>{t(option.labelKey)}</span>
        </label>)}
      </div>
    </fieldset>
    <fieldset className="room-filter-group">
      <legend>{t("rooms.filters.equipment")}</legend>
      <p className="field-hint mb-2">{t("rooms.filters.singleEquipment")}</p>
      <div className="filter-choices">
        {[{ id: 0, key: "any" }, ...ROOM_EQUIPMENT_OPTIONS].map(equipment => <label key={equipment.id} className={cn("filter-choice", equipmentId === equipment.id && "is-selected")}>
          <input type="radio" name={`${groupId}-equipment`} id={`filter-equipment-${equipment.id}`} checked={equipmentId === equipment.id} onChange={() => setEquipmentId(equipment.id)} />
          <span>{t(equipment.id ? `rooms.equipment.${equipment.key}` : "rooms.filters.anyEquipment")}</span>
        </label>)}
      </div>
    </fieldset>
  </aside>;
};
