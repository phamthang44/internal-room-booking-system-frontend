import { useCallback, useMemo, useState } from "react";
import { myBookingsMockData, type BookingActivityItem } from "@/data/mockData";

export type MyBookingsFilter = "all" | "pending" | "completed";
export type MyBookingsDataSource = "mock" | "api";

export interface UseMyBookingsResult {
  readonly data: typeof myBookingsMockData | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly source: MyBookingsDataSource;
  readonly setSource: (source: MyBookingsDataSource) => void;
  readonly filteredRecentActivityItems: readonly BookingActivityItem[];
  readonly refetch: () => Promise<void>;
}

function matchesFilter(item: BookingActivityItem, filter: MyBookingsFilter) {
  if (filter === "all") return true;
  if (filter === "pending") return item.status === "pending";
  // In the HTML, "Completed" is effectively “non-pending” historical outcomes.
  if (filter === "completed") return item.status !== "pending";
  return true;
}

export function useMyBookings(filter: MyBookingsFilter): UseMyBookingsResult {
  const [source, setSource] = useState<MyBookingsDataSource>("mock");

  const data = source === "mock" ? myBookingsMockData : myBookingsMockData;

  const isLoading = false;
  const isError = false;

  const filteredRecentActivityItems = useMemo(() => {
    return data?.recentActivity.items.filter((i) => matchesFilter(i, filter)) ?? [];
  }, [data, filter]);

  const refetch = useCallback(async () => {
    // Mock-first: no-op. When switching to API, this will be backed by react-query.
  }, []);

  return {
    data,
    isLoading,
    isError,
    source,
    setSource,
    filteredRecentActivityItems,
    refetch,
  };
}

