// ─────────────────────────────────────────────────────────────────────────────
// BookingSidebar — Date scrubber + slot selection + purpose + submit
// Data: room.schedule.availabilities from GET /rooms/:id
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { readRoomBookingIntent } from "../../utils/roomBookingIntent";
import { CheckCircle, CircleAlert } from "lucide-react";
import { format, parseISO, isBefore, isSameDay, set } from "date-fns";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useSubmitBooking } from "../../hooks/useRoomDetail";
import type {
  BookingSlot,
  DateOption,
  RoomDetail,
  RoomSlotDto,
  SlotStatus,
} from "../../types/roomDetail.types";
import type { RoomAvailabilityUI } from "../../types/classroom.api.types";

const MAX_SLOT_SELECTION = 2;

const formatTimeShort = (time: string) => time.slice(0, 5);

import { isSlotInPast } from "../../utils/slotAvailability";

/**
 * When the classroom is not AVAILABLE, every slot is non-bookable — label by room status,
 * not as "booked" (`occupied`). Otherwise derive status from the slot payload.
 */
const mapApiSlotToBookingSlot = (
  s: RoomSlotDto,
  roomAvailability: RoomAvailabilityUI,
): BookingSlot => {
  const label = `${formatTimeShort(s.startTime)} — ${formatTimeShort(s.endTime)}`;
  const id = String(s.slotId);

  if (roomAvailability === "maintenance") {
    return { id, label, status: "roomMaintenance", startTime: s.startTime, endTime: s.endTime };
  }
  if (roomAvailability !== "available") {
    return { id, label, status: "roomUnavailable", startTime: s.startTime, endTime: s.endTime };
  }

  const st = (s.status ?? "").toUpperCase();
  const isRejected = st.includes("REJECT");
  if (s.isAvailable && st === "AVAILABLE") {
    return { id, label, status: "available", startTime: s.startTime, endTime: s.endTime };
  }
  if (s.isAvailable && isRejected) {
    return {
      id,
      label,
      status: "available",
      startTime: s.startTime,
      endTime: s.endTime,
      note: s.isMine
        ? {
            kind: "rejected",
            reason: s.rejectionReason,
            bookingId: s.currentBookingId,
          }
        : undefined,
    };
  }
  if (st.includes("IN_USE")) {
    return { id, label, status: "inUse", startTime: s.startTime, endTime: s.endTime };
  }
  const looksPendingApproval = st.includes("PENDING") || st.includes("AWAITING");
  if (looksPendingApproval) {
    // Only the creator should see "pending approval"; other viewers should see the slot as occupied.
    return {
      id,
      label,
      status: s.isMine ? "pendingApproval" : "occupied",
      startTime: s.startTime,
      endTime: s.endTime,
    };
  }
  return {
    id,
    label,
    status: s.isMine ? "bookedByMe" : "occupied",
    startTime: s.startTime,
    endTime: s.endTime,
  };
};

const disabledSlotBadgeKey = (status: SlotStatus): string => {
  switch (status) {
    case "roomMaintenance":
      return "roomDetail.slots.roomMaintenance";
    case "roomUnavailable":
      return "roomDetail.slots.roomUnavailable";
    case "bookedByMe":
      return "roomDetail.slots.bookedByMe";
    case "pendingApproval":
      return "roomDetail.slots.pending";
    case "inUse":
      return "roomDetail.slots.inUse";
    case "occupied":
    default:
      return "roomDetail.slots.occupied";
  }
};

