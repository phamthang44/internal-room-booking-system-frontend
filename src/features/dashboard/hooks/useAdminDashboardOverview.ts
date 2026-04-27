import { useQuery } from "@tanstack/react-query";
import { fetchAdminDashboardOverview } from "../api/admin-dashboard.api";

export function useAdminDashboardOverview() {
  return useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: fetchAdminDashboardOverview,
    meta: { showGlobalError: true },
  });
}

