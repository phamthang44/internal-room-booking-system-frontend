import { useQuery } from "@tanstack/react-query";
import { useRoomFilterStore } from "./useRoomFilterStore";
import { roomsApi } from "../api/rooms.api";
import type { RoomFilters } from "../types/room.types";

export const useRooms = (page = 1) => {
  // Subscribe to filter store
  const filters: RoomFilters = useRoomFilterStore((s) => ({
    search: s.search,
    availability: "",
    minCapacity: s.minCapacity,
    maxCapacity: s.maxCapacity,
    equipment: [],
    building: "",
  }));

  return useQuery({
    queryKey: ["rooms", filters, page],
    queryFn: () => roomsApi.getRooms(filters, page),
    placeholderData: (prev) => prev, // keep previous data while re-fetching (avoids flash)
    staleTime: 1000 * 30,
  });
};

export const useBuildings = () =>
  useQuery({
    queryKey: ["rooms", "buildings"],
    queryFn: roomsApi.getBuildings,
    staleTime: 1000 * 60 * 10,
  });
