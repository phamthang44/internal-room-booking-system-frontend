// Types
export type {
  DashboardSummary,
  UpcomingBooking,
  RecentRoom,
} from "./types/dashboard.types";

// API
export { dashboardApi } from "./api/dashboard.api";

// Hooks
export { useDashboard } from "./hooks/useDashboard";

// Components
export { DashboardStats } from "./components/DashboardStats";
export { RecentlyViewedSection } from "./components/RecentlyViewedSection";
export { UpcomingBookingsSection } from "./components/UpcomingBookingsSection";

// Pages
export { StudentDashboard } from "./pages/StudentDashboard";
