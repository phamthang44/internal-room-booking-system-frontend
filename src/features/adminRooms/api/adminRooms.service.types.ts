import type {
  AdminDetailClassroomResponse,
  CreateClassroomRequest,
  UpdateClassroomRequest,
  UpdateClassroomStatusRequest,
} from "../types/adminRooms.api.types";

export interface AdminRoomsService {
  getDetail: (id: number) => Promise<AdminDetailClassroomResponse>;
  /** Returns new classroom id when the API includes it in `data`. */
  create: (payload: CreateClassroomRequest) => Promise<number | undefined>;
  update: (payload: UpdateClassroomRequest) => Promise<void>;
  updateStatus: (payload: UpdateClassroomStatusRequest) => Promise<void>;
}

