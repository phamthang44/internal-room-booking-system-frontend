import type { StatusChipVariant } from "@shared/components/StatusChip";

export type RoomAvailability = Extract<
  StatusChipVariant,
  "available" | "occupied" | "maintenance"
>;

export type EquipmentItem =
  | "projector"
  | "whiteboard"
  | "video_conference"
  | "air_conditioning"
  | "computer_lab"
  | "smart_board"
  | "audio_system";

export const EQUIPMENT_LABELS: Record<EquipmentItem, string> = {
  projector: "Projector",
  whiteboard: "Whiteboard",
  video_conference: "Video Conference",
  air_conditioning: "Air Con",
  computer_lab: "Computer Lab",
  smart_board: "Smart Board",
  audio_system: "Audio System",
};

export interface Room {
  id: string;
  code: string; // e.g. "A-102"
  name: string; // e.g. "Lecture Theatre Alpha"
  building: string;
  floor: string;
  capacity: number;
  availability: RoomAvailability;
  equipment: EquipmentItem[];
  imageGradient?: string; // CSS gradient string (auto-generated)
}

export interface RoomFilters {
  search: string;
  availability: RoomAvailability | "";
  minCapacity: number | "";
  maxCapacity: number | "";
  equipment: EquipmentItem[];
  building: string;
}

export interface RoomsResponse {
  rooms: Room[];
  total: number;
  page: number;
  totalPages: number;
}
