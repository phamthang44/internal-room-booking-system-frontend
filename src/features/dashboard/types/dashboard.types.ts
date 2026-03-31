import type { StatusChipVariant } from "@shared/components/StatusChip";

export interface DashboardSummary {
  totalBookings: number;
  upcomingToday: number;
  pendingRequests: number;
}

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
