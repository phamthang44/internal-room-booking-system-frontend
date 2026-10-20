import { CustomSelect } from "@shared/components/CustomSelect";
import { vi, enUS } from "date-fns/locale";
import { addDays, format } from "date-fns";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { TIME_SLOTS, useRoomFilterStore } from "../hooks/useRoomFilterStore";

import { isSlotInPast } from "../utils/slotAvailability";

/** The three booking decisions stay visible on phones as well as desktops. */
export function BookingSearchControls() {
  const { t, language } = useI18n();
  const { bookingDate, timeSlotIds, minCapacity, setBookingDate, toggleTimeSlotId, clearTimeSlots, setCapacityRange } = useRoomFilterStore();
  const dates = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(new Date(), index);
    return { value: format(date, "yyyy-MM-dd"), label: format(date, "EEEE, dd/MM", { locale: language === "vi" ? vi : enUS }), displayLabel: `${language === "vi" ? (date.getDay() === 0 ? "CN" : `T${date.getDay() + 1}`) : format(date, "EEE", { locale: enUS })}, ${format(date, "dd/MM")}` };
  });
  const hasSelection = Boolean(bookingDate || timeSlotIds.length || minCapacity !== "");

  return (
    <section className="booking-search panel-shell mb-6" aria-label={t("rooms.bookingSearch.title")}>
      <div className="panel-content p-4 sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-on-surface">{t("rooms.bookingSearch.title")}</h2>
            <p id="booking-search-window" className="mt-1 text-xs text-on-surface-variant">{t("rooms.bookingSearch.windowHint")}</p>
          </div>
          {hasSelection && <button type="button" className="filter-reset shrink-0" onClick={() => { setBookingDate(""); clearTimeSlots(); setCapacityRange("", ""); }}>{t("rooms.bookingSearch.clear")}</button>}
        </div>
        <div className="booking-search-fields">
          <div className="booking-search-date">
            <label htmlFor="booking-search-date" className="field-label">{t("rooms.filters.pickDate")}</label>
            <CustomSelect id="booking-search-date" value={bookingDate}
              options={[{ value: "", label: "rooms.bookingSearch.anyDate" }, ...dates]}
              placeholder="rooms.bookingSearch.anyDate" ariaLabel={t("rooms.filters.pickDate")}
              describedBy="booking-search-window" icon="calendar_today" menuClassName="booking-date-menu"
              onChange={(value: string) => {
                setBookingDate(value);
                if (!value) {
                  clearTimeSlots();
                } else {
                  // Deselect any slot that has already passed on the new date
                  timeSlotIds.forEach((id) => {
                    const slot = TIME_SLOTS.find((ts) => ts.id === id);
                    if (slot && isSlotInPast(value, slot.start)) {
                      toggleTimeSlotId(id);
                    }
                  });
                }
              }} />
          </div>
          <div className="booking-search-attendees">
            <label htmlFor="booking-search-attendees" className="field-label">{t("rooms.bookingSearch.attendees")}</label>
            <input
              id="booking-search-attendees" type="number" inputMode="numeric" min={1} max={2147483647} step={1}
              className="workspace-field" value={minCapacity} placeholder={t("rooms.bookingSearch.anyCapacity")}
              onChange={event => {
                const value = event.currentTarget.value;
                const count = Number(value);
                if (!value) setCapacityRange("", "");
                else if (Number.isInteger(count) && count > 0 && count <= 2147483647) setCapacityRange(count, "");
              }}
            />
          </div>
          <fieldset className="booking-search-slots min-w-0">
            <legend className="field-label">{t("rooms.filters.timeSlot")}</legend>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map(slot => {
                const selected = timeSlotIds.includes(slot.id);
                const isPast = bookingDate ? isSlotInPast(bookingDate, slot.start) : false;
                return <button
                  key={slot.id} type="button" aria-pressed={selected} data-search-slot={slot.id}
                  disabled={!bookingDate || isPast || (!selected && timeSlotIds.length >= 2)}
                  title={isPast ? `${slot.label} (${t("roomDetail.slots.past")})` : slot.label}
                  onClick={() => toggleTimeSlotId(slot.id)}
                  className={cn(
                    "booking-slot-choice",
                    selected && "is-selected",
                    isPast && "opacity-40 cursor-not-allowed line-through"
                  )}
                >{slot.label}</button>;
              })}
              {timeSlotIds.length > 0 && <button type="button" className="min-h-10 px-2 text-xs text-primary hover:underline" onClick={clearTimeSlots}>{t("rooms.filters.anyTime")}</button>}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">{t(bookingDate ? "rooms.bookingSearch.slotsHint" : "rooms.bookingSearch.chooseDateFirst")}</p>
          </fieldset>
        </div>
      </div>
    </section>
  );
}
