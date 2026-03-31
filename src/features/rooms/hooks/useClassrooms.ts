import { useQuery } from "@tanstack/react-query";
import { useRoomFilterStore } from "./useRoomFilterStore";
import { classroomApiService } from "../api/classroom.api.service";
import type { RoomSearchParams } from "../types/classroom.api.types";



const PAGE_SIZE = 12;

export const classroomQueryKeys = {
  all: ["classrooms"] as const,
  list: (params: RoomSearchParams) => ["classrooms", "list", params] as const,
};

/**
 * Fetches a paginated, filtered list of classrooms from GET /api/v1/rooms.
 * Reads all filter state from Zustand — components only need to pass `page`.
 */
export const useClassrooms = (page = 1) => {
  const {
    search,
    bookingDate,
    timeSlotId,
    minCapacity,
    equipmentId,
    sort,
  } = useRoomFilterStore();

  const params: RoomSearchParams = {
    ...(search && { keyword: search }),
    ...(bookingDate && { bookingDate }),
    ...(timeSlotId > 0 && { timeSlotId }),
    ...(minCapacity !== "" && { capacity: Number(minCapacity) }),
    ...(equipmentId > 0 && { equipmentId }),
    ...(sort && { sort }),
    page,
    size: PAGE_SIZE,
  };

  return useQuery({
    queryKey: classroomQueryKeys.list(params),
    queryFn: () => classroomApiService.searchRooms(params),
    placeholderData: (prev) => prev,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry: 2,
  });
};
