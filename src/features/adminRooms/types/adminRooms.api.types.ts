export interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: string;
}

export interface BasicRoomTypeResponse {
  id: number;
  name: string;
}

export type AdminRoomStatus =
  | "AVAILABLE"
  | "INACTIVE"
  | "MAINTENANCE"
  | "DELETED";

export type AdminRoomSlotStatus = "AVAILABLE" | "PENDING";

export interface AdminDetailClassroomResponse {
  /** Present when the backend includes it; required for update payloads. */
  classroomId?: number;
  /** Room lifecycle status (aligns with PATCH /status). */
  status?: AdminRoomStatus;
  /** Gallery images for edit/audit UI when returned by GET detail. */
  imageUrls?: string[];
  roomName: string;
  capacity: number;
  building: BasicRoomTypeResponse & { address?: string };
  addressBuildingLocation: string;
  roomType: BasicRoomTypeResponse;
  equipments: Array<{
    id: number;
    name: string;
  }>;
  availableDates?: string[];
  month?: string;
  timeSlots?: Array<{
    id: number;
    startTime: string;
    endTime: string;
    slotName: string;
  }>;
  schedule?: {
    date: string;
    isFull: boolean;
    availabilities: Array<{
      date: string;
      slots: Array<{
        slotId: number;
        slotName: string;
        startTime: string;
        endTime: string;
        status: AdminRoomSlotStatus;
        isAvailable: boolean;
        currentBookingId?: number;
      }>;
    }>;
  };
  auditResponse: {
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
  };
}

export interface CreateClassroomRequest {
  roomName: string;
  buildingId: number;
  capacity: number;
  roomTypeId: number;
  equipments: Array<{
    id: number;
    quantity: number;
  }>;
  imageUrls: string[];
  isActive: boolean;
}

export interface UpdateClassroomRequest extends CreateClassroomRequest {
  classroomId: number;
}

export interface UpdateClassroomStatusRequest {
  classroomId: number;
  status: AdminRoomStatus;
}

