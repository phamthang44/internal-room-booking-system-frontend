// ─────────────────────────────────────────────────────────────────────────────
// BookingSidebar — Date scrubber + slot selection + purpose + submit
// Data: room.schedule.availabilities from GET /rooms/:id
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect } from "react";
import { CheckCircle, CircleAlert } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useSubmitBooking } from "../../hooks/useRoomDetail";
import type { BookingSlot, DateOption, RoomDetail, RoomSlotDto } from "../../types/roomDetail.types";

const MAX_SLOT_SELECTION = 2;

const formatTimeShort = (time: string) => time.slice(0, 5);

const mapApiSlotToBookingSlot = (s: RoomSlotDto): BookingSlot => {
  const label = `${formatTimeShort(s.startTime)} — ${formatTimeShort(s.endTime)}`;
  if (s.isAvailable && s.status === "AVAILABLE") {
    return { id: String(s.slotId), label, status: "available" };
  }
  const st = (s.status ?? "").toUpperCase();
  const looksPendingApproval = st.includes("PENDING") || st.includes("AWAITING");
  if (looksPendingApproval) {
    return { id: String(s.slotId), label, status: "pendingApproval" };
  }
  return { id: String(s.slotId), label, status: "occupied" };
};

const SlotRow = ({
  slot,
  isSelected,
  selectionOrder,
  onSelect,
  t,
}: {
  slot: BookingSlot;
  isSelected: boolean;
  /** 1-based order among selected slots (chronological). */
  selectionOrder?: number;
  onSelect: () => void;
  t: (key: string) => string;
}) => {
  if (slot.status === "occupied" || slot.status === "pendingApproval") {
    const pending = slot.status === "pendingApproval";
    return (
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl opacity-60 cursor-not-allowed select-none",
          pending ? "bg-amber-500/5 border border-amber-500/15" : "bg-surface-container-low/50"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full shrink-0",
              pending ? "bg-amber-500" : "bg-error"
            )}
          />
          <span className="font-headline font-bold text-on-surface-variant text-sm">
            {slot.label}
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
            pending
              ? "text-amber-800 bg-amber-100"
              : "text-on-error-container bg-error-container/50"
          )}
        >
          {pending ? t("roomDetail.slots.pending") : t("roomDetail.slots.occupied")}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
        isSelected
          ? "bg-primary-fixed border-primary shadow-[0_0_0_4px_rgba(173,199,247,0.3)]"
          : "bg-surface-container-low border-transparent hover:border-tertiary-fixed-dim hover:shadow-[0_4px_16px_rgba(24,28,30,0.06)]"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0 transition-all",
            isSelected
              ? "bg-primary shadow-[0_0_8px_rgba(0,32,69,0.5)]"
              : "bg-tertiary-fixed shadow-[0_0_8px_rgba(136,249,176,0.5)]"
          )}
        />
        <span
          className={cn(
            "font-headline font-bold text-sm transition-colors",
            isSelected ? "text-on-primary-fixed" : "text-on-surface"
          )}
        >
          {slot.label}
        </span>
      </div>

      {isSelected ? (
        <span className="flex items-center gap-1.5 shrink-0">
          {selectionOrder != null && (
            <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-black text-primary">
              {selectionOrder}
            </span>
          )}
          <CheckCircle size={18} className="text-primary" />
        </span>
      ) : (
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-tertiary-fixed-variant bg-tertiary-fixed/20 px-2.5 py-1 rounded-full">
          {t("roomDetail.slots.available")}
        </span>
      )}
    </button>
  );
};

interface BookingSidebarProps {
  room: RoomDetail;
}

