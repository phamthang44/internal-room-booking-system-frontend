import type { Room, RoomAvailability, RoomFilters, RoomsResponse } from "../types/room.types";

// ─── Mock Data ──────────────────────────────────────────────────────────────

// Deterministic gradient derived from room ID for visual variety
const GRADIENTS = [
  "linear-gradient(135deg, #1a365d 0%, #2d5a8e 100%)",
  "linear-gradient(135deg, #002712 0%, #003f21 100%)",
  "linear-gradient(135deg, #2d3133 0%, #43474e 100%)",
  "linear-gradient(135deg, #1a365d 0%, #003f21 60%, #002712 100%)",
  "linear-gradient(135deg, #002045 0%, #455f88 100%)",
  "linear-gradient(135deg, #555f70 0%, #1a365d 100%)",
];

const getGradient = (id: string) =>
  GRADIENTS[id.charCodeAt(id.length - 1) % GRADIENTS.length];

const MOCK_ROOMS_BASE: Omit<Room, "imageGradient">[] = [
  {
    id: "rm-101",
    code: "A-102",
    name: "Lecture Theatre Alpha",
    building: "Academic Block A",
    floor: "Level 1",
    capacity: 120,
    availability: "available" satisfies RoomAvailability,
    equipment: ["projector", "audio_system", "air_conditioning"],
  },
  {
    id: "rm-205",
    code: "S-205",
    name: "Design Studio",
    building: "Arts & Media Block",
    floor: "Level 2",
    capacity: 30,
    availability: "available" satisfies RoomAvailability,
    equipment: ["whiteboard", "smart_board", "air_conditioning"],
  },
  {
    id: "rm-M01",
    code: "M-01",
    name: "Council Boardroom",
    building: "Main Admin Building",
    floor: "Ground Floor",
    capacity: 20,
    availability: "occupied" satisfies RoomAvailability,
    equipment: ["projector", "video_conference", "audio_system"],
  },
  {
    id: "rm-L3",
    code: "LAB-3",
    name: "Biology Wet Lab",
    building: "Science Block",
    floor: "Level 3",
    capacity: 40,
    availability: "maintenance" satisfies RoomAvailability,
    equipment: ["whiteboard"],
  },
  {
    id: "rm-402",
    code: "AM-402",
    name: "Digital Fabrication Lab",
    building: "Arts & Media Block",
    floor: "Level 4",
    capacity: 24,
    availability: "available" satisfies RoomAvailability,
    equipment: ["computer_lab", "smart_board", "air_conditioning"],
  },
  {
    id: "rm-B15",
    code: "LIB-G1",
    name: "Collaborative Pod C",
    building: "Main Library",
    floor: "Ground Floor",
    capacity: 8,
    availability: "available" satisfies RoomAvailability,
    equipment: ["whiteboard", "video_conference"],
  },
  {
    id: "rm-SB1",
    code: "SB-101",
    name: "Seminar Room Alpha",
    building: "Science Block",
    floor: "Level 1",
    capacity: 35,
    availability: "available" satisfies RoomAvailability,
    equipment: ["projector", "whiteboard", "air_conditioning"],
  },
  {
    id: "rm-CL2",
    code: "CL-202",
    name: "Computer Lab 2",
    building: "Technology Block",
    floor: "Level 2",
    capacity: 50,
    availability: "available" satisfies RoomAvailability,
    equipment: ["computer_lab", "projector", "air_conditioning"],
  },
];

const MOCK_ROOMS: Room[] = MOCK_ROOMS_BASE.map((r) => ({ ...r, imageGradient: getGradient(r.id) }));

// ─── API Functions ───────────────────────────────────────────────────────────

const USE_MOCK = false;
const BASE = "/api/v1";

const applyFilters = (rooms: Room[], filters: Partial<RoomFilters>): Room[] => {
  return rooms.filter((room) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !room.name.toLowerCase().includes(q) &&
        !room.code.toLowerCase().includes(q) &&
        !room.building.toLowerCase().includes(q)
      )
        return false;
    }
    if (filters.availability && room.availability !== filters.availability)
      return false;
    if (filters.minCapacity && room.capacity < filters.minCapacity) return false;
    if (filters.maxCapacity && room.capacity > filters.maxCapacity) return false;
    if (filters.equipment?.length) {
      if (!filters.equipment.every((eq) => room.equipment.includes(eq)))
        return false;
    }
    if (filters.building && filters.building !== room.building) return false;
    return true;
  });
};

export const roomsApi = {
  getRooms: async (
    filters: Partial<RoomFilters> = {},
    page = 1,
    limit = 12
  ): Promise<RoomsResponse> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400)); // simulate latency
      const filtered = applyFilters(MOCK_ROOMS, filters);
      const start = (page - 1) * limit;
      return {
        rooms: filtered.slice(start, start + limit),
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      };
    }

    const params = new URLSearchParams({
      ...(filters.search && { search: filters.search }),
      ...(filters.availability && { availability: filters.availability }),
      ...(filters.minCapacity && { minCapacity: String(filters.minCapacity) }),
      ...(filters.maxCapacity && { maxCapacity: String(filters.maxCapacity) }),
      ...(filters.building && { building: filters.building }),
      page: String(page),
      limit: String(limit),
    });
    filters.equipment?.forEach((eq) => params.append("equipment", eq));
    const res = await fetch(`${BASE}/classrooms?${params}`);
    return res.json();
  },

  getBuildings: async (): Promise<string[]> => {
    if (USE_MOCK) {
      return Promise.resolve([
        ...new Set(MOCK_ROOMS.map((r) => r.building)),
      ].sort());
    }
    const res = await fetch(`${BASE}/classrooms/buildings`);
    return res.json();
  },
};
