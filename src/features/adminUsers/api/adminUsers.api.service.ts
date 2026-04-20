import { apiClient } from "@core/api";
import type {
  AdminUserRoleApi,
  ApiEnvelope,
  ApiResult,
  Page,
  RegisterRequest,
  UserBasicResponse,
} from "../types/adminUsers.api.types";

// NOTE: VITE_API_URL is configured as ".../api/v1" (no trailing slash).
// Axios concatenates baseURL + url; this must start with "/" to avoid ".../api/v1admin/...".
const BASE = "/admin/users";

type ListResponse =
  | ApiEnvelope<UserBasicResponse[]>
  | ApiResult<Page<UserBasicResponse>>;

const isApiResult = <T,>(body: unknown): body is ApiResult<T> => {
  if (!body || typeof body !== "object") return false;
  return "success" in body;
};

const isApiEnvelope = <T,>(body: unknown): body is ApiEnvelope<T> => {
  if (!body || typeof body !== "object") return false;
  if (!("data" in body)) return false;
  // Ensure we don't treat ApiResult as ApiEnvelope
  return !("success" in body);
};

const assertApiSuccess = (body: unknown): void => {
  if (!isApiResult<unknown>(body)) return;
  if (body.success === false) {
    throw {
      message: body.message ?? "Request failed",
      response: { data: body },
    };
  }
};

const unwrapApiResult = <T,>(body: unknown): T => {
  if (isApiEnvelope<T>(body)) return body.data;
  if (isApiResult<T>(body)) return body.data;
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data; // fallback
  }
  return body as T; // fallback
};

const normalizePage = <T,>(raw: unknown): Page<T> => {
  // New list shape: { data: T[]; meta?: ... }
  if (isApiEnvelope<T[]>(raw)) {
    return { content: raw.data };
  }

  const data = unwrapApiResult<unknown>(raw);
  // If backend returns list directly, adapt to Page-like.
  if (Array.isArray(data)) return { content: data as T[] };
  // If backend returns a page object, keep it.
  if (data && typeof data === "object") return data as Page<T>;
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
    const res = await apiClient.get<ListResponse>(
      `${BASE}`,
      { params },
    );
    assertApiSuccess(res.data);

    const page = normalizePage<UserBasicResponse>(res.data);
    const rows = page.content ?? [];

    const meta =
      isApiResult<unknown>(res.data) || isApiEnvelope<unknown>(res.data)
        ? res.data.meta
        : undefined;

    const apiPage = page.number ?? meta?.page ?? params.page ?? 0;
    const size = page.size ?? meta?.size ?? params.size ?? rows.length;
    const totalPages =
      page.totalPages ?? meta?.totalPages ?? Math.max(1, apiPage + 1);
    const totalElements =
      page.totalElements ?? meta?.totalElements ?? rows.length;
    const hasNextPage =
      meta?.hasNextPage ?? (apiPage + 1 < totalPages);

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
      `${BASE}`,
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

