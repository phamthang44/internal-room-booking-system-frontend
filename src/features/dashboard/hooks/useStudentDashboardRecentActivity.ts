import { useQuery } from "@tanstack/react-query";
import { fetchStudentDashboard } from "../api/student-dashboard.api";

export const useStudentDashboardRecentActivity = () => {
  return useQuery({
    queryKey: ["student-dashboard-recent-activity"],
    queryFn: fetchStudentDashboard,
  });
};