const disabledReasonBadgeKey = (reason: BookingSlot["disabledReason"]): string => {
  switch (reason) {
    case "past":
      return "roomDetail.slots.past";
    default:
      return "roomDetail.slots.occupied";
  }
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
  if (slot.status !== "available" || slot.disabledReason) {
    const rowStyle =
      slot.disabledReason === "past"
        ? {
            box: "bg-surface-container-low/60 border border-outline-variant/40",
            dot: "bg-on-surface-variant/60",
            badge: "text-on-surface-variant bg-surface-container-high",
          }
        :
      slot.status === "roomMaintenance"
        ? {
            box: "bg-amber-500/5 border border-amber-500/15",
            dot: "bg-amber-500",
            badge: "text-amber-900 bg-amber-100 dark:text-amber-950",
          }
        : slot.status === "roomUnavailable"
          ? {
              box: "bg-surface-container-low/80 border border-outline-variant/40",
              dot: "bg-on-surface-variant/70",
              badge: "text-on-surface-variant bg-surface-container-high",
            }
          : slot.status === "pendingApproval"
            ? {
                box: "bg-amber-500/5 border border-amber-500/15",
                dot: "bg-amber-500",
                badge: "text-amber-800 bg-amber-100",
              }
            : slot.status === "inUse"
              ? {
                  box: "bg-primary/5 border border-primary/15",
                  dot: "bg-primary",
                  badge: "text-primary bg-primary-fixed",
                }
              : {
                  box: "bg-surface-container-low/50 border border-outline-variant/30",
                  dot: "bg-error",
                  badge: "text-on-error-container bg-error-container/50",
                };

    return (
      <div
        className={cn(
          "flex items-center justify-between p-4 rounded-xl opacity-90 cursor-not-allowed select-none",
          rowStyle.box,
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn("w-2.5 h-2.5 rounded-full shrink-0", rowStyle.dot)}
          />
          <span className="font-headline font-bold text-on-surface-variant text-sm">
            {slot.label}
          </span>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            rowStyle.badge,
          )}
        >
          {t(slot.disabledReason ? disabledReasonBadgeKey(slot.disabledReason) : disabledSlotBadgeKey(slot.status))}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        "group flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
        isSelected
          ? "bg-primary/5 border-primary"
          : "bg-surface-container-low/50 border-transparent hover:border-primary/25"
      )}
    >
      <div className="min-w-0 flex items-start gap-3">
        <span
          className={cn(
            "mt-1 w-2.5 h-2.5 rounded-full shrink-0 transition-all",
            isSelected
              ? "bg-primary"
              : "bg-emerald-600"
          )}
        />
        <div className="min-w-0">
          <span
            className={cn(
              "block font-headline font-bold text-sm transition-colors",
              isSelected ? "text-on-primary-fixed" : "text-on-surface"
            )}
          >
            {slot.label}
          </span>
          {slot.note?.kind === "rejected" ? (
            <span
              className="mt-0.5 block truncate text-[11px] font-semibold text-on-surface-variant"
              title={slot.note.reason}
            >
              {`${t("common.labels.status")}: ${t("roomDetail.slots.rejected")}${
                slot.note.reason ? ` • ${t("common.labels.reason")}: ${slot.note.reason}` : ""
              }`}
            </span>
          ) : null}
        </div>
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
        <span className="text-xs font-medium text-on-tertiary-fixed-variant bg-tertiary-fixed/20 px-2.5 py-1 rounded-full">
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
  const dateStripRef = useRef<HTMLDivElement>(null);

  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

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

  const [searchParams] = useSearchParams();
  const requested = useMemo(() => readRoomBookingIntent(searchParams), [searchParams]);
  const initialDate = requested.date
    ? (availabilities.some(day => day.date === requested.date) ? requested.date : "")
    : availabilities[0]?.date ?? "";
  const initialSlotIds = requested.slotIds.filter(id => {
    const slot = availabilities.find(day => day.date === initialDate)?.slots.find(slot => String(slot.slotId) === id);
    return slot && mapApiSlotToBookingSlot(slot, room.availability).status === "available" && !isSlotInPast(initialDate, slot.startTime, now);
  });
  const initialNotice = Boolean(
    (searchParams.has("bookingDate") && (!requested.date || !initialDate)) ||
    initialSlotIds.length !== requested.slotIds.length
  );
  const [showIntentNotice, setShowIntentNotice] = useState(initialNotice);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>(initialSlotIds);
  const [purpose, setPurpose] = useState("");
  const [attendeesInput, setAttendeesInput] = useState(requested.attendees);
  const [errors, setErrors] = useState<{ slot?: string; purpose?: string; attendees?: string }>(
    {}
  );

  useEffect(() => {
    // A different room/link starts a new intent; background schedule refreshes keep the form.
    setSelectedDate(initialDate);
    setSelectedSlotIds(initialSlotIds);
    setShowIntentNotice(initialNotice);
    setPurpose("");
    setAttendeesInput(requested.attendees);
    setErrors({});
  }, [room.id, searchParams]);

  /** Horizontal strip: vertical wheel scrolls sideways; needs non-passive listener. */
  useEffect(() => {
    const el = dateStripRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth + 2) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [dateOptions.length, room.id]);

  const slots = useMemo((): BookingSlot[] => {
    const day = availabilities.find((a) => a.date === selectedDate);
    if (!day) return [];
    return day.slots.map((s) => {
      const base = mapApiSlotToBookingSlot(s, room.availability);
      if (base.status !== "available") return base;
      if (isSlotInPast(selectedDate, s.startTime, now)) {
        return { ...base, disabledReason: "past" };
      }
      return base;
    });
  }, [availabilities, selectedDate, room.availability, now]);

  /** Selected ids in day order (chronological) for API and display. */
  const orderedSelectedSlotIds = useMemo(() => {
    const selected = new Set(selectedSlotIds);
    return slots.filter((s) => selected.has(s.id) && s.status === "available" && !s.disabledReason).map((s) => s.id);
  }, [slots, selectedSlotIds]);

  useEffect(() => {
    if (orderedSelectedSlotIds.length === selectedSlotIds.length) return;
    setSelectedSlotIds(orderedSelectedSlotIds);
    setShowIntentNotice(true);
  }, [orderedSelectedSlotIds, selectedSlotIds]);

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
    <div className="booking-form-panel">
      <div className="pb-6 border-b border-outline-variant/25 text-on-surface">

        <h2 className="text-xl font-headline font-extrabold tracking-tight relative z-10">
          {t("roomDetail.booking.title")}
        </h2>
        <p className="text-on-surface-variant text-sm mt-2">
          {t("roomDetail.booking.subtitle")}
        </p>
        <p className="text-primary text-xs mt-3 font-semibold">{room.name}</p>
      </div>

      <div className="pt-6 space-y-6">
        {showIntentNotice && <p role="status" className="rounded-xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-900">{t("rooms.bookingSearch.intentChanged")}</p>}
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
            <div
              ref={dateStripRef}
              className="-mx-1 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 py-2 scroll-smooth [scrollbar-width:thin]"
            >
              <div className="flex w-max gap-2 pr-4">
                {dateOptions.map((d) => {
                  const isActive = selectedDate === d.date;
                  return (
                    <button
                      key={d.date}
                      type="button"
                      aria-pressed={isActive}
                      aria-label={d.date}
                      onClick={() => {
                        setShowIntentNotice(false);
                        setSelectedDate(d.date);
                        setSelectedSlotIds([]);
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center min-w-[60px] h-[72px] rounded-xl shrink-0 transition-all duration-200",
                        isActive
                          ? "bg-primary text-white shadow-lg shadow-primary/25 ring-4 ring-primary-fixed/50 scale-105"
                          : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                      )}
                    >
                      <span className="text-xs font-medium">{d.day}</span>
                      <span className="text-xl font-black leading-tight">{d.dayNum}</span>
                    </button>
                  );
                })}
              </div>
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
                    if (slot.status !== "available" || slot.disabledReason) return;
                    setShowIntentNotice(false);
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
            id="booking-purpose"
            aria-label={t("roomDetail.booking.purpose")}
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
              "action-primary w-full",
              "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            )}
          >
            {isPending ? t("roomDetail.booking.submitting") : t("roomDetail.booking.confirm")}
          </button>
          <p className="text-center text-xs leading-relaxed text-on-surface-variant mt-3">
            {t("roomDetail.booking.policy")}
          </p>
        </div>
      </div>
    </div>
  );
};
