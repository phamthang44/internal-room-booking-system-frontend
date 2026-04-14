import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { myBookingsMockData, type BookingActivityItem } from "@/data/mockData";
import { bookingsApiService } from "../api/bookings.api.service";

export type MyBookingsFilter = "all" | "pending" | "completed";
export type MyBookingsDataSource = "mock" | "api";

export interface MyBookingsData {
  readonly summary: {
    readonly reservedSlots: number;
  };
  readonly recentActivity: {
    readonly items: readonly BookingActivityItem[];
  };
  readonly history: {
    readonly items: readonly {
      readonly id: string;
      readonly roomLabel: string;
      readonly dateTimeLabel: string;
      readonly status: "cancelled" | "completed" | "rejected";
    }[];
  };
}

export interface UseMyBookingsResult {
  readonly data: MyBookingsData | null;
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
  const [source, setSource] = useState<MyBookingsDataSource>("api");

  const apiQuery = useQuery({
    queryKey: ["bookings", "my", { page: 1, size: 100, sort: "newest" }],
    queryFn: () =>
      bookingsApiService.searchMyBookings({
        page: 1,
        size: 100,
        sort: "newest",
      }),
    enabled: source === "api",
    staleTime: 1000 * 30,
  });

  const mockData: MyBookingsData = useMemo(() => {
    return {
      summary: { reservedSlots: myBookingsMockData.summary.reservedSlots },
      recentActivity: { items: myBookingsMockData.recentActivity.items },
      history: { items: myBookingsMockData.history.items },
    };
  }, []);

  const data: MyBookingsData | null =
    source === "api" ? (apiQuery.data ?? null) : mockData;

  const isLoading = source === "api" ? apiQuery.isLoading : false;
  const isError = source === "api" ? apiQuery.isError : false;

  const filteredRecentActivityItems = useMemo(() => {
    return data?.recentActivity.items.filter((i) => matchesFilter(i, filter)) ?? [];
  }, [data, filter]);

  const refetch = useCallback(async () => {
    if (source === "api") {
      await apiQuery.refetch();
    }
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

