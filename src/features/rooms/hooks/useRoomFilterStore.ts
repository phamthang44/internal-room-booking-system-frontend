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
  timeSlotId: number;       // 0 = all; maps to API `timeSlotId`
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
  setTimeSlotId: (id: number) => void;
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
  | "search" | "bookingDate" | "timeSlotId"
  | "minCapacity" | "maxCapacity" | "equipmentId" | "roomStatus" | "sort"
  | "viewMode"
> = {
  search: "",
  bookingDate: "",
  timeSlotId: 0,
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
  setTimeSlotId: (id) => set({ timeSlotId: get().timeSlotId === id ? 0 : id }),
  setCapacityRange: (minCapacity, maxCapacity) => set({ minCapacity, maxCapacity }),
  setEquipmentId: (id) => set({ equipmentId: get().equipmentId === id ? 0 : id }),
  setRoomStatus: (status) => set({ roomStatus: get().roomStatus === status ? "" : status }),
  setSort: (sort) => set({ sort }),
  setViewMode: (viewMode) => set({ viewMode }),

  clearAll: () => set(DEFAULT_FILTER),

  activeFilterCount: () => {
    const { bookingDate, timeSlotId, minCapacity, maxCapacity, equipmentId, roomStatus, sort } = get();
    let count = 0;
    if (bookingDate) count++;
    if (timeSlotId > 0) count++;
    if (minCapacity !== "" || maxCapacity !== "") count++;
    if (equipmentId > 0) count++;
    if (roomStatus !== "") count++;
    if (sort) count++;
    return count;
  },
}));
