// ─────────────────────────────────────────────────────────────────────────────
// Room Detail — API DTOs (backend contract) + UI types for the detail page
// GET BASE_URL/rooms/:id → { data: RoomDetailDataDto, meta?: ... }
// ─────────────────────────────────────────────────────────────────────────────

/** Backend slot status (extend as new values appear). */
export type RoomSlotStatusApi = string;

export interface RoomSlotDto {
  slotId: number;
  slotName: string;
  startTime: string;
  endTime: string;
  status: RoomSlotStatusApi;
  isAvailable: boolean;
}

export interface DayAvailabilityDto {
  date: string;
  slots: RoomSlotDto[];
}

export interface RoomScheduleDto {
  date: string;
  isFull: boolean;
  availabilities: DayAvailabilityDto[];
}

export interface BuildingDto {
  id: number;
  name: string;
  address: string;
}

export interface RoomTypeDto {
  id: number;
  name: string;
}

export interface EquipmentDto {
  id: number;
  name: string;
}

/** Payload inside GET /rooms/:id → response.data */
export interface RoomDetailDataDto {
  classroomId: number;
  roomName: string;
  building: BuildingDto;
  capacity: number;
  schedule: RoomScheduleDto;
  equipments: EquipmentDto[];
  addressBuildingLocation: string;
  roomType: RoomTypeDto;
}

export interface RoomDetailApiMeta {
  apiVersion?: string;
  message?: string;
  serverTime?: number;
  traceId?: string;
}

export interface RoomDetailApiResponse {
  data: RoomDetailDataDto;
  meta?: RoomDetailApiMeta;
}

// ── UI types (components) ───────────────────────────────────────────────────

/** `pendingApproval` = locked (not selectable), same as occupied but different label. */
export type SlotStatus = "available" | "occupied" | "pendingApproval";

export interface BookingSlot {
  id: string;
  label: string;
  status: SlotStatus;
}

export interface DateOption {
  /** ISO date string yyyy-MM-dd */
  date: string;
  day: string;
  dayNum: number;
}

export interface EquipmentDetail {
  id: number;
  name: string;
  description?: string;
  icon: string;
}

/** Normalized room detail for Room Detail UI */
export interface RoomDetail {
  id: string;
  name: string;
  building: BuildingDto;
  addressBuildingLocation: string;
  capacity: number;
  roomType: RoomTypeDto;
  imageUrl?: string;
  imageGradient?: string;
  equipments: EquipmentDetail[];
  schedule: RoomScheduleDto;
}

export interface BookingSubmitPayload {
  roomId: string;
  date: string;
  /** Selected slot id(s), in chronological order — 1 or 2 entries. */
  slotIds: string[];
  purpose: string;
  /** Number of people attending (1 … room capacity). */
  attendees: number;
}

export interface BookingConfirmation {
  bookingId: string;
  roomName: string;
  building: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED";
}
