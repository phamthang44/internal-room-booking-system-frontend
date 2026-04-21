import { apiClient } from "@core/api";
import { ADMIN_ROOMS_ENDPOINTS } from "../constants/adminRooms.endpoints";
import type {
  AdminDetailClassroomResponse,
  ApiResult,
  CreateClassroomRequest,
  UpdateClassroomRequest,
  UpdateClassroomStatusRequest,
} from "../types/adminRooms.api.types";
import type { AdminRoomsService } from "./adminRooms.service.types";

const assertApiSuccess = (body: unknown): void => {
  if (!body || typeof body !== "object" || !("success" in body)) return;
  const r = body as { success?: boolean; message?: string; errorCode?: string };
  if (r.success === false) {
    // Throw a shape compatible with our shared error extractors (response.data.message, response.data.errorCode)
    throw {
      message: r.message ?? "Request failed",
      response: { data: body },
    };
  }
};

const unwrapApiResult = <T,>(body: unknown): T => {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

const unwrapCreateResult = (body: unknown): number | undefined => {
  const data = unwrapApiResult<unknown>(body);
  if (
    data &&
    typeof data === "object" &&
    "classroomId" in data &&
    typeof (data as { classroomId: unknown }).classroomId === "number"
  ) {
    return (data as { classroomId: number }).classroomId;
  }
  return undefined;
};

export const adminRoomsApiService: AdminRoomsService = {
  getDetail: async (id: number) => {
    const res = await apiClient.get<ApiResult<AdminDetailClassroomResponse>>(
      ADMIN_ROOMS_ENDPOINTS.DETAIL(id),
    );
    assertApiSuccess(res.data);
    return unwrapApiResult<AdminDetailClassroomResponse>(res.data);
  },

  create: async (payload: CreateClassroomRequest) => {
    const res = await apiClient.post<ApiResult<unknown>>(ADMIN_ROOMS_ENDPOINTS.CREATE, payload);
    assertApiSuccess(res.data);
    return unwrapCreateResult(res.data);
  },

  update: async (payload: UpdateClassroomRequest) => {
    const res = await apiClient.put<ApiResult<unknown>>(ADMIN_ROOMS_ENDPOINTS.UPDATE, payload);
    assertApiSuccess(res.data);
  },

  updateStatus: async (payload: UpdateClassroomStatusRequest) => {
    const res = await apiClient.patch<ApiResult<unknown>>(
      ADMIN_ROOMS_ENDPOINTS.UPDATE_STATUS,
      payload,
    );
    assertApiSuccess(res.data);
  },
};

