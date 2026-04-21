import apiClient from "@core/api/client";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { DASHBOARD_ENDPOINTS } from "../constants/dashboard.endpoints";

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
  /** CHECK_IN when approved, CHECK_OUT when checked in; omitted when no primary action. */
  nextAction?: string | null;
  classroomName?: string;
  buildingName?: string;
  title?: string;
}

export interface HistoryItem {
  bookingId: number;
  classroomName: string;
  action: string;
  statusAfter?: string;
  timestamp: string;
  message: string;
  buildingName?: string;
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
        bookingId: 20,
        classroomName: "A.101",
        buildingName: "Tòa nhà A",
        bookingDate: "2026-04-13",
        timeSlotRange: "07:00 - 11:30",
        status: "APPROVED",
        nextAction: "CHECK_IN",
      },
      {
        bookingId: 102,
        bookingDate: "2026-04-09",
        timeSlotRange: "09:00 - 11:00",
        status: "PENDING",
        classroomName: "Seminar Room B",
        buildingName: "Science Building",
        title: "Psychology Research Group",
      },
      {
        bookingId: 103,
        bookingDate: "2026-04-10",
        timeSlotRange: "13:00 - 15:00",
        status: "APPROVED",
        classroomName: "FabLab Workspace",
        buildingName: "Engineering Block",
        title: "Digital Fabrication Lab",
      },
    ],
    historyList: [
      {
        bookingId: 19,
        classroomName: "A.101",
        buildingName: "Tòa nhà A",
        action: "APPROVE_BOOKING",
        statusAfter: "APPROVED",
        timestamp: "2026-04-01T03:28:24.851531Z",
        message: "Đơn đặt phòng đã được phê duyệt.",
      },
      {
        bookingId: 100,
        classroomName: "Design Studio 402",
        action: "CONFIRM_BOOKING",
        statusAfter: "CONFIRMED",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        message: "Auto-confirmed after payment",
        buildingName: "Arts Block",
      },
      {
        bookingId: 99,
        classroomName: "Collaborative Pod C",
        action: "SUBMIT_BOOKING",
        statusAfter: "PENDING",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        message: "Awaiting approval",
        buildingName: "Library",
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
      DASHBOARD_ENDPOINTS.STUDENT_DASHBOARD,
      getAuthConfig(token),
    );
    return response.data;
  };
