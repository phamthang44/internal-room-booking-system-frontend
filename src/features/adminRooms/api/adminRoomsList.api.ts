import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { ROOMS_ENDPOINTS } from "@features/rooms/constants/rooms.endpoints";
import type {
  ApiResultClassroomList,
  ClassroomListResponse,
  EquipmentResponse,
  RoomSearchParams,
  RoomStatusApi,
} from "@features/rooms/types/classroom.api.types";

export interface AdminRoomListRow {
  classroomId: number;
  roomName: string;
  buildingName: string;
  capacity: number;
  status: RoomStatusApi | undefined;
  equipmentNames: string[];
  roomType: string;
}

export interface AdminRoomsListPageUI {
  rows: AdminRoomListRow[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}

const adaptListRow = (raw: ClassroomListResponse): AdminRoomListRow => ({
  classroomId: raw.classroomId ?? 0,
  roomName: raw.roomName ?? "",
  buildingName: raw.buildingName ?? "",
  capacity: raw.capacity ?? 0,
  status: raw.status,
  equipmentNames: (raw.equipments ?? [])
    .map((e: EquipmentResponse) => e.name ?? "")
    .filter(Boolean),
  roomType: raw.roomType ?? "",
});

/**
 * Admin classroom inventory table — uses the same contract as GET /rooms (public search)
 * but preserves raw {@link RoomStatusApi} for admin badges and actions.
 */
export async function fetchAdminRoomsListPage(
  params: RoomSearchParams = {},
): Promise<AdminRoomsListPageUI> {
  const { token } = useAuthStore.getState();
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== ""),
  ) as Record<string, string | number>;

  const response = await apiClient.get<ApiResultClassroomList>(ROOMS_ENDPOINTS.LIST, {
    params: cleanParams,
    ...getAuthConfig(token ?? null),
  });

  const { data: rooms = [], meta = {} } = response.data;
  const apiPage = meta.page ?? 0;
  const totalPages = meta.totalPages ?? 1;

  return {
    rows: (rooms as ClassroomListResponse[]).map(adaptListRow),
    total: meta.totalElements ?? 0,
    page: apiPage + 1,
    totalPages,
    hasNextPage: meta.hasNextPage ?? apiPage + 1 < totalPages,
  };
}
