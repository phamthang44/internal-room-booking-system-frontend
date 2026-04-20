import { apiClient } from "@core/api";
import type {
  AdminUserRoleApi,
  ApiResult,
  Page,
  RegisterRequest,
  UserBasicResponse,
} from "../types/adminUsers.api.types";

// NOTE: VITE_API_URL is configured as ".../api/v1" (no trailing slash).
// Axios concatenates baseURL + url; this must start with "/" to avoid ".../api/v1admin/...".
const BASE = "/admin/users";

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

const unwrapApiResult = <T,>(body: unknown): T => {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

const normalizePage = <T,>(raw: unknown): Page<T> => {
  const data = unwrapApiResult<unknown>(raw);
  if (data && typeof data === "object") return data as Page<T>;
  // If backend returns list directly, adapt to Page-like.
  if (Array.isArray(data)) return { content: data as T[] };
  return {};
};

export interface AdminUsersListParams {
  /** 0-indexed */
  page?: number;
  size?: number;
  sort?: string;
}

export interface AdminUsersListResult {
  rows: UserBasicResponse[];
  page: number; // 0-indexed
  size: number;
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
}

export const adminUsersApiService = {
  list: async (
    params: AdminUsersListParams = {},
  ): Promise<AdminUsersListResult> => {
    const res = await apiClient.get<ApiResult<Page<UserBasicResponse>>>(
      `${BASE}/`,
      { params },
    );
    assertApiSuccess(res.data);

    const page = normalizePage<UserBasicResponse>(res.data);
    const rows = page.content ?? [];

    const apiPage = page.number ?? res.data.meta?.page ?? params.page ?? 0;
    const size = page.size ?? res.data.meta?.size ?? params.size ?? rows.length;
    const totalPages =
      page.totalPages ?? res.data.meta?.totalPages ?? Math.max(1, apiPage + 1);
    const totalElements =
      page.totalElements ?? res.data.meta?.totalElements ?? rows.length;
    const hasNextPage =
      res.data.meta?.hasNextPage ?? (apiPage + 1 < totalPages);

    return {
      rows,
      page: apiPage,
      size,
      totalElements,
      totalPages,
      hasNextPage,
    };
  },

  create: async (payload: RegisterRequest): Promise<UserBasicResponse> => {
    const res = await apiClient.post<ApiResult<UserBasicResponse>>(
      `${BASE}/`,
      payload,
    );
    assertApiSuccess(res.data);
    return unwrapApiResult<UserBasicResponse>(res.data);
  },

  toggleBan: async (userId: number): Promise<string | null> => {
    const res = await apiClient.put<ApiResult<unknown>>(`${BASE}/${userId}/ban`);
    assertApiSuccess(res.data);
    return res.data.meta?.message ?? res.data.message ?? null;
  },

  updateRole: async (
    userId: number,
    roleName: AdminUserRoleApi,
  ): Promise<UserBasicResponse> => {
    const res = await apiClient.put<ApiResult<UserBasicResponse>>(
      `${BASE}/${userId}/role`,
      null,
      { params: { roleName } },
    );
    assertApiSuccess(res.data);
    return unwrapApiResult<UserBasicResponse>(res.data);
  },
};

