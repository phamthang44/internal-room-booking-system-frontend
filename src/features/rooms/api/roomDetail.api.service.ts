// ─────────────────────────────────────────────────────────────────────────────
// Room Detail API Service
// GET BASE_URL/rooms/:id — classroom details + schedule
// POST BASE_URL/bookings — submit booking
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import type {
  RoomDetail,
  EquipmentDetail,
  RoomDetailDataDto,
  RoomScheduleDto,
  BookingSubmitPayload,
  BookingConfirmation,
} from "../types/roomDetail.types";

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

const adaptRoomDetail = (raw: RoomDetailDataDto): RoomDetail => ({
  id: String(raw.classroomId),
  name: raw.roomName,
  building: raw.building,
  addressBuildingLocation: raw.addressBuildingLocation,
  capacity: raw.capacity,
  roomType: raw.roomType,
  imageUrl: undefined,
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
  schedule: sortSchedule(raw.schedule),
});

const BASE = import.meta.env.VITE_API_URL;

export const roomDetailApiService = {
  getRoomById: async (roomId: string): Promise<RoomDetail> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.get(`${BASE}/rooms/${roomId}`, {
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
      `${BASE}/bookings`,
      {
        classroomId: payload.roomId,
        bookingDate: payload.date,
        timeSlotIds: payload.slotIds.map((id) => Number(id)),
        purpose: payload.purpose,
        expectedAttendees: payload.attendees,
      },
      { ...getAuthConfig(token ?? null) }
    );
    const raw = response.data?.data ?? response.data;
    return {
      bookingId: String(raw.bookingId ?? raw.id ?? ""),
      roomName: raw.roomName ?? raw.classroomName ?? "",
      building: raw.buildingName ?? "",
      date: raw.bookingDate ?? payload.date,
      timeSlot: raw.timeSlot ?? payload.slotIds.join(", "),
      status: raw.status ?? "PENDING",
    };
  },
};