export const BookingSidebar = ({ room }: BookingSidebarProps) => {
  const { t } = useI18n();
  const availabilities = room.schedule.availabilities;

  const dateOptions = useMemo((): DateOption[] => {
    return availabilities.map((a) => {
      const d = parseISO(a.date);
      return {
        date: a.date,
        day: format(d, "EEE"),
        dayNum: d.getDate(),
      };
    });
  }, [availabilities]);

  const [selectedDate, setSelectedDate] = useState<string>(() => availabilities[0]?.date ?? "");
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [purpose, setPurpose] = useState("");
  const [attendeesInput, setAttendeesInput] = useState("");
  const [errors, setErrors] = useState<{ slot?: string; purpose?: string; attendees?: string }>(
    {}
  );

  useEffect(() => {
    const first = room.schedule.availabilities[0]?.date ?? "";
    setSelectedDate(first);
    setSelectedSlotIds([]);
    setPurpose("");
    setAttendeesInput("");
  }, [room.id]);

  const slots = useMemo((): BookingSlot[] => {
    const day = availabilities.find((a) => a.date === selectedDate);
    if (!day) return [];
    return day.slots.map(mapApiSlotToBookingSlot);
  }, [availabilities, selectedDate]);

  /** Selected ids in day order (chronological) for API and display. */
  const orderedSelectedSlotIds = useMemo(() => {
    const selected = new Set(selectedSlotIds);
    return slots.filter((s) => selected.has(s.id)).map((s) => s.id);
  }, [slots, selectedSlotIds]);

  const scheduleFull = room.schedule.isFull;
  const hasNoSchedule = dateOptions.length === 0;

  const { mutate: submitBooking, isPending } = useSubmitBooking();

  const handleConfirm = () => {
    if (scheduleFull || hasNoSchedule) return;

    const newErrors: typeof errors = {};
    if (orderedSelectedSlotIds.length === 0) newErrors.slot = t("roomDetail.error.selectSlot");
    if (!purpose.trim()) newErrors.purpose = t("roomDetail.error.purposeRequired");

    const trimmedAtt = attendeesInput.trim();
    if (!trimmedAtt) {
      newErrors.attendees = t("roomDetail.error.attendeesRequired");
    } else {
      const n = Number.parseInt(trimmedAtt, 10);
      if (Number.isNaN(n) || n < 1) {
        newErrors.attendees = t("roomDetail.error.attendeesInvalid");
      } else if (n > room.capacity) {
        newErrors.attendees = t("roomDetail.error.attendeesOverCapacity", {
          max: room.capacity,
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const attendees = Number.parseInt(attendeesInput.trim(), 10);
    submitBooking({
      roomId: room.id,
      date: selectedDate,
      slotIds: orderedSelectedSlotIds,
      purpose,
      attendees,
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(0,32,69,0.10)] overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-primary-container px-7 py-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
        <h2 className="text-xl font-headline font-extrabold tracking-tight relative z-10">
          {t("roomDetail.booking.title")}
        </h2>
        <p className="text-on-primary-container text-sm mt-1 relative z-10">
          {t("roomDetail.booking.subtitle")}
        </p>
        <p className="text-white/40 text-xs mt-2 font-medium truncate relative z-10">{room.name}</p>
      </div>

      <div className="p-7 space-y-7">
        {(scheduleFull || hasNoSchedule) && (
          <div
            className="rounded-xl bg-error-container/20 border border-error/20 px-4 py-3 text-sm text-on-surface"
            role="status"
          >
            {hasNoSchedule
              ? t("roomDetail.booking.noSchedule")
              : t("roomDetail.booking.scheduleFull")}
          </div>
        )}

        <div className="space-y-3">
          <label className="font-headline font-bold text-on-surface text-sm">
            {t("roomDetail.booking.selectDate")}
          </label>
          {dateOptions.length === 0 ? (
            <p className="text-sm text-on-surface-variant">{t("roomDetail.booking.noSchedule")}</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
              {dateOptions.map((d) => {
                const isActive = selectedDate === d.date;
                return (
                  <button
                    key={d.date}
                    type="button"
                    onClick={() => {
                      setSelectedDate(d.date);
                      setSelectedSlotIds([]);
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center min-w-[60px] h-[72px] rounded-xl flex-shrink-0 transition-all duration-200",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary-fixed/50 scale-105"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                    )}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider">{d.day}</span>
                    <span className="text-xl font-black leading-tight">{d.dayNum}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="font-headline font-bold text-on-surface text-sm">
              {t("roomDetail.booking.availableSlots")}
            </label>
            <p className="text-xs text-on-surface-variant mt-1">{t("roomDetail.booking.slotsHint")}</p>
          </div>
          <div className="space-y-2.5">
            {slots.length === 0 && !hasNoSchedule && (
              <p className="text-sm text-on-surface-variant">{t("roomDetail.booking.noSlotsForDay")}</p>
            )}
            {slots.map((slot) => {
              const isSelected = selectedSlotIds.includes(slot.id);
              const orderIdx = orderedSelectedSlotIds.indexOf(slot.id);
              const selectionOrder = orderIdx >= 0 ? orderIdx + 1 : undefined;
              return (
                <SlotRow
                  key={slot.id}
                  slot={slot}
                  isSelected={isSelected}
                  selectionOrder={selectionOrder}
                  onSelect={() => {
                    if (slot.status !== "available") return;
                    setSelectedSlotIds((prev) => {
                      if (prev.includes(slot.id)) {
                        return prev.filter((id) => id !== slot.id);
                      }
                      if (prev.length >= MAX_SLOT_SELECTION) {
                        return prev;
                      }
                      return [...prev, slot.id];
                    });
                    setErrors((e) => ({ ...e, slot: undefined }));
                  }}
                  t={t}
                />
              );
            })}
          </div>
          {errors.slot && (
            <div className="flex items-center gap-1.5 text-error text-xs font-medium">
              <CircleAlert size={13} />
              {errors.slot}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="font-headline font-bold text-on-surface text-sm">
            {t("roomDetail.booking.purpose")}
          </label>
          <textarea
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value);
              if (e.target.value.trim()) setErrors((err) => ({ ...err, purpose: undefined }));
            }}
            placeholder={t("roomDetail.booking.purposePlaceholder")}
            rows={3}
            disabled={scheduleFull || hasNoSchedule}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none transition-all duration-200 focus:outline-none",
              errors.purpose
                ? "border-error/60 focus:border-error"
                : "border-transparent focus:border-primary/40 focus:bg-surface-container-lowest",
              (scheduleFull || hasNoSchedule) && "opacity-50 cursor-not-allowed"
            )}
          />
          {errors.purpose && (
            <div className="flex items-center gap-1.5 text-error text-xs font-medium">
              <CircleAlert size={13} />
              {errors.purpose}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="font-headline font-bold text-on-surface text-sm" htmlFor="booking-attendees">
            {t("roomDetail.booking.attendees")}
          </label>
          <p className="text-xs text-on-surface-variant -mt-1">{t("roomDetail.booking.attendeesHint")}</p>
          <input
            id="booking-attendees"
            type="number"
            inputMode="numeric"
            min={1}
            max={room.capacity}
            value={attendeesInput}
            onChange={(e) => {
              setAttendeesInput(e.target.value);
              if (e.target.value.trim()) setErrors((err) => ({ ...err, attendees: undefined }));
            }}
            placeholder={t("roomDetail.booking.attendeesPlaceholder")}
            disabled={scheduleFull || hasNoSchedule}
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-200 focus:outline-none",
              errors.attendees
                ? "border-error/60 focus:border-error"
                : "border-transparent focus:border-primary/40 focus:bg-surface-container-lowest",
              (scheduleFull || hasNoSchedule) && "opacity-50 cursor-not-allowed"
            )}
          />
          {errors.attendees && (
            <div className="flex items-center gap-1.5 text-error text-xs font-medium">
              <CircleAlert size={13} />
              {errors.attendees}
            </div>
          )}
        </div>

        <div className="pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || scheduleFull || hasNoSchedule}
            className={cn(
              "w-full py-4 rounded-xl font-headline font-extrabold tracking-tight text-white transition-all duration-200",
              "bg-gradient-to-r from-primary to-primary-container",
              "shadow-xl shadow-primary/20 hover:shadow-primary/30",
              "hover:scale-[1.015] active:scale-[0.98]",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            {isPending ? t("roomDetail.booking.submitting") : t("roomDetail.booking.confirm")}
          </button>
          <p className="text-center text-[10px] text-on-surface-variant mt-3 uppercase tracking-[0.15em]">
            {t("roomDetail.booking.policy")}
          </p>
        </div>
      </div>
    </div>
  );
};
