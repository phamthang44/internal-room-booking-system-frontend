// ─────────────────────────────────────────────────────────────────────────────
// Classroom / Room Listing — API TypeScript Interfaces
// Strictly generated from OpenAPI spec: GET /api/v1/rooms
// DO NOT add fields that are not in the contract.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared envelope types ─────────────────────────────────────────────────────

/** Pagination / metadata envelope returned on every response */
export interface ApiMeta {
  serverTime?: number;
  apiVersion?: string;
  traceId?: string;
  message?: string;
  nextCursor?: string;
  hasNextPage?: boolean;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  sort?: string;
  filter?: Record<string, unknown>;
}

export interface ApiErrorDetail {
  code?: string;
  message?: string;
  traceId?: string;
  details?: unknown;
}

/** Generic API response envelope */
export interface ApiResult<T> {
  data?: T;
  meta?: ApiMeta;
  error?: ApiErrorDetail;
}

// ── Room status ───────────────────────────────────────────────────────────────

/** Exact enum values from the contract (backend uses ALL_CAPS) */
export type RoomStatusApi =
  | "AVAILABLE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "DELETED";

// ── Room sort options ─────────────────────────────────────────────────────────

export type RoomSortApi =
  | "newest"
  | "room_name_asc"
  | "room_name_desc"
  | "capacity_asc"
  | "capacity_desc";

// ── Equipment ─────────────────────────────────────────────────────────────────

/** Equipment as returned in room list responses */
export interface EquipmentResponse {
  id?: number;    // int32
  name?: string;
  description?: string;
}

// ── Room list response ────────────────────────────────────────────────────────

/** Single classroom item from GET /api/v1/rooms */
export interface ClassroomListResponse {
  classroomId?: number;   // int64
  buildingName?: string;
  roomName?: string;
  capacity?: number;      // int32
  status?: RoomStatusApi;
  equipments?: EquipmentResponse[];
  roomType?: string;
}

/** Full API response shape for GET /api/v1/rooms */
export type ApiResultClassroomList = ApiResult<ClassroomListResponse[]>;

// ── Search / filter request parameters ───────────────────────────────────────

/**
 * Query parameters for GET /api/v1/rooms
 * Mirrors RoomSearchRequest from the contract exactly.
 */
export interface RoomSearchParams {
  keyword?: string;
  roomStatus?: RoomStatusApi;
  bookingDate?: string;        // format: date (yyyy-MM-dd)
  timeSlotId?: number;         // int32
  capacity?: number;           // int32 — minimum capacity required
  equipmentId?: number;        // int32 — single equipment filter
  page?: number;               // int32
  size?: number;               // int32
  sort?: RoomSortApi;
}

// ── Normalized UI types ───────────────────────────────────────────────────────
// These are the shapes consumed by components. The adapter layer maps
// ClassroomListResponse → RoomUI so UI code never touches raw API types.

export type RoomAvailabilityUI = "available" | "occupied" | "maintenance";

/** UI-facing room model (produced by the adapter, consumed by components) */
export interface RoomUI {
  /** classroomId from API, stringified */
  id: string;
  /** roomName from API */
  name: string;
  /** buildingName from API */
  building: string;
  /** capacity from API */
  capacity: number;
  /** Mapped from RoomStatusApi → RoomAvailabilityUI */
  availability: RoomAvailabilityUI;
  /** equipment names (equipment.name) */
  equipmentNames: string[];
  /** equipment raw objects for id-based operations */
  equipments: EquipmentResponse[];
  /** roomType from API */
  roomType: string;
  /** CSS gradient — generated client-side, NOT from API */
  imageGradient?: string;
}

/** Normalised paginated rooms response consumed by hooks */
export interface RoomsPageUI {
  rooms: RoomUI[];
  total: number;       // totalElements from meta
  page: number;
  totalPages: number;
  hasNextPage: boolean;
}
