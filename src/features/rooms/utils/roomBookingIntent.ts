import { format, isValid, parseISO } from "date-fns";
import type { RoomFilterState } from "../hooks/useRoomFilterStore";

type BookingSearchValues = Pick<RoomFilterState, "bookingDate" | "timeSlotIds" | "minCapacity">;

/** Keep the search intent with the link, including reloads and opening a new tab. */
export function buildRoomBookingUrl(roomId: string, values: BookingSearchValues): string {
  const params = new URLSearchParams();
  if (values.bookingDate) params.set("bookingDate", values.bookingDate);
  values.timeSlotIds.forEach(id => params.append("timeSlotIds", String(id)));
  if (values.minCapacity !== "") params.set("attendees", String(values.minCapacity));
  const query = params.toString();
  return `/rooms/${encodeURIComponent(roomId)}${query ? `?${query}` : ""}`;
}

/** URL values are input, never evidence that a room or slot is actually available. */
export function readRoomBookingIntent(params: URLSearchParams) {
  const rawDate = params.get("bookingDate") ?? "";
  const parsedDate = parseISO(rawDate);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && isValid(parsedDate) && format(parsedDate, "yyyy-MM-dd") === rawDate ? rawDate : "";
  const slotIds = [...new Set(params.getAll("timeSlotIds"))]
    .filter(id => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) && Number(id) <= 2147483647)
    .slice(0, 2);
  const rawAttendees = params.get("attendees") ?? "";
  const attendees = /^[1-9]\d*$/.test(rawAttendees) && Number.isSafeInteger(Number(rawAttendees)) && Number(rawAttendees) <= 2147483647 ? rawAttendees : "";
  return { date, slotIds, attendees };
}
