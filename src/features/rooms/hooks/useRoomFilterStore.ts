import { create } from "zustand";
import type { RoomSortApi, RoomStatusApi } from "../types/classroom.api.types";

// ─────────────────────────────────────────────────────────────────────────────
// Fixed time slots — these match the database fixtures exactly
// ─────────────────────────────────────────────────────────────────────────────
export const TIME_SLOTS = [
  { id: 1, label: "07:00 – 09:00", start: "07:00", end: "09:00" },
  { id: 2, label: "09:30 – 11:30", start: "09:30", end: "11:30" },
  { id: 3, label: "13:00 – 15:00", start: "13:00", end: "15:00" },
  { id: 4, label: "15:30 – 17:30", start: "15:30", end: "17:30" },
] as const;

export type ViewMode = "grid" | "list";

export interface RoomFilterState {
  // ── Filter values ──────────────────────────────────────────────────────────
  search: string;
  bookingDate: string;      // yyyy-MM-dd; "" = no filter
  timeSlotIds: number[];    // [] = all; maps to API `timeSlotIds[]`
  minCapacity: number | "";
  maxCapacity: number | ""; // UI-only; API has no maxCapacity param
  equipmentId: number;      // 0 = all; API accepts single int32
  roomStatus: RoomStatusApi | ""; // API allows filtering by mapped status
  sort: RoomSortApi | "";

  // ── UI state ───────────────────────────────────────────────────────────────
  viewMode: ViewMode;

  // ── Actions ────────────────────────────────────────────────────────────────
  setSearch: (search: string) => void;
  setBookingDate: (date: string) => void;
  toggleTimeSlotId: (id: number) => void;
  clearTimeSlots: () => void;
  setCapacityRange: (min: number | "", max: number | "") => void;
  setEquipmentId: (id: number) => void;
  setRoomStatus: (status: RoomStatusApi | "") => void;
  setSort: (sort: RoomSortApi | "") => void;
  setViewMode: (mode: ViewMode) => void;
  clearAll: () => void;
  activeFilterCount: () => number;
}

const DEFAULT_FILTER: Pick<
  RoomFilterState,
  | "search" | "bookingDate" | "timeSlotIds"
  | "minCapacity" | "maxCapacity" | "equipmentId" | "roomStatus" | "sort"
  | "viewMode"
> = {
  search: "",
  bookingDate: "",
  timeSlotIds: [],
  minCapacity: "",
  maxCapacity: "",
  equipmentId: 0,
  roomStatus: "",
  sort: "",
  viewMode: "grid",
};

export const useRoomFilterStore = create<RoomFilterState>((set, get) => ({
  ...DEFAULT_FILTER,

  setSearch: (search) => set({ search }),
  setBookingDate: (bookingDate) => set({ bookingDate }),
  toggleTimeSlotId: (id) =>
    set(() => {
      if (id === 0) return { timeSlotIds: [] };
      const curr = get().timeSlotIds;
      return curr.includes(id)
        ? { timeSlotIds: curr.filter((x) => x !== id) }
        : { timeSlotIds: [...curr, id].sort((a, b) => a - b) };
    }),
  clearTimeSlots: () => set({ timeSlotIds: [] }),
  setCapacityRange: (minCapacity, maxCapacity) => set({ minCapacity, maxCapacity }),
  setEquipmentId: (id) => set({ equipmentId: get().equipmentId === id ? 0 : id }),
  setRoomStatus: (status) => set({ roomStatus: get().roomStatus === status ? "" : status }),
  setSort: (sort) => set({ sort }),
  setViewMode: (viewMode) => set({ viewMode }),

  clearAll: () => set(DEFAULT_FILTER),

  activeFilterCount: () => {
    const { bookingDate, timeSlotIds, minCapacity, maxCapacity, equipmentId, roomStatus, sort } = get();
    let count = 0;
    if (bookingDate) count++;
    if (timeSlotIds.length > 0) count++;
    if (minCapacity !== "" || maxCapacity !== "") count++;
    if (equipmentId > 0) count++;
    if (roomStatus !== "") count++;
    if (sort) count++;
    return count;
  },
}));
