import apiClient from "@core/api/client";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { DASHBOARD_ENDPOINTS } from "../constants/dashboard.endpoints";
import type {
  AdminDashboardOverviewResponse,
  ApiResult,
  DailyBookingTrendResponse,
  RoomUtilizationResponse,
  ViolationTrendResponse,
} from "../types/adminDashboard.types";

export type AdminDashboardOverviewResult =
  ApiResult<AdminDashboardOverviewResponse>;

export type AdminBookingTrendResult = ApiResult<DailyBookingTrendResponse[]>;
export type AdminRoomStatsResult = ApiResult<RoomUtilizationResponse[]>;
export type AdminViolationTrendResult = ApiResult<ViolationTrendResponse[]>;

export async function fetchAdminDashboardOverview(): Promise<AdminDashboardOverviewResult> {
  const { token } = useAuthStore.getState();
  const response = await apiClient.get<AdminDashboardOverviewResult>(
    DASHBOARD_ENDPOINTS.ADMIN_OVERVIEW,
    getAuthConfig(token),
  );
  return response.data;
}

export async function fetchAdminBookingTrend(params?: {
  days?: number;
}): Promise<AdminBookingTrendResult> {
  const { token } = useAuthStore.getState();
  const response = await apiClient.get<AdminBookingTrendResult>(
    DASHBOARD_ENDPOINTS.ADMIN_BOOKING_TREND,
    {
      ...getAuthConfig(token),
      params: { days: params?.days },
    },
  );
  return response.data;
}

export async function fetchAdminRoomStats(params?: {
  weeks?: number;
}): Promise<AdminRoomStatsResult> {
  const { token } = useAuthStore.getState();
  const response = await apiClient.get<AdminRoomStatsResult>(
    DASHBOARD_ENDPOINTS.ADMIN_ROOM_STATS,
    {
      ...getAuthConfig(token),
      params: { weeks: params?.weeks },
    },
  );
  return response.data;
}

export async function fetchAdminViolationTrend(params?: {
  weeks?: number;
}): Promise<AdminViolationTrendResult> {
  const { token } = useAuthStore.getState();
  const response = await apiClient.get<AdminViolationTrendResult>(
    DASHBOARD_ENDPOINTS.ADMIN_VIOLATION_TREND,
    {
      ...getAuthConfig(token),
      params: { weeks: params?.weeks },
    },
  );
  return response.data;
}

