import { apiClient } from "@core/api";
import type {
  AdminBookingDetailResponse,
  AdminBookingItemResponse,
  AdminBookingSearchParams,
  ApiResult,
  BookingApprovalRequest,
} from "../types/adminBookings.api.types";

// NOTE: VITE_API_URL is configured as ".../api/v1" (no trailing slash).
// Axios concatenates baseURL + url; this must start with "/" to avoid ".../api/v1admin/...".
const BASE = "/admin/bookings";

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
      `${BASE}/${bookingId}`,
    );
    assertApiSuccess(res.data);
    return res.data.data;
  },

  approve: async (payload: BookingApprovalRequest): Promise<string | null> => {
    const res = await apiClient.patch<ApiResult<unknown>>(
      `${BASE}/approve`,
      payload,
    );
    assertApiSuccess(res.data);
    return extractMessage(res.data);
  },

  reject: async (payload: BookingApprovalRequest): Promise<string | null> => {
    const res = await apiClient.patch<ApiResult<unknown>>(
      `${BASE}/reject`,
      payload,
    );
    assertApiSuccess(res.data);
    return extractMessage(res.data);
  },

  search: async (
    params: AdminBookingSearchParams = {},
  ): Promise<AdminBookingSearchResult> => {
    const res = await apiClient.get<ApiResult<AdminBookingItemResponse[]>>(
      `${BASE}`,
      { params: cleanQuery(params) },
    );
    assertApiSuccess(res.data);
    return {
      rows: res.data.data ?? [],
      meta: res.data.meta,
    };
  },
};

