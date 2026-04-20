import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUsersApiService } from "../api/adminUsers.api.service";
import type {
  AdminUserRoleApi,
  RegisterRequest,
} from "../types/adminUsers.api.types";

export const adminUsersQueryKeys = {
  all: ["admin", "users"] as const,
  list: (params: { page: number; size: number; sort: string }) =>
    [...adminUsersQueryKeys.all, "list", params] as const,
};

export interface AdminUsersListQueryParams {
  /** 1-indexed for UI */
  page: number;
  size: number;
  sort: string;
}

export function useAdminUsersListQuery(params: AdminUsersListQueryParams) {
  const apiParams = useMemo(
    () => ({
      page: Math.max(0, params.page - 1),
      size: params.size,
      sort: params.sort,
    }),
    [params.page, params.size, params.sort],
  );

  return useQuery({
    queryKey: adminUsersQueryKeys.list(apiParams),
    queryFn: () => adminUsersApiService.list(apiParams),
    staleTime: 1000 * 20,
  });
}

export function useAdminUserCreateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RegisterRequest) => adminUsersApiService.create(payload),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all });
    },
  });
}

export function useAdminUserToggleBanMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => adminUsersApiService.toggleBan(userId),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all });
    },
  });
}

export function useAdminUserUpdateRoleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { userId: number; roleName: AdminUserRoleApi }) =>
      adminUsersApiService.updateRole(payload.userId, payload.roleName),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUsersQueryKeys.all });
    },
  });
}

