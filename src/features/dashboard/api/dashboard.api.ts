import type {
  DashboardSummary,
  UpcomingBooking,
  RecentRoom,
} from "../types/dashboard.types";

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

// ─── API Functions (swap USE_MOCK → false when backend is ready) ─────────────

const USE_MOCK = true;
const BASE = "/api/v1";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardSummary> => {
    if (USE_MOCK) return Promise.resolve(MOCK_SUMMARY);
    const res = await fetch(`${BASE}/dashboard/summary`);
    return res.json();
  },

  getUpcomingBookings: async (limit = 5): Promise<UpcomingBooking[]> => {
    if (USE_MOCK)
      return Promise.resolve(MOCK_UPCOMING_BOOKINGS.slice(0, limit));
    const res = await fetch(`${BASE}/bookings?status=UPCOMING&limit=${limit}`);
    const data = await res.json();
    return data.bookings;
  },

  getRecentlyViewedRooms: async (limit = 3): Promise<RecentRoom[]> => {
    if (USE_MOCK) return Promise.resolve(MOCK_RECENT_ROOMS.slice(0, limit));
    const res = await fetch(`${BASE}/rooms/recently-viewed?limit=${limit}`);
    const data = await res.json();
    return data.rooms;
  },
};
