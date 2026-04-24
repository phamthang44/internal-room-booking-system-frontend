import { apiClient } from "@core/api";
import { ADMIN_BOOKINGS_ENDPOINTS } from "../constants/adminBookings.endpoints";
import type {
  AdminBookingDetailResponse,
  AdminBookingItemResponse,
  AdminBookingSearchParams,
  ApiResult,
  BookingApprovalRequest,
} from "../types/adminBookings.api.types";

const assertApiSuccess = (body: unknown): void => {
  if (!body || typeof body !== "object" || !("success" in body)) return;
  const r = body as { success?: boolean; message?: string; errorCode?: string };
  if (r.success === false) {
    throw {
      message: r.message ?? "Request failed",
      response: { data: body },
    };
  }
};

const extractMessage = (body: unknown): string | null => {
  if (!body || typeof body !== "object") return null;
  const b = body as {
    message?: unknown;
    meta?: { message?: unknown };
  };
  if (typeof b.meta?.message === "string" && b.meta.message.trim()) {
    return b.meta.message;
  }
  if (typeof b.message === "string" && b.message.trim()) {
    return b.message;
  }
  return null;
};

const cleanQuery = (params: AdminBookingSearchParams): Record<string, string | number> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  ) as Record<string, string | number>;

export interface AdminBookingSearchResult {
  rows: AdminBookingItemResponse[];
  meta?: ApiResult<unknown>["meta"];
}

export const adminBookingsApiService = {
  getDetail: async (bookingId: number): Promise<AdminBookingDetailResponse> => {
    const res = await apiClient.get<ApiResult<AdminBookingDetailResponse>>(
      ADMIN_BOOKINGS_ENDPOINTS.DETAIL(bookingId),
    );
    assertApiSuccess(res.data);
    return res.data.data;
  },

  approve: async (bookingId: number, payload: BookingApprovalRequest): Promise<string | null> => {
    const res = await apiClient.patch<ApiResult<unknown>>(
      ADMIN_BOOKINGS_ENDPOINTS.APPROVE(bookingId),
      payload,
    );
    assertApiSuccess(res.data);
    return extractMessage(res.data);
  },

  reject: async (bookingId: number, payload: BookingApprovalRequest): Promise<string | null> => {
    const res = await apiClient.patch<ApiResult<unknown>>(
      ADMIN_BOOKINGS_ENDPOINTS.REJECT(bookingId),
      payload,
    );
    assertApiSuccess(res.data);
    return extractMessage(res.data);
  },

  search: async (
    params: AdminBookingSearchParams = {},
  ): Promise<AdminBookingSearchResult> => {
    const res = await apiClient.get<ApiResult<AdminBookingItemResponse[]>>(
      ADMIN_BOOKINGS_ENDPOINTS.BASE,
      { params: cleanQuery(params) },
    );
    assertApiSuccess(res.data);
    return {
      rows: res.data.data ?? [],
      meta: res.data.meta,
    };
  },
};

