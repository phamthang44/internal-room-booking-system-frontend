import { format, parseISO } from "date-fns";
import { useI18n } from "@shared/i18n/useI18n";
import { TIME_SLOTS, useRoomFilterStore } from "../hooks/useRoomFilterStore";
import { ROOM_EQUIPMENT_OPTIONS, ROOM_STATUS_OPTIONS } from "./FilterSidebar";

export function RoomActiveFilters() {
  const { t } = useI18n();
  const filters = useRoomFilterStore();
  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (filters.search) chips.push({ key: "search", label: filters.search, clear: () => filters.setSearch("") });
  if (filters.bookingDate) chips.push({ key: "date", label: format(parseISO(filters.bookingDate), "dd/MM/yyyy"), clear: () => { filters.setBookingDate(""); filters.clearTimeSlots(); } });
  TIME_SLOTS.filter(slot => filters.timeSlotIds.includes(slot.id)).forEach(slot => chips.push({ key: `slot-${slot.id}`, label: slot.label, clear: () => filters.toggleTimeSlotId(slot.id) }));
  if (filters.minCapacity !== "") chips.push({ key: "capacity", label: t("rooms.filters.people", { count: filters.minCapacity }), clear: () => filters.setCapacityRange("", "") });
  const status = ROOM_STATUS_OPTIONS.find(option => option.value === filters.roomStatus);
  if (status) chips.push({ key: "status", label: `${t("rooms.filters.status")}: ${t(status.labelKey)}`, clear: () => filters.setRoomStatus("") });
  const equipment = ROOM_EQUIPMENT_OPTIONS.find(option => option.id === filters.equipmentId);
  if (equipment) chips.push({ key: "equipment", label: t(`rooms.equipment.${equipment.key}`), clear: () => filters.setEquipmentId(0) });
  if (!chips.length) return null;
  return <section className="active-room-filters" aria-label={t("rooms.filters.applied")}>
    <span className="text-xs font-semibold text-on-surface-variant">{t("rooms.filters.applied")}</span>
    <div className="flex flex-wrap gap-2">
      {chips.map(chip => <button key={chip.key} type="button" onClick={chip.clear} aria-label={t("rooms.filters.remove", { label: chip.label })} className="filter-chip">
        <span>{chip.label}</span><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 6 12 12M6 18 18 6" /></svg>
      </button>)}
      <button type="button" className="filter-reset" onClick={filters.clearAll}>{t("rooms.filters.clearAll")}</button>
    </div>
  </section>;
}
