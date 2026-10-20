import { isBefore, isSameDay, parseISO, set } from "date-fns";

export interface SlotTimeParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export const parseTimeToParts = (time: string): SlotTimeParts => {
  const [h, m, s] = (time || "").split(":");
  return {
    hours: Number.parseInt(h ?? "0", 10) || 0,
    minutes: Number.parseInt(m ?? "0", 10) || 0,
    seconds: Number.parseInt(s ?? "0", 10) || 0,
  };
};

/**
 * Checks whether a given slot has already started or ended relative to `now`.
 * - Prior calendar days: all slots are past.
 * - Future calendar days: slots are never past.
 * - Same day: slot is past if its start time has passed (or arrived).
 */
export const isSlotInPast = (
  selectedDateIso: string,
  slotStartTime: string,
  now: Date = new Date(),
): boolean => {
  if (!selectedDateIso || !slotStartTime) return false;
  const trimmedDate = selectedDateIso.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate)) return false;

  const day = parseISO(trimmedDate);
  if (Number.isNaN(day.getTime())) return false;

  const startOfNow = set(now, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  if (isBefore(day, startOfNow)) return true;
  if (!isSameDay(day, now)) return false;

  const { hours, minutes, seconds } = parseTimeToParts(slotStartTime);
  const slotStart = set(day, { hours, minutes, seconds, milliseconds: 0 });
  return isBefore(slotStart, now) || slotStart.getTime() === now.getTime();
};
