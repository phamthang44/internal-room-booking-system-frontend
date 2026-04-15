// ── Pages ──────────────────────────────────────────────────────────────────────
export { AdminRoomsListPage } from "./pages/AdminRoomsListPage";
export { AdminRoomUpsertPage } from "./pages/AdminRoomUpsertPage";
export { AdminRoomAuditPanelPage } from "./pages/AdminRoomAuditPanelPage";

// ── Hooks ──────────────────────────────────────────────────────────────────────
export { useAdminRoomsService } from "./api/adminRooms.service";
export {
  adminRoomsQueryKeys,
  useAdminRoomsListQuery,
  useAdminRoomDetailQuery,
  useAdminRoomCreateMutation,
  useAdminRoomUpdateMutation,
  useAdminRoomStatusMutation,
} from "./hooks/useAdminRoomsQueries";
export type { AdminRoomsListQueryParams } from "./hooks/useAdminRoomsQueries";

// ── Types ──────────────────────────────────────────────────────────────────────
export type {
  ApiResult,
  AdminDetailClassroomResponse,
  CreateClassroomRequest,
  UpdateClassroomRequest,
  UpdateClassroomStatusRequest,
} from "./types/adminRooms.api.types";

