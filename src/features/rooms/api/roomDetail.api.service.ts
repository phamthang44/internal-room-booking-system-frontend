// ─────────────────────────────────────────────────────────────────────────────
// Room Detail API Service
// GET /api/v1/rooms/:id — fetch single classroom details
// POST /api/v1/bookings — submit a booking request
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import type {
  RoomDetail,
  EquipmentDetail,
  BookingSubmitPayload,
  BookingConfirmation,
} from "../types/roomDetail.types";

// Map equipment names to lucide-react icon names
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
  return "Cpu"; // fallback
};

// ── Adapter: raw API room → RoomDetail ────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adaptRoomDetail = (raw: any): RoomDetail => ({
  id: String(raw.classroomId ?? raw.id ?? ""),
  name: raw.roomName ?? raw.name ?? "",
  building: raw.buildingName ?? raw.building ?? "",
  floor: raw.floor ?? "",
  capacity: raw.capacity ?? 0,
  roomType: raw.roomType ?? "",
  imageUrl: raw.imageUrl ?? undefined,
  imageGradient:
    raw.imageGradient ??
    "linear-gradient(135deg, #002045 0%, #1a365d 60%, #003f21 100%)",
  equipments: (raw.equipments ?? []).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any, idx: number): EquipmentDetail => ({
      id: e.id ?? idx,
      name: e.name ?? "",
      description: e.description ?? "",
      icon: resolveIcon(e.name ?? ""),
    })
  ),
});

const BASE = import.meta.env.VITE_API_URL;

export const roomDetailApiService = {
  /**
   * GET /api/v1/rooms/:roomId
   * Fetches detailed information about a single classroom.
   */
  getRoomById: async (roomId: string): Promise<RoomDetail> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.get(`${BASE}/rooms/${roomId}`, {
      ...getAuthConfig(token ?? null),
    });
    // The API may wrap in { data: ... } or return directly
    const raw = response.data?.data ?? response.data;
    return adaptRoomDetail(raw);
  },

  /**
   * POST /api/v1/bookings
   * Submits a new booking request for a classroom.
   */
  submitBooking: async (
    payload: BookingSubmitPayload
  ): Promise<BookingConfirmation> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.post(
      `${BASE}/bookings`,
      {
        classroomId: payload.roomId,
        bookingDate: payload.date,
        timeSlotId: payload.slotId,
        purpose: payload.purpose,
      },
      { ...getAuthConfig(token ?? null) }
    );
    const raw = response.data?.data ?? response.data;
    return {
      bookingId: String(raw.bookingId ?? raw.id ?? ""),
      roomName: raw.roomName ?? raw.classroomName ?? "",
      building: raw.buildingName ?? "",
      date: raw.bookingDate ?? payload.date,
      timeSlot: raw.timeSlot ?? payload.slotId,
      status: raw.status ?? "PENDING",
    };
  },
};
