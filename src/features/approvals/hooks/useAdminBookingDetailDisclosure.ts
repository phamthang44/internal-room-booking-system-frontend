import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminBookingsApiService } from "@features/adminBookings";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export const adminBookingDetailQueryKey = (bookingId: number) =>
  ["admin", "bookings", "detail", bookingId] as const;

export interface UseAdminBookingDetailDisclosureValue {
  hoveredId: number | null;
  setHoveredId: (id: number | null) => void;
  debouncedHoveredId: number | null;
  prefetching: boolean;
  previewQuery: ReturnType<typeof useQuery>;
}

export function useAdminBookingDetailDisclosure(debounceMs = 50) {
  const qc = useQueryClient();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const debouncedHoveredId = useDebouncedValue(hoveredId, debounceMs);

  const enabled = debouncedHoveredId != null && debouncedHoveredId > 0;

  // Prefetch immediately on hover to warm cache (non-blocking).
  useEffect(() => {
    if (hoveredId != null && hoveredId > 0) {
      const state = qc.getQueryState(adminBookingDetailQueryKey(hoveredId));
      // Skip prefetch when we already have fresh data in memory.
      if (state?.status === "success" && state.dataUpdatedAt && Date.now() - state.dataUpdatedAt < 1000 * 30) {
        return;
      }
      void qc.prefetchQuery({
        queryKey: adminBookingDetailQueryKey(hoveredId),
        queryFn: () => adminBookingsApiService.getDetail(hoveredId),
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 10,
      });
    }
  }, [hoveredId, qc]);

  const previewQuery = useQuery({
    queryKey: adminBookingDetailQueryKey(debouncedHoveredId ?? 0),
    queryFn: () => adminBookingsApiService.getDetail(debouncedHoveredId!),
    enabled,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
  });

  const prefetching = useMemo(() => previewQuery.isFetching, [previewQuery.isFetching]);

  return {
    hoveredId,
    setHoveredId,
    debouncedHoveredId,
    prefetching,
    previewQuery,
  };
}

