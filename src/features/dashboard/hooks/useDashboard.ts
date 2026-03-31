import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const useDashboard = () => {
  const summary = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: dashboardApi.getSummary,
    staleTime: 1000 * 60 * 2,
  });

  const upcomingBookings = useQuery({
    queryKey: ["dashboard", "upcoming-bookings"],
    queryFn: () => dashboardApi.getUpcomingBookings(5),
    staleTime: 1000 * 60 * 2,
  });

  const recentRooms = useQuery({
    queryKey: ["dashboard", "recent-rooms"],
    queryFn: () => dashboardApi.getRecentlyViewedRooms(3),
    staleTime: 1000 * 60 * 5,
  });

  return { summary, upcomingBookings, recentRooms };
};
