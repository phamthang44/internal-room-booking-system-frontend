// ─────────────────────────────────────────────────────────────────────────────
// Classroom API Service — GET /api/v1/rooms
// Uses the shared apiClient (axios with Bearer + Accept-Language interceptors)
// ─────────────────────────────────────────────────────────────────────────────
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { ROOMS_ENDPOINTS } from "../constants/rooms.endpoints";
import type {
  ApiResultClassroomList,
  RoomSearchParams,
  RoomUI,
  RoomsPageUI,
  EquipmentResponse,
  ClassroomScheduleSlotResponse,
  RoomScheduleSlotUI,
} from "../types/classroom.api.types";
import { mapRoomStatusApiToAvailability } from "../utils/roomStatusMapping";
import { isSlotInPast } from "../utils/slotAvailability";

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

const adaptSlot = (
  s: ClassroomScheduleSlotResponse,
  scheduleDate?: string,
  now: Date = new Date(),
): RoomScheduleSlotUI => {
  const inPast = scheduleDate ? isSlotInPast(scheduleDate, s.startTime ?? "", now) : false;
  return {
    slotId: s.slotId ?? 0,
    slotName: s.slotName ?? "",
    startTime: s.startTime ?? "",
    endTime: s.endTime ?? "",
    isAvailable: Boolean(s.isAvailable) && !inPast,
    isPast: inPast,
    status: inPast ? "PAST" : (s.status != null ? String(s.status) : ""),
  };
};

// ── Response adapter ──────────────────────────────────────────────────────────
// Converts the raw API wire type into the UI model consumed by components.
// This is the ONLY place that touches ClassroomListResponse fields.

const adaptRoom = (raw: NonNullable<ApiResultClassroomList["data"]>[number]): RoomUI => {
  const scheduleDate = raw.dailySchedule?.date ?? "";
  const now = new Date();

  const adaptedDailySlots = (raw.dailySchedule?.slots ?? []).map((s) => adaptSlot(s, scheduleDate, now));
  const adaptedQueriedSlots = (raw.queriedSlotsStatus ?? []).map((s) => adaptSlot(s, scheduleDate, now));

  const hasQueriedSlots = (raw.totalQueriedSlots ?? 0) > 0 || adaptedQueriedSlots.length > 0;
  const effectiveTotalQueried = raw.totalQueriedSlots ?? (adaptedQueriedSlots.length || undefined);
  const effectiveAvailableCount = hasQueriedSlots
    ? adaptedQueriedSlots.filter((s) => s.isAvailable).length
    : raw.availableSlotCount;

  let effectiveAvailableForQuery = raw.isAvailableForQuery ?? raw.availableForQuery;
  if (hasQueriedSlots && effectiveTotalQueried != null) {
    effectiveAvailableForQuery = effectiveAvailableCount === effectiveTotalQueried && effectiveTotalQueried > 0;
  } else if (adaptedDailySlots.length > 0) {
    effectiveAvailableForQuery = adaptedDailySlots.some((s) => s.isAvailable);
  }

  const roomAvailability = mapRoomStatusApiToAvailability(raw.status);
  if (roomAvailability !== "available") {
    effectiveAvailableForQuery = false;
  }

  return {
    id: String(raw.classroomId ?? 0),
    name: raw.roomName ?? "",
    building: raw.buildingName ?? "",
    capacity: raw.capacity ?? 0,
    availability: roomAvailability,
    equipmentNames: (raw.equipments ?? []).map((e: EquipmentResponse) => e.name ?? "").filter(Boolean),
    equipments: raw.equipments ?? [],
    roomType: raw.roomType ?? "",
    imageGradient: buildGradient(raw.classroomId ?? 0),
    imageUrl: raw.imageUrl ?? undefined,
    dailySchedule: raw.dailySchedule
      ? {
          date: scheduleDate,
          slots: adaptedDailySlots,
        }
      : undefined,
    queriedSlotsStatus: adaptedQueriedSlots,
    availableSlotCount: effectiveAvailableCount,
    totalQueriedSlots: effectiveTotalQueried,
    availableForQuery: effectiveAvailableForQuery,
  };
};

// ── API service ───────────────────────────────────────────────────────────────

export const classroomApiService = {
  /**
   * GET /api/v1/rooms
   * Searches / lists classrooms with optional filters and pagination.
   * Sends Bearer token from auth store + Accept-Language via interceptor.
   */
  searchRooms: async (params: RoomSearchParams = {}): Promise<RoomsPageUI> => {
    const { token } = useAuthStore.getState();

    // Build query string manually so arrays serialize as repeated params:
    // timeSlotIds=1&timeSlotIds=2 (best practice for Spring-style backends).
    const qs = new URLSearchParams();
    (Object.entries(params) as Array<[string, unknown]>).forEach(([k, v]) => {
      if (v === undefined || v === "") return;
      if (Array.isArray(v)) {
        v.forEach((item) => qs.append(k, String(item)));
        return;
      }
      qs.set(k, String(v));
    });

    const url = qs.toString()
      ? `${ROOMS_ENDPOINTS.LIST}?${qs.toString()}`
      : ROOMS_ENDPOINTS.LIST;

    const response = await apiClient.get<ApiResultClassroomList>(url, {
      ...getAuthConfig(token ?? null),
    });

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
