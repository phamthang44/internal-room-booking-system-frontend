import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useRoomFilterStore, TIME_SLOTS } from "../hooks/useRoomFilterStore";
import { FilterGroup } from "./FilterGroup";

// Known equipment items from the design + DB
// equipmentId maps to EquipmentResponse.id returned from the API
const EQUIPMENT_OPTIONS = [
  { id: 1, label: "Projector", icon: "videocam" },
  { id: 2, label: "Whiteboard", icon: "edit_square" },
  { id: 3, label: "Video Conference", icon: "video_call" },
  { id: 4, label: "Air Conditioning", icon: "ac_unit" },
  { id: 5, label: "Computer Lab", icon: "computer" },
  { id: 6, label: "Smart Board", icon: "smart_display" },
  { id: 7, label: "Audio System", icon: "speaker" },
];

const CAPACITY_PRESETS = [
  { label: "1–10", min: 1, max: 10 },
  { label: "11–30", min: 11, max: 30 },
  { label: "31–60", min: 31, max: 60 },
  { label: "60+", min: 60, max: "" as const },
];

// Today's date in yyyy-MM-dd for the min attribute on the date input
const todayISO = () => new Date().toISOString().split("T")[0];

interface FilterSidebarProps {
  className?: string;
}

export const FilterSidebar = ({ className }: FilterSidebarProps) => {
  const { t } = useI18n();
  const {
    bookingDate,
    timeSlotId,
    minCapacity,
    maxCapacity,
    equipmentId,
    setBookingDate,
    setTimeSlotId,
    setCapacityRange,
    setEquipmentId,
    clearAll,
    activeFilterCount,
  } = useRoomFilterStore();

  const filterCount = activeFilterCount();

  return (
    <aside className={cn("w-full space-y-1", className)}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-headline text-sm font-semibold text-on-surface">
          {t("rooms.filters.title")}
        </h2>
        {filterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs font-medium text-primary hover:underline"
          >
            {t("rooms.filters.clearAll")}
          </button>
        )}
      </div>

      {/* ── Availability — Date Picker ──────────────────────────────────── */}
      <FilterGroup title={t("rooms.filters.availability")}>
        <div className="space-y-3">
          {/* Date */}
          <div>
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/50">
              {t("rooms.filters.pickDate")}
            </label>
            <div className="relative flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 transition-all hover:border-outline-variant focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              <span className="pointer-events-none shrink-0 text-on-surface-variant/50">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1.5" y="2.5" width="13" height="12" rx="2"/>
                  <path d="M1.5 6.5h13M5 1v3M11 1v3"/>
                </svg>
              </span>
              <span className={cn("flex-1 text-sm", bookingDate ? "text-on-surface" : "text-on-surface-variant/40")}>
                {bookingDate
                  ? new Date(bookingDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                  : t("rooms.filters.pickDate")}
              </span>
              <span className="pointer-events-none text-on-surface-variant/40">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <input
                type="date"
                value={bookingDate}
                min={todayISO()}
                onChange={(e) => setBookingDate(e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
            </div>
          </div>

          {/* Time slot */}
          <div className="w-full">
            <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/50">
              {t("rooms.filters.timeSlot")}
            </label>
            <div className="relative flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 transition-all hover:border-outline-variant focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              <span className="pointer-events-none shrink-0 text-on-surface-variant/50">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M8 4.5V8l2.5 2"/>
                </svg>
              </span>
              <span className="flex-1 text-sm text-on-surface">
                {TIME_SLOTS.find((s) => s.id === timeSlotId)?.label ?? t("rooms.filters.anyTime")}
              </span>
              <span className="pointer-events-none text-on-surface-variant/40">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <select
                value={timeSlotId}
                onChange={(e) => setTimeSlotId(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0 appearance-none"
              >
                <option value={0}>{t("rooms.filters.anyTime")}</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot.id} value={slot.id}>{slot.label}</option>
                ))}
              </select>
            </div>

            {/* Quick-pick chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[{ id: 0, label: t("rooms.filters.anyTime") }, ...TIME_SLOTS].map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setTimeSlotId(slot.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-all",
                    timeSlotId === slot.id
                      ? "border-outline-variant bg-surface-variant font-medium text-on-surface"
                      : "border-outline-variant/30 text-on-surface-variant hover:border-outline-variant/60 hover:text-on-surface"
                  )}
                >
                  {slot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </FilterGroup>

      {/* ── Capacity ────────────────────────────────────────────────────── */}
      <FilterGroup title={t("rooms.filters.capacity")}>
        <div className="flex flex-wrap gap-2">
          {CAPACITY_PRESETS.map((p) => {
            const isActive =
              String(minCapacity) === String(p.min) &&
              String(maxCapacity) === String(p.max);
            return (
              <button
                key={p.label}
                id={`filter-capacity-${p.label}`}
                onClick={() =>
                  isActive
                    ? setCapacityRange("", "")
                    : setCapacityRange(p.min, p.max)
                }
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary text-on-primary"
                    : "border-outline-variant bg-surface text-on-surface-variant hover:border-primary/40 hover:text-on-surface"
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      {/* ── Equipment — single-select checkboxes ────────────────────────── */}
      <FilterGroup title={t("rooms.filters.equipment")}>
        <div className="space-y-2">
          {EQUIPMENT_OPTIONS.map((eq) => {
            const checked = equipmentId === eq.id;
            return (
              <label
                key={eq.id}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface"
              >
                <input
                  type="checkbox"
                  id={`filter-equipment-${eq.id}`}
                  checked={checked}
                  onChange={() => setEquipmentId(eq.id)}
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary/30"
                />
                <span className="material-symbols-outlined text-[14px]">
                  {eq.icon}
                </span>
                {eq.label}
              </label>
            );
          })}
        </div>
      </FilterGroup>

      {/* ── Clear ──────────────────────────────────────────────────────── */}
      {filterCount > 0 && (
        <div className="pt-2">
          <button
            onClick={clearAll}
            className="w-full rounded-xl border border-outline-variant py-2 text-sm font-medium text-on-surface-variant transition-colors hover:border-error hover:text-error"
          >
            {t("rooms.filters.clearAllFilters")}
          </button>
        </div>
      )}
    </aside>
  );
};
