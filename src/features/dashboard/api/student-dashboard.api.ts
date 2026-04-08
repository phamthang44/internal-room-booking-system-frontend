import apiClient from "@core/api/client";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";

export interface DashboardMeta {
  apiVersion: string;
  serverTime: number;
  traceId: string;
}

export interface UpcomingBookingItem {
  bookingId: number;
  bookingDate: string;
  timeSlotRange: string;
  status: string;
  roomName?: string;
  building?: string;
  title?: string;
}

export interface HistoryItem {
  bookingId: number;
  action: string;
  timestamp: string;
  note: string;
  roomName?: string;
  building?: string;
}

export interface StudentDashboardData {
  totalBookings: number;
  upcomingBookings: number;
  pendingBookings: number;
  upcomingList: UpcomingBookingItem[];
  historyList: HistoryItem[];
}

export interface StudentDashboardResponse {
  data: StudentDashboardData;
  meta: DashboardMeta;
}

const USE_MOCK = false;

const MOCK_RESPONSE: StudentDashboardResponse = {
  data: {
    totalBookings: 24,
    upcomingBookings: 2,
    pendingBookings: 1,
    upcomingList: [
      {
        bookingId: 101,
        bookingDate: "2026-04-08",
        timeSlotRange: "14:00 - 16:30",
        status: "APPROVED",
        roomName: "Room 402",
        building: "Arts Block",
        title: "Senior Design Capstone Review",
      },
      {
        bookingId: 102,
        bookingDate: "2026-04-09",
        timeSlotRange: "09:00 - 11:00",
        status: "PENDING",
        roomName: "Seminar Room B",
        building: "Science Building",
        title: "Psychology Research Group",
      },
      {
        bookingId: 103,
        bookingDate: "2026-04-10",
        timeSlotRange: "13:00 - 15:00",
        status: "APPROVED",
        roomName: "FabLab Workspace",
        building: "Engineering Block",
        title: "Digital Fabrication Lab",
      },
    ],
    historyList: [
      {
        bookingId: 100,
        action: "CONFIRMED",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        note: "Auto-confirmed after payment",
        roomName: "Design Studio 402",
        building: "Arts Block",
      },
      {
        bookingId: 99,
        action: "SUBMITTED",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        note: "Awaiting approval",
        roomName: "Collaborative Pod C",
        building: "Library",
      },
      {
        bookingId: 98,
        action: "CHECKED_IN",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        note: "Session completed",
        roomName: "Great Hall Annex",
        building: "Main Building",
      },
    ],
  },
  meta: {
    apiVersion: "1.0.0",
    serverTime: Date.now(),
    traceId: "mock-trace-id-001",
  },
};

export const fetchStudentDashboard =
  async (): Promise<StudentDashboardResponse> => {
    if (USE_MOCK) return Promise.resolve(MOCK_RESPONSE);
    const { token } = useAuthStore.getState();
    const response = await apiClient.get<StudentDashboardResponse>(
      "/students/dashboard",
      getAuthConfig(token),
    );
    return response.data;
  };
