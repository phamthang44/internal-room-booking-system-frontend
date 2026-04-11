// ── API types (generated from OpenAPI contract) ───────────────────────────────
export type {
  ApiMeta,
  ApiErrorDetail,
  ApiResult,
  RoomStatusApi,
  RoomSortApi,
  EquipmentResponse,
  ClassroomListResponse,
  ApiResultClassroomList,
  RoomSearchParams,
  RoomAvailabilityUI,
  RoomUI,
  RoomsPageUI,
} from "./types/classroom.api.types";

// ── Room Detail UI types ──────────────────────────────────────────────────────
export type {
  SlotStatus,
  BookingSlot,
  DateOption,
  EquipmentDetail,
  RoomDetail,
  BookingSubmitPayload,
  BookingConfirmation,
} from "./types/roomDetail.types";

// ── Legacy UI types (still used by mock api and Zustand store) ────────────────
export type {
  RoomAvailability,
  EquipmentItem,
  Room,
  RoomFilters,
  RoomsResponse,
} from "./types/room.types";
export { EQUIPMENT_LABELS } from "./types/room.types";

// ── API service ────────────────────────────────────────────────────────────────
export { classroomApiService } from "./api/classroom.api.service";
export { roomDetailApiService } from "./api/roomDetail.api.service";

// ── Legacy mock API (USE_MOCK = false, kept for reference) ────────────────────
export { roomsApi } from "./api/rooms.api";

// ── Hooks ──────────────────────────────────────────────────────────────────────
export { useClassrooms, classroomQueryKeys } from "./hooks/useClassrooms";
export { useRooms, useBuildings } from "./hooks/useRooms";
export { useRoomFilterStore } from "./hooks/useRoomFilterStore";
export { useRoomDetail, useSubmitBooking, roomDetailQueryKeys } from "./hooks/useRoomDetail";

// ── Components ─────────────────────────────────────────────────────────────────
export { RoomCard } from "./components/RoomCard";
export { SearchBar } from "./components/SearchBar";
export { FilterSidebar } from "./components/FilterSidebar";
export { FilterGroup } from "./components/FilterGroup";
export { RoomGrid } from "./components/RoomGrid";

// ── Pages ──────────────────────────────────────────────────────────────────────
export { RoomListPage } from "./pages/RoomListPage";
export { RoomDetailPage } from "./pages/RoomDetailPage";
export { BookingConfirmationPage } from "./pages/BookingConfirmationPage";
