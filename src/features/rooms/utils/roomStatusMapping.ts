// ─────────────────────────────────────────────────────────────────────────────
// Maps backend RoomStatusApi (ALL_CAPS) → RoomAvailabilityUI for chips / cards.
// Shared by classroom list and room detail adapters.
// ─────────────────────────────────────────────────────────────────────────────
import type { RoomStatusApi, RoomAvailabilityUI } from "../types/classroom.api.types";
import type { RoomScheduleDto } from "../types/roomDetail.types";

const STATUS_MAP: Record<RoomStatusApi, RoomAvailabilityUI> = {
  AVAILABLE: "available",
  INACTIVE: "occupied",
  MAINTENANCE: "maintenance",
  DELETED: "occupied",
};

/**
 * Normalizes API room status strings to the same UI enum used on the listing page.
 */
export function mapRoomStatusApiToAvailability(
  status?: RoomStatusApi | string | null,
): RoomAvailabilityUI {
  if (status == null || status === "") return "occupied";
  const key = String(status).toUpperCase() as RoomStatusApi;
  return STATUS_MAP[key] ?? "occupied";
}

/** Only `AVAILABLE` rooms expose bookable slots; matches backend `RoomStatus.AVAILABLE` check. */
export function isRoomStatusApiAvailable(
  status?: RoomStatusApi | string | null,
): boolean {
  return String(status ?? "").toUpperCase() === "AVAILABLE";
}

/**
 * When classroom is INACTIVE, MAINTENANCE, or DELETED (anything other than AVAILABLE),
 * the API sets every slot's `isAvailable` to false. Apply the same rule on the client
 * so the booking UI stays consistent if the payload is stale or inconsistent.
 */
export function normalizeScheduleForRoomStatus(
  schedule: RoomScheduleDto,
  roomStatusWire: RoomStatusApi | string | undefined | null,
): RoomScheduleDto {
  if (isRoomStatusApiAvailable(roomStatusWire)) return schedule;
  const days = schedule.availabilities ?? [];
  return {
    ...schedule,
    availabilities: days.map((day) => ({
      ...day,
      slots: (day.slots ?? []).map((slot) => ({
        ...slot,
        isAvailable: false,
      })),
    })),
  };
}
