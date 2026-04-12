// ─────────────────────────────────────────────────────────────────────────────
// Classroom API Service — GET /api/v1/rooms
// Uses the shared apiClient (axios with Bearer + Accept-Language interceptors)
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import type {
  ApiResultClassroomList,
  RoomSearchParams,
  RoomStatusApi,
  RoomAvailabilityUI,
  RoomUI,
  RoomsPageUI,
  EquipmentResponse,
  ClassroomScheduleSlotResponse,
  RoomScheduleSlotUI,
} from "../types/classroom.api.types";

// ── Deterministic gradient (client-side only, no API field) ──────────────────

const GRADIENTS = [
  "linear-gradient(135deg, #1a365d 0%, #2d5a8e 100%)",
  "linear-gradient(135deg, #002712 0%, #003f21 100%)",
  "linear-gradient(135deg, #2d3133 0%, #43474e 100%)",
  "linear-gradient(135deg, #1a365d 0%, #003f21 60%, #002712 100%)",
  "linear-gradient(135deg, #002045 0%, #455f88 100%)",
  "linear-gradient(135deg, #555f70 0%, #1a365d 100%)",
];

const buildGradient = (id: number): string =>
  GRADIENTS[id % GRADIENTS.length];

// ── Status adapter ────────────────────────────────────────────────────────────
// Maps backend ALL_CAPS enum → UI lowercase variant used by StatusChip

const STATUS_MAP: Record<RoomStatusApi, RoomAvailabilityUI> = {
  AVAILABLE: "available",
  INACTIVE: "occupied",    // closest visual meaning
  MAINTENANCE: "maintenance",
  DELETED: "occupied",     // should never appear in public listing
};

const mapStatus = (status?: RoomStatusApi): RoomAvailabilityUI =>
  status ? (STATUS_MAP[status] ?? "occupied") : "occupied";

const adaptSlot = (s: ClassroomScheduleSlotResponse): RoomScheduleSlotUI => ({
  slotId: s.slotId ?? 0,
  slotName: s.slotName ?? "",
  startTime: s.startTime ?? "",
  endTime: s.endTime ?? "",
  isAvailable: Boolean(s.isAvailable),
  status: s.status != null ? String(s.status) : "",
});

// ── Response adapter ──────────────────────────────────────────────────────────
// Converts the raw API wire type into the UI model consumed by components.
// This is the ONLY place that touches ClassroomListResponse fields.

const adaptRoom = (raw: NonNullable<ApiResultClassroomList["data"]>[number]): RoomUI => ({
  id: String(raw.classroomId ?? 0),
  name: raw.roomName ?? "",
  building: raw.buildingName ?? "",
  capacity: raw.capacity ?? 0,
  availability: mapStatus(raw.status),
  equipmentNames: (raw.equipments ?? []).map((e: EquipmentResponse) => e.name ?? "").filter(Boolean),
  equipments: raw.equipments ?? [],
  roomType: raw.roomType ?? "",
  imageGradient: buildGradient(raw.classroomId ?? 0),
  dailySchedule: raw.dailySchedule
    ? {
        date: raw.dailySchedule.date ?? "",
        slots: (raw.dailySchedule.slots ?? []).map(adaptSlot),
      }
    : undefined,
  availableForQuery: raw.availableForQuery,
});

// ── API service ───────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL;

export const classroomApiService = {
  /**
   * GET /api/v1/rooms
   * Searches / lists classrooms with optional filters and pagination.
   * Sends Bearer token from auth store + Accept-Language via interceptor.
   */
  searchRooms: async (params: RoomSearchParams = {}): Promise<RoomsPageUI> => {
    const { token } = useAuthStore.getState();

    // Remove undefined values to keep URL clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ) as Record<string, string | number>;

    const response = await apiClient.get<ApiResultClassroomList>(
      `${BASE}/rooms`,
      {
        params: cleanParams,
        ...getAuthConfig(token ?? null),
      }
    );

    const { data: rooms = [], meta = {} } = response.data;

    // API uses 0-based page index; UI uses 1-based page numbers.
    const apiPage = meta.page ?? 0;
    const totalPages = meta.totalPages ?? 1;

    return {
      rooms: rooms.map(adaptRoom),
      total: meta.totalElements ?? 0,
      page: apiPage + 1,
      totalPages,
      hasNextPage: meta.hasNextPage ?? apiPage + 1 < totalPages,
    };
  },
};

// ── Re-export types consumed by hooks ─────────────────────────────────────────
export type { RoomSearchParams, RoomsPageUI, RoomUI };
