// ─────────────────────────────────────────────────────────────────────────────
// BookingSidebar — Date scrubber + slot selection + purpose textarea + submit
// Adheres to "Scholarly Sanctuary" design: gradients, glow effects, tonal layering
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo } from "react";
import { CheckCircle, CircleAlert } from "lucide-react";
import { format, addDays, startOfToday } from "date-fns";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useSubmitBooking } from "../../hooks/useRoomDetail";
import type { BookingSlot, DateOption, SlotStatus } from "../../types/roomDetail.types";

// ── Mock slot data (replace with API data when slots endpoint is ready) ───────
const TIME_SLOTS: Omit<BookingSlot, "status">[] = [
  { id: "1", label: "07:00 — 09:00" },
  { id: "2", label: "09:30 — 11:30" },
  { id: "3", label: "13:00 — 15:00" },
  { id: "4", label: "15:30 — 17:30" },
];

// Randomize status for visual demo (replace with real availability API)
const DEMO_STATUSES: SlotStatus[] = ["available", "occupied", "available", "available"];

const buildSlots = (): BookingSlot[] =>
  TIME_SLOTS.map((s, i) => ({ ...s, status: DEMO_STATUSES[i] }));

// ── Date scrubber helper ──────────────────────────────────────────────────────
const buildDateOptions = (count = 7): DateOption[] => {
  const today = startOfToday();
  return Array.from({ length: count }, (_, i) => {
    const d = addDays(today, i);
    return {
      date: format(d, "yyyy-MM-dd"),
      day: format(d, "EEE"),
      dayNum: d.getDate(),
    };
  });
};

// ── Slot row sub-component ────────────────────────────────────────────────────
const SlotRow = ({
  slot,
  isSelected,
  onSelect,
  t,
}: {
  slot: BookingSlot;
  isSelected: boolean;
  onSelect: () => void;
  t: (key: string) => string;
}) => {
  if (slot.status === "occupied") {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low/50 opacity-60 cursor-not-allowed select-none">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-error shrink-0" />
          <span className="font-headline font-bold text-on-surface-variant text-sm">
            {slot.label}
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-error-container bg-error-container/50 px-2.5 py-1 rounded-full">
          {t("roomDetail.slots.occupied")}
        </span>
      </div>
    );
  }

  const isPending = slot.status === "pending";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group flex items-center justify-between w-full p-4 rounded-xl border-2 transition-all duration-200 text-left",
        isSelected
          ? "bg-primary-fixed border-primary shadow-[0_0_0_4px_rgba(173,199,247,0.3)]"
          : isPending
            ? "bg-surface-container-low border-transparent hover:border-secondary-fixed-dim"
            : "bg-surface-container-low border-transparent hover:border-tertiary-fixed-dim hover:shadow-[0_4px_16px_rgba(24,28,30,0.06)]"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-2.5 h-2.5 rounded-full shrink-0 transition-all",
            isSelected
              ? "bg-primary shadow-[0_0_8px_rgba(0,32,69,0.5)]"
              : isPending
                ? "bg-amber-400"
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
        <CheckCircle size={18} className="text-primary shrink-0" />
      ) : (
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
            isPending
              ? "text-amber-700 bg-amber-100"
              : "text-on-tertiary-fixed-variant bg-tertiary-fixed/20"
          )}
        >
          {isPending ? t("roomDetail.slots.pending") : t("roomDetail.slots.available")}
        </span>
      )}
    </button>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

interface BookingSidebarProps {
  roomId: string;
  roomName: string;
}

export const BookingSidebar = ({ roomId, roomName }: BookingSidebarProps) => {
  const { t } = useI18n();
  const dateOptions = useMemo(() => buildDateOptions(7), []);
  const slots = useMemo(() => buildSlots(), []);

  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].date);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [errors, setErrors] = useState<{ slot?: string; purpose?: string }>({});

  const { mutate: submitBooking, isPending } = useSubmitBooking();

  const handleConfirm = () => {
    const newErrors: typeof errors = {};
    if (!selectedSlotId) newErrors.slot = t("roomDetail.error.selectSlot");
    if (!purpose.trim()) newErrors.purpose = t("roomDetail.error.purposeRequired");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    submitBooking({ roomId, date: selectedDate, slotId: selectedSlotId, purpose });
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-[0_20px_50px_rgba(0,32,69,0.10)] overflow-hidden">
      {/* Header — navy gradient */}
      <div className="bg-gradient-to-r from-primary to-primary-container px-7 py-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl" />
        <h2 className="text-xl font-headline font-extrabold tracking-tight relative z-10">
          {t("roomDetail.booking.title")}
        </h2>
        <p className="text-on-primary-container text-sm mt-1 relative z-10">
          {t("roomDetail.booking.subtitle")}
        </p>
        <p className="text-white/40 text-xs mt-2 font-medium truncate relative z-10">{roomName}</p>
      </div>

      <div className="p-7 space-y-7">
        {/* ── Date Scrubber ── */}
        <div className="space-y-3">
          <label className="font-headline font-bold text-on-surface text-sm">
            {t("roomDetail.booking.selectDate")}
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {dateOptions.map((d) => {
              const isActive = selectedDate === d.date;
              return (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelectedDate(d.date)}
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
        </div>

        {/* ── Time Slots ── */}
        <div className="space-y-3">
          <label className="font-headline font-bold text-on-surface text-sm">
            {t("roomDetail.booking.availableSlots")}
          </label>
          <div className="space-y-2.5">
            {slots.map((slot) => (
              <SlotRow
                key={slot.id}
                slot={slot}
                isSelected={selectedSlotId === slot.id}
                onSelect={() => {
                  if (slot.status !== "occupied") {
                    setSelectedSlotId(slot.id);
                    setErrors((e) => ({ ...e, slot: undefined }));
                  }
                }}
                t={t}
              />
            ))}
          </div>
          {errors.slot && (
            <div className="flex items-center gap-1.5 text-error text-xs font-medium">
              <CircleAlert size={13} />
              {errors.slot}
            </div>
          )}
        </div>

        {/* ── Purpose ── */}
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
            className={cn(
              "w-full px-4 py-3 rounded-xl bg-surface-container-low border-2 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none transition-all duration-200 focus:outline-none",
              errors.purpose
                ? "border-error/60 focus:border-error"
                : "border-transparent focus:border-primary/40 focus:bg-surface-container-lowest"
            )}
          />
          {errors.purpose && (
            <div className="flex items-center gap-1.5 text-error text-xs font-medium">
              <CircleAlert size={13} />
              {errors.purpose}
            </div>
          )}
        </div>

        {/* ── Submit ── */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
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
