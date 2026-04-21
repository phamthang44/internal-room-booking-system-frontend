// ─────────────────────────────────────────────────────────────────────────────
// Room Detail API Service
// GET BASE_URL/rooms/:id — classroom details + schedule
// POST BASE_URL/bookings — submit booking
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { BOOKINGS_ENDPOINTS } from "@features/bookings/constants/bookings.endpoints";
import { ROOMS_ENDPOINTS } from "../constants/rooms.endpoints";
import type {
  RoomDetail,
  EquipmentDetail,
  RoomDetailDataDto,
  RoomScheduleDto,
  BookingSubmitPayload,
  BookingConfirmation,
  CreateBookingResponseDataDto,
  BookingCreatedTimeSlotDto,
} from "../types/roomDetail.types";
import {
  mapRoomStatusApiToAvailability,
  normalizeScheduleForRoomStatus,
} from "../utils/roomStatusMapping";

const EQUIPMENT_ICON_MAP: Record<string, string> = {
  projector: "Projector",
  "interactive whiteboard": "PenLine",
  whiteboard: "PenLine",
  "smart board": "PenLine",
  "audio system": "Volume2",
  "professional audio": "Volume2",
  "video conference": "Video",
  webcam: "Video",
  "air conditioning": "Wind",
  "computer lab": "Monitor",
  computer: "Monitor",
};

const resolveIcon = (name: string): string => {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(EQUIPMENT_ICON_MAP)) {
    if (lower.includes(key)) return icon;
  }
  return "Cpu";
};

const sortSchedule = (schedule: RoomScheduleDto): RoomScheduleDto => ({
  ...schedule,
  availabilities: [...schedule.availabilities].sort((a, b) => a.date.localeCompare(b.date)),
});

const unwrapData = (body: unknown): RoomDetailDataDto => {
  if (body && typeof body === "object" && "data" in body) {
    const d = (body as { data: RoomDetailDataDto }).data;
    if (d && typeof d === "object" && "classroomId" in d) return d;
  }
  if (body && typeof body === "object" && "classroomId" in (body as object)) {
    return body as RoomDetailDataDto;
  }
  throw new Error("roomDetail: unexpected API response shape");
};

/** Same wire precedence as list: `GET /rooms` items use `status`; detail may also use `roomStatus`. */
const pickRoomStatus = (raw: RoomDetailDataDto) =>
  raw.status ?? raw.roomStatus ?? raw.RoomStatus;

const adaptRoomDetail = (raw: RoomDetailDataDto): RoomDetail => {
  const roomStatusWire = pickRoomStatus(raw);
  const scheduleSorted = sortSchedule(raw.schedule);
  const schedule = normalizeScheduleForRoomStatus(scheduleSorted, roomStatusWire);

  return {
    id: String(raw.classroomId),
    name: raw.roomName,
    building: raw.building,
    addressBuildingLocation: raw.addressBuildingLocation,
    capacity: raw.capacity,
    roomType: raw.roomType,
    availability: mapRoomStatusApiToAvailability(roomStatusWire),
    imageUrls: raw.imageUrls ?? [],
    imageUrl:
      raw.imageUrls && raw.imageUrls.length > 0 ? raw.imageUrls[0] : undefined,
    imageGradient:
      "linear-gradient(135deg, #002045 0%, #1a365d 60%, #003f21 100%)",
    equipments: (raw.equipments ?? []).map(
      (e, idx): EquipmentDetail => ({
        id: e.id ?? idx,
        name: e.name ?? "",
        description: undefined,
        icon: resolveIcon(e.name ?? ""),
      })
    ),
    schedule,
  };
};

const formatTimeShort = (time: string) => time.slice(0, 5);

/** Builds a single-line summary for the success screen from API time slots. */
const formatBookingTimeSlotSummary = (
  slots: BookingCreatedTimeSlotDto[],
  fallbackSlotIds: string[]
): string => {
  if (slots.length > 0) {
    return slots
      .map(
        (s) =>
          `${formatTimeShort(s.startTime)} — ${formatTimeShort(s.endTime)}`
      )
      .join(", ");
  }
  return fallbackSlotIds.join(", ");
};

const EMPTY_BUILDING: CreateBookingResponseDataDto["building"] = {
  id: 0,
  name: "",
  address: "",
};

const adaptCreateBookingResponse = (
  raw: CreateBookingResponseDataDto,
  payload: BookingSubmitPayload
): BookingConfirmation => ({
  bookingId: String(raw.bookingId ?? ""),
  roomName: raw.roomName ?? "",
  building: raw.building ?? EMPTY_BUILDING,
  date: raw.bookingDate ?? payload.date,
  timeSlot: formatBookingTimeSlotSummary(raw.timeSlots ?? [], payload.slotIds),
  status: raw.bookingStatus ?? "PENDING",
});

export const roomDetailApiService = {
  getRoomById: async (roomId: string): Promise<RoomDetail> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.get(ROOMS_ENDPOINTS.DETAIL(roomId), {
      ...getAuthConfig(token ?? null),
    });
    const raw = unwrapData(response.data);
    return adaptRoomDetail(raw);
  },

  submitBooking: async (
    payload: BookingSubmitPayload
  ): Promise<BookingConfirmation> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.post(
      BOOKINGS_ENDPOINTS.BASE,
      {
        classroomId: Number(payload.roomId),
        bookingDate: payload.date,
        timeSlotIds: payload.slotIds.map((id) => Number(id)),
        timeBooking: new Date().toISOString(),
        purpose: payload.purpose,
        attendees: payload.attendees,
      },
      { ...getAuthConfig(token ?? null) }
    );
    const raw = (response.data?.data ?? response.data) as CreateBookingResponseDataDto;
    return adaptCreateBookingResponse(raw, payload);
  },
};
