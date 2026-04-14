import { useCallback, useMemo } from "react";
import { bookingDetailsById, type BookingDetail } from "@/data/mockData";

export interface UseBookingDetailResult {
  readonly data: BookingDetail | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly refetch: () => Promise<void>;
}

export function useBookingDetail(bookingId: string): UseBookingDetailResult {
  const data = useMemo(() => {
    if (!bookingId) return null;
    return bookingDetailsById[bookingId] ?? null;
  }, [bookingId]);

  const isLoading = false;
  const isError = Boolean(bookingId) && !data;

  const refetch = useCallback(async () => {
    // Mock-first: no-op. Later, wire react-query refetch here.
  }, []);

  return { data, isLoading, isError, refetch };
}

