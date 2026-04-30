import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminEquipmentApiService,
  type AdminEquipmentListParams,
} from "../api/adminEquipment.api.service";
import type { EquipmentRequest } from "../types/adminEquipment.api.types";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { presentAppError } from "@shared/errors/presentAppError";

export const adminEquipmentQueryKeys = {
  all: ["admin", "equipment"] as const,
  list: (params: AdminEquipmentListParams) =>
    [...adminEquipmentQueryKeys.all, "list", params] as const,
  detail: (id: number) =>
    [...adminEquipmentQueryKeys.all, "detail", id] as const,
};

export interface AdminEquipmentListQueryParams {
  keyword: string;
  /** 1-indexed for UI */
  page: number;
  size: number;
  sort: string;
}

export function useAdminEquipmentListQuery(params: AdminEquipmentListQueryParams) {
  const apiParams = useMemo<AdminEquipmentListParams>(
    () => ({
      keyword: params.keyword.trim() || undefined,
      page: Math.max(0, params.page - 1),
      size: params.size,
      sort: params.sort,
    }),
    [params.keyword, params.page, params.size, params.sort],
  );

  return useQuery({
    queryKey: adminEquipmentQueryKeys.list(apiParams),
    queryFn: () => adminEquipmentApiService.list(apiParams),
    staleTime: 1000 * 20,
  });
}

export function useAdminEquipmentDetailQuery(id: number | undefined) {
  const enabled = id != null && Number.isFinite(id) && id > 0;
  return useQuery({
    queryKey: adminEquipmentQueryKeys.detail(id ?? 0),
    queryFn: () => adminEquipmentApiService.detail(id!),
    enabled,
    staleTime: 1000 * 20,
    refetchOnMount: "always",
  });
}

export function useAdminEquipmentCreateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EquipmentRequest) => adminEquipmentApiService.create(payload),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "Equipment type created.");
      void qc.invalidateQueries({ queryKey: adminEquipmentQueryKeys.all });
    },
    onError: (error) => presentAppError(error),
  });
}

export function useAdminEquipmentUpdateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: number; body: EquipmentRequest }) =>
      adminEquipmentApiService.update(payload.id, payload.body),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "Equipment type updated.");
      void qc.invalidateQueries({ queryKey: adminEquipmentQueryKeys.all });
    },
    onError: (error) => presentAppError(error),
  });
}

export function useAdminEquipmentDeactivateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminEquipmentApiService.deactivate(id),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "Equipment type deactivated.");
      void qc.invalidateQueries({ queryKey: adminEquipmentQueryKeys.all });
    },
    onError: (error) => presentAppError(error),
  });
}

export function useAdminEquipmentReactivateMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminEquipmentApiService.reactivate(id),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "Equipment type reactivated.");
      void qc.invalidateQueries({ queryKey: adminEquipmentQueryKeys.all });
    },
    onError: (error) => presentAppError(error),
  });
}

