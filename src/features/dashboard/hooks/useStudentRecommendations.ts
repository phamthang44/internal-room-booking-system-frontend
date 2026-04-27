import { useQuery } from "@tanstack/react-query";
import { fetchStudentRecommendations } from "../api/student-dashboard.api";

export const useStudentRecommendations = (params?: {
  attendees?: number;
  date?: string; // YYYY-MM-DD
}) => {
  return useQuery({
    queryKey: ["student-recommendations", params?.attendees ?? null, params?.date ?? null],
    queryFn: () => fetchStudentRecommendations(params),
  });
};

