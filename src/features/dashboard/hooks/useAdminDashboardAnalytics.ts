import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminBookingTrend,
  fetchAdminRoomStats,
  fetchAdminViolationTrend,
} from "../api/admin-dashboard.api";

export function useAdminDashboardAnalytics() {
  const [trendDays, setTrendDays] = useState<7 | 30>(30);
  const [roomWeeks, setRoomWeeks] = useState<4 | 8>(4);
  const [violationWeeks, setViolationWeeks] = useState<4 | 8>(8);

  const bookingTrendQuery = useQuery({
    queryKey: ["admin-dashboard-booking-trend", trendDays],
    queryFn: () => fetchAdminBookingTrend({ days: trendDays }),
    meta: { showGlobalError: true },
  });

  const roomStatsQuery = useQuery({
    queryKey: ["admin-dashboard-room-stats", roomWeeks],
    queryFn: () => fetchAdminRoomStats({ weeks: roomWeeks }),
    meta: { showGlobalError: true },
  });

  const violationTrendQuery = useQuery({
    queryKey: ["admin-dashboard-violation-trend", violationWeeks],
    queryFn: () => fetchAdminViolationTrend({ weeks: violationWeeks }),
    meta: { showGlobalError: true },
  });

  const isLoading =
    bookingTrendQuery.isLoading ||
    roomStatsQuery.isLoading ||
    violationTrendQuery.isLoading;

  const hasAnyError =
    bookingTrendQuery.isError || roomStatsQuery.isError || violationTrendQuery.isError;

  const value = useMemo(
    () => ({
      trendDays,
      setTrendDays,
      roomWeeks,
      setRoomWeeks,
      violationWeeks,
      setViolationWeeks,
      bookingTrend: bookingTrendQuery.data?.data ?? [],
      roomStats: roomStatsQuery.data?.data ?? [],
      violationTrend: violationTrendQuery.data?.data ?? [],
      isLoading,
      hasAnyError,
    }),
    [
      trendDays,
      roomWeeks,
      violationWeeks,
      bookingTrendQuery.data,
      roomStatsQuery.data,
      violationTrendQuery.data,
      isLoading,
      hasAnyError,
    ],
  );

  return value;
}

