// ─────────────────────────────────────────────────────────────────────────────
// Room Detail — UI type definitions
// These are the shapes consumed by the RoomDetail page components.
// ─────────────────────────────────────────────────────────────────────────────

export type SlotStatus = "available" | "occupied" | "pending";

export interface BookingSlot {
  /** Unique identifier for the slot (e.g. "14:00-16:00") */
  id: string;
  /** Display label, e.g. "14:00 — 16:00" */
  label: string;
  status: SlotStatus;
}

export interface DateOption {
  /** ISO date string yyyy-MM-dd */
  date: string;
  /** Short weekday label, e.g. "Mon" */
  day: string;
  /** Day of month, e.g. 25 */
  dayNum: number;
}

export interface EquipmentDetail {
  id: number;
  name: string;
  description?: string;
  icon: string; // Lucide icon name
}

export interface RoomDetail {
  id: string;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  roomType: string;
  imageUrl?: string;
  imageGradient?: string;
  equipments: EquipmentDetail[];
}

export interface BookingSubmitPayload {
  roomId: string;
  date: string;
  slotId: string;
  purpose: string;
}

export interface BookingConfirmation {
  bookingId: string;
  roomName: string;
  building: string;
  date: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED";
}
