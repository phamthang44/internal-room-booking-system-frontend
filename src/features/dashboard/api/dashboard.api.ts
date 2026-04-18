import type {
  DashboardSummary,
  UpcomingBooking,
  RecentRoom,
} from "../types/dashboard.types";
import { fetchStudentDashboard } from "./student-dashboard.api";

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_SUMMARY: DashboardSummary = {
  totalBookings: 24,
  upcomingToday: 2,
  pendingRequests: 1,
};

const MOCK_UPCOMING_BOOKINGS: UpcomingBooking[] = [
  {
    id: "bk-001",
    title: "Senior Design Capstone Review",
    roomName: "Room 402 - Arts Block",
    building: "Arts & Media Block",
    date: new Date().toISOString(),
    startTime: "14:00",
    endTime: "16:30",
    status: "confirmed",
  },
  {
    id: "bk-002",
    title: "Psychology Research Group",
    roomName: "Seminar Room B",
    building: "Main Library",
    date: new Date(Date.now() + 86400000).toISOString(),
    startTime: "09:00",
    endTime: "11:00",
    status: "confirmed",
  },
  {
    id: "bk-003",
    title: "Digital Fabrication Lab",
    roomName: "FabLab Workspace",
    building: "Engineering Block",
    date: new Date(Date.now() + 2 * 86400000).toISOString(),
    startTime: "13:00",
    endTime: "15:00",
    status: "pending",
  },
];

const MOCK_RECENT_ROOMS: RecentRoom[] = [
  {
    id: "rm-001",
    name: "Design Studio 402",
    building: "Arts & Media Block",
    floor: "Level 4",
  },
  {
    id: "rm-002",
    name: "Collaborative Pod C",
    building: "Main Library",
    floor: "Ground Floor",
  },
  {
    id: "rm-003",
    name: "Great Hall Annex",
    building: "Old Campus",
    floor: "West Wing",
  },
];

// ─── API Functions ─────────────────────────────────────────────────────────────

const USE_MOCK = false;
const toUpcomingStatus = (status: string): UpcomingBooking["status"] => {
  const normalized = status.toUpperCase();
  if (
    normalized === "APPROVED" ||
    normalized === "CONFIRMED" ||
    normalized === "CHECKED_IN"
  ) {
    return "confirmed";
  }
  if (normalized === "CANCELLED" || normalized === "REJECTED") {
    return "cancelled";
  }
  return "pending";
};

const parseTimeSlotRange = (
  timeSlotRange: string,
): { startTime: string; endTime: string } => {
  const [startTimeRaw, endTimeRaw] = timeSlotRange
    .split("-")
    .map((v) => v.trim());
  return {
    startTime: startTimeRaw || "00:00",
    endTime: endTimeRaw || "00:00",
  };
};

const mapUpcomingBookings = (
  limit: number,
  items: Array<{
    bookingId: number;
    bookingDate: string;
    timeSlotRange: string;
    status: string;
    classroomName?: string;
    buildingName?: string;
  }>,
): UpcomingBooking[] => {
  return items.slice(0, limit).map((item) => {
    const { startTime, endTime } = parseTimeSlotRange(item.timeSlotRange);

    return {
      id: String(item.bookingId),
      title: `Booking #${item.bookingId}`,
      roomName: item.classroomName ?? "Room details pending",
      building: item.buildingName ?? "TBD",
      date: item.bookingDate,
      startTime,
      endTime,
      status: toUpcomingStatus(item.status),
    };
  });
};

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    if (USE_MOCK) return Promise.resolve(MOCK_SUMMARY);
    const response = await fetchStudentDashboard();
    return {
      totalBookings: response.data.totalBookings,
      upcomingToday: response.data.upcomingBookings,
      pendingRequests: response.data.pendingBookings,
    };
  },

  getUpcomingBookings: async (limit = 5): Promise<UpcomingBooking[]> => {
    if (USE_MOCK)
      return Promise.resolve(MOCK_UPCOMING_BOOKINGS.slice(0, limit));
    const response = await fetchStudentDashboard();
    return mapUpcomingBookings(limit, response.data.upcomingList);
  },

  getRecentlyViewedRooms: async (limit = 3): Promise<RecentRoom[]> => {
    if (USE_MOCK) return Promise.resolve(MOCK_RECENT_ROOMS.slice(0, limit));
    const rooms: RecentRoom[] = [];
    return rooms.slice(0, limit);
  },
};
