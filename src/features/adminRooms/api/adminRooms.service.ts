import type { AdminRoomsService } from "./adminRooms.service.types";
import { adminRoomsApiService } from "./adminRooms.api.service";

export function useAdminRoomsService(): AdminRoomsService {
  return adminRoomsApiService;
}

