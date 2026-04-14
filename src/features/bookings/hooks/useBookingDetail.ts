import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { BookingDetail } from "@/data/mockData";
import { bookingsApiService } from "../api/bookings.api.service";

export interface UseBookingDetailResult {
  readonly data: BookingDetail | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => Promise<void>;
}

export function useBookingDetail(bookingId: string): UseBookingDetailResult {
  const query = useQuery({
    queryKey: ["bookings", "detail", bookingId],
    queryFn: () => bookingsApiService.getBookingDetail(bookingId),
    enabled: Boolean(bookingId),
    staleTime: 1000 * 30,
  });

  const data = query.data ?? null;
  const isLoading = query.isLoading;
  const isError = query.isError;

  const refetch = useCallback(async () => {
    await query.refetch();
  }, [query]);

  return { data, isLoading, isError, refetch };
}

