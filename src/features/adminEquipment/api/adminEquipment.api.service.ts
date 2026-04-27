import { apiClient } from "@core/api";
import { ADMIN_EQUIPMENT_ENDPOINTS } from "../constants/adminEquipment.endpoints";
import type {
  ApiResult,
  EquipmentDetail,
  EquipmentListItem,
  EquipmentRequest,
  Page,
} from "../types/adminEquipment.api.types";

export interface AdminEquipmentListParams {
  /** Filter by nameKey */
  keyword?: string;
  /** 0-indexed */
  page?: number;
  size?: number;
  /** e.g. "nameKey,asc" */
  sort?: string;
}

export interface AdminEquipmentListResult {
  rows: EquipmentListItem[];
  page: number; // 0-indexed
  size: number;
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
  metaMessage: string | null;
}

type ListResponse = ApiResult<EquipmentListItem[] | Page<EquipmentListItem>>;
type DetailResponse = ApiResult<EquipmentDetail>;
type MutResponse = ApiResult<unknown>;

const unwrapApiResult = <T,>(body: unknown): T => {
  if (body && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

const readMeta = (
  body: unknown,
): ApiResult<unknown>["meta"] | undefined => {
  if (!body || typeof body !== "object") return undefined;
  if (!("meta" in body)) return undefined;
  return (body as { meta?: ApiResult<unknown>["meta"] }).meta;
};

const readMetaMessage = (body: unknown): string | null => {
  return readMeta(body)?.message ?? null;
};

const normalizePage = <T,>(raw: unknown): Page<T> => {
  const data = unwrapApiResult<unknown>(raw);
  if (Array.isArray(data)) return { content: data as T[] };
  if (data && typeof data === "object") return data as Page<T>;
  return {};
};

export const adminEquipmentApiService = {
  detail: async (id: number): Promise<EquipmentDetail> => {
    const res = await apiClient.get<DetailResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.DETAIL(id),
    );
    return unwrapApiResult<EquipmentDetail>(res.data);
  },

  list: async (
    params: AdminEquipmentListParams = {},
  ): Promise<AdminEquipmentListResult> => {
    const res = await apiClient.get<ListResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.BASE,
      { params },
    );

    const page = normalizePage<EquipmentListItem>(res.data);
    const rows = page.content ?? [];
    const meta = readMeta(res.data);

    const apiPage = page.number ?? meta?.page ?? params.page ?? 0;
    const size = page.size ?? meta?.size ?? params.size ?? rows.length;
    const totalPages =
      page.totalPages ?? meta?.totalPages ?? Math.max(1, apiPage + 1);
    const totalElements =
      page.totalElements ?? meta?.totalElements ?? rows.length;
    const hasNextPage = apiPage + 1 < totalPages;

    return {
      rows,
      page: apiPage,
      size,
      totalElements,
      totalPages,
      hasNextPage,
      metaMessage: meta?.message ?? null,
    };
  },

  create: async (payload: EquipmentRequest): Promise<string | null> => {
    const res = await apiClient.post<MutResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.BASE,
      payload,
    );
    return readMetaMessage(res.data);
  },

  update: async (
    id: number,
    payload: EquipmentRequest,
  ): Promise<string | null> => {
    const res = await apiClient.put<MutResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.DETAIL(id),
      payload,
    );
    return readMetaMessage(res.data);
  },

  deactivate: async (id: number): Promise<string | null> => {
    const res = await apiClient.delete<MutResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.DETAIL(id),
    );
    return readMetaMessage(res.data);
  },

  reactivate: async (id: number): Promise<string | null> => {
    const res = await apiClient.patch<MutResponse>(
      ADMIN_EQUIPMENT_ENDPOINTS.REACTIVATE(id),
    );
    return readMetaMessage(res.data);
  },
};

