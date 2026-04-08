import type { StatusChipVariant } from "@shared/components/StatusChip";

export interface DashboardSummary {
  totalBookings: number;
  upcomingToday: number;
  pendingRequests: number;
}

export interface RoomDetail {
  id: string;
  name: string;
  building: string;
  floor?: string;
  capacity?: number;
}

export interface BookingDetail {
  id: string;
  bookingId: number;
  title: string;
  room: RoomDetail;
  date: string; // ISO string
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  timeSlotRange: string; // "HH:MM - HH:MM"
  status: "APPROVED" | "PENDING" | "CONFIRMED" | "CANCELLED" | "REJECTED" | "COMPLETED";
  statusVariant: Extract<StatusChipVariant, "confirmed" | "pending" | "cancelled">;
}

export interface ActivityHistoryItem {
  bookingId: number;
  action: "APPROVED" | "PENDING" | "CANCELLED" | "REJECTED" | "COMPLETED" | "CHECKED_IN" | "SUBMITTED";
  timestamp: string; // ISO string
  note?: string;
  room?: RoomDetail;
  title?: string;
}

export interface EnhancedDashboardData {
  summary: DashboardSummary;
  upcomingBookings: BookingDetail[];
  recentActivity: ActivityHistoryItem[];
}

// Legacy types (keep for backward compatibility)
export interface UpcomingBooking {
  id: string;
  title: string;
  roomName: string;
  building: string;
  date: string; // ISO string
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  status: Extract<StatusChipVariant, "confirmed" | "pending" | "cancelled">;
}

export interface RecentRoom {
  id: string;
  name: string;
  building: string;
  floor: string;
}
