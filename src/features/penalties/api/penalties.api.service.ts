import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { PENALTIES_ENDPOINTS } from "../constants/penalties.endpoints";
import type {
  AdminUserPenaltiesResponse,
  ApiResult,
  PenaltyExtendRequest,
  PenaltyRecordResponse,
  PenaltyRevokeRequest,
  ViolationResponse,
} from "../types/penalties.api.types";

const unwrap = <T,>(body: unknown): { data: T | null; message?: string | null; meta?: unknown } => {
  if (!body || typeof body !== "object") return { data: null };
  const b = body as Record<string, unknown>;

  // admin-style: { success, message, data, meta }
  if ("success" in b) {
    const success = Boolean(b.success);
    const msg = typeof b.message === "string" ? b.message : null;
    const data = (b.data as T | undefined) ?? null;
    if (success === false) {
      // Some backend endpoints may respond 200 with {success:false}. Re-throw as axios-like error
      // so shared error tooling can extract message/traceId consistently.
      throw {
        isAxiosError: true,
        message: msg ?? "Request failed",
        response: { status: 400, data: body },
      };
    }
    return { data, message: msg, meta: b.meta };
  }

  // non-admin style: { data, meta, error }
  if ("data" in b) {
    return { data: (b.data as T | undefined) ?? null, meta: b.meta };
  }

  return { data: null };
};

export const penaltiesApiService = {
  getMyPenalties: async (): Promise<PenaltyRecordResponse[]> => {
    const { token } = useAuthStore.getState();
    const res = await apiClient.get<ApiResult<unknown>>(PENALTIES_ENDPOINTS.ME_PENALTIES, {
      ...getAuthConfig(token ?? null),
    });
    const unwrapped = unwrap<unknown>(res.data);
    const d = unwrapped.data;

    if (Array.isArray(d)) return d as PenaltyRecordResponse[];
    if (d && typeof d === "object" && "penalties" in (d as Record<string, unknown>)) {
      const p = (d as { penalties?: unknown }).penalties;
      return Array.isArray(p) ? (p as PenaltyRecordResponse[]) : [];
    }
    if (d && typeof d === "object" && "data" in (d as Record<string, unknown>)) {
      const inner = (d as { data?: unknown }).data;
      return Array.isArray(inner) ? (inner as PenaltyRecordResponse[]) : [];
    }
    return [];
  },

  getMyViolations: async (): Promise<ViolationResponse[]> => {
    const { token } = useAuthStore.getState();
    const res = await apiClient.get<ApiResult<unknown>>(PENALTIES_ENDPOINTS.ME_VIOLATIONS, {
      ...getAuthConfig(token ?? null),
    });
    const unwrapped = unwrap<unknown>(res.data);
    const d = unwrapped.data;

    if (Array.isArray(d)) return d as ViolationResponse[];
    if (d && typeof d === "object" && "violations" in (d as Record<string, unknown>)) {
      const v = (d as { violations?: unknown }).violations;
      return Array.isArray(v) ? (v as ViolationResponse[]) : [];
    }
    if (d && typeof d === "object" && "data" in (d as Record<string, unknown>)) {
      const inner = (d as { data?: unknown }).data;
      return Array.isArray(inner) ? (inner as ViolationResponse[]) : [];
    }
    return [];
  },

  getAdminUserPenalties: async (userId: number): Promise<AdminUserPenaltiesResponse> => {
    const res = await apiClient.get<ApiResult<AdminUserPenaltiesResponse>>(
      PENALTIES_ENDPOINTS.ADMIN_USER_PENALTIES(userId),
    );
    const unwrapped = unwrap<AdminUserPenaltiesResponse>(res.data);
    return (
      unwrapped.data ?? {
        activePenalty: null,
        penalties: [],
        violations: [],
      }
    );
  },

  revokePenalty: async (penaltyId: number, payload: PenaltyRevokeRequest): Promise<PenaltyRecordResponse | null> => {
    const res = await apiClient.post<ApiResult<PenaltyRecordResponse>>(
      PENALTIES_ENDPOINTS.ADMIN_REVOKE(penaltyId),
      payload,
    );
    const unwrapped = unwrap<PenaltyRecordResponse>(res.data);
    return unwrapped.data ?? null;
  },

  extendPenalty: async (penaltyId: number, payload: PenaltyExtendRequest): Promise<PenaltyRecordResponse | null> => {
    const res = await apiClient.post<ApiResult<PenaltyRecordResponse>>(
      PENALTIES_ENDPOINTS.ADMIN_EXTEND(penaltyId),
      payload,
    );
    const unwrapped = unwrap<PenaltyRecordResponse>(res.data);
    return unwrapped.data ?? null;
  },
};

