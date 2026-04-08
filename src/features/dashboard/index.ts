// Types
export type {
  RoomDetail,
  BookingDetail,
  ActivityHistoryItem,
  EnhancedDashboardData,
  DashboardSummary,
  UpcomingBooking,
  RecentRoom,
} from "./types/dashboard.types";

// API
export { fetchStudentDashboard } from "./api/student-dashboard.api";

// Hooks
export { useStudentDashboardRecentActivity } from "./hooks/useStudentDashboardRecentActivity";

// Components
export { HeroSection } from "./components/recent-activity/HeroSection";
export { SummaryBento } from "./components/recent-activity/SummaryBento";
export { ActivityCarousel } from "./components/recent-activity/ActivityCarousel";
export { UpcomingList } from "./components/recent-activity/UpcomingList";

// Pages
export { StudentDashboard } from "./pages/StudentDashboard";
