// ─────────────────────────────────────────────────────────────────────────────
// Room Detail — API DTOs (backend contract) + UI types for the detail page
// GET BASE_URL/rooms/:id → { data: RoomDetailDataDto, meta?: ... }
// ─────────────────────────────────────────────────────────────────────────────

import type { RoomAvailabilityUI, RoomStatusApi } from "./classroom.api.types";

/** Backend slot status (extend as new values appear). */
export type RoomSlotStatusApi = string;

export interface RoomSlotDto {
  slotId: number;
  slotName: string;
  startTime: string;
  endTime: string;
  status: RoomSlotStatusApi;
  isAvailable: boolean;
  /** Last/active booking id associated with this slot (if any). */
  currentBookingId?: number;
  /** Reason when the latest request was rejected (viewer-scoped, if provided by API). */
  rejectionReason?: string;
  /** Whether the slot's booking (if any) belongs to the current viewer. */
  isMine?: boolean;
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
  /** Backward-compatible list of image URLs for this room */
  imageUrls?: string[];
  /**
   * Same enum as list items (`ClassroomListResponse.status` on `GET /rooms`).
   * Detail payloads often use this field name; prefer it when `roomStatus` is absent.
   */
  status?: RoomStatusApi;
  /** Same enum as room listing; some APIs use this instead of `status`. */
  roomStatus?: RoomStatusApi;
  /** Alternate wire name used by some API gateways (same enum as `roomStatus`). */
  RoomStatus?: RoomStatusApi;
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

/**
 * Slot row state in the booking sidebar.
 * `roomMaintenance` / `roomUnavailable` = room-level closure (matches `RoomStatus` on listing), not a booking.
 */
export type SlotStatus =
  | "available"
  | "occupied"
  | "bookedByMe"
  | "inUse"
  | "pendingApproval"
  | "roomMaintenance"
  | "roomUnavailable";

export interface BookingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  /** Raw times from API (used for client-side "past slot" disabling). */
  startTime?: string;
  endTime?: string;
  /** Additional UI-only disabled reasons for otherwise-available slots. */
  disabledReason?: "past";
  /**
   * Additional UI hint for "available" slots that still have context
   * (e.g., the viewer's prior request was rejected).
   */
  note?: {
    kind: "rejected";
    reason?: string;
    bookingId?: number;
  };
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
  /** Same mapping as room listing cards (`RoomStatusChip`). */
  availability: RoomAvailabilityUI;
  /** Gallery images (0-5). When present, `imageUrl` is typically the first. */
  imageUrls?: string[];
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

/** POST /bookings → response.data (create booking summary). */
export interface BookingCreatedTimeSlotDto {
  id: number;
  startTime: string;
  endTime: string;
  slotName: string;
}

export interface CreateBookingResponseDataDto {
  bookingId: number;
  roomName: string;
  building: BuildingDto;
  bookingDate: string;
  timeSlots: BookingCreatedTimeSlotDto[];
  bookingStatus: string;
}

/** Normalized success payload for /booking/success (router state). */
export interface BookingConfirmation {
  bookingId: string;
  roomName: string;
  building: BuildingDto;
  date: string;
  /** Display string derived from `timeSlots` (e.g. "13:00 — 15:00"). */
  timeSlot: string;
  status: string;
}
