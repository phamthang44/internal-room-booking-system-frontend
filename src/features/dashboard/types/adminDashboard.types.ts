export interface ApiResult<T> {
  data: T;
  meta: {
    serverTime: number;
    apiVersion: string;
    traceId: string;
    message?: string;
  };
  error?: {
    code: string;
    message: string;
    traceId: string;
    details?: unknown;
  };
}

export interface RecentViolationSummary {
  violationId: number;
  userEmail: string;
  studentCode: string;
  violationType: string;
  severityPoints: number;
  createdAt: string; // ISO-8601
}

export interface AdminDashboardOverviewResponse {
  pendingApprovalCount: number;
  bookingsTodayCount: number;
  activeRoomsCount: number;
  activePenaltyCount: number;
  bookingStatusBreakdown: Record<string, number>;
  recentViolations: RecentViolationSummary[];
}

export interface DailyBookingTrendResponse {
  date: string; // ISO Date "YYYY-MM-DD"
  totalBookings: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  cancelledCount: number;
  completedCount: number;
  checkedInCount: number;
  newViolations: number;
  noShowCount: number;
}

export interface RoomUtilizationResponse {
  classroomId: number;
  roomName: string;
  weekStart: string; // ISO Date "YYYY-MM-DD" (Monday)
  bookedSlotCount: number;
  totalSlotCapacity: number;
  utilizationPct: number;
  totalBookings: number;
  avgAttendees: number;
}

export interface ViolationTrendResponse {
  date: string; // ISO Date "YYYY-MM-DD"
  violationType: string;
  violationCount: number;
  totalSeverityPts: number;
}

