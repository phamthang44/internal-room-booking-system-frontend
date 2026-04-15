import { useMemo } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { RoomSearchParams } from "@features/rooms/types/classroom.api.types";
import { useAdminRoomsService } from "../api/adminRooms.service";
import { fetchAdminRoomsListPage } from "../api/adminRoomsList.api";
import type {
  CreateClassroomRequest,
  UpdateClassroomRequest,
  UpdateClassroomStatusRequest,
} from "../types/adminRooms.api.types";

export const adminRoomsQueryKeys = {
  all: ["admin", "rooms"] as const,
  list: (params: RoomSearchParams) =>
    [...adminRoomsQueryKeys.all, "list", params] as const,
  detail: (id: number) =>
    [...adminRoomsQueryKeys.all, "detail", id] as const,
};

export interface AdminRoomsListQueryParams {
  keyword: string;
  page: number;
  pageSize: number;
}

export function useAdminRoomsListQuery(params: AdminRoomsListQueryParams) {
  const apiParams: RoomSearchParams = useMemo(
    () => ({
      keyword: params.keyword.trim() || undefined,
      page: params.page - 1,
      size: params.pageSize,
    }),
    [params.keyword, params.page, params.pageSize],
  );

  return useQuery({
    queryKey: adminRoomsQueryKeys.list(apiParams),
    queryFn: async () => fetchAdminRoomsListPage(apiParams),
    staleTime: 1000 * 30,
  });
}

export function useAdminRoomDetailQuery(roomId: number | undefined) {
  const service = useAdminRoomsService();
  const enabled =
    roomId != null && Number.isFinite(roomId) && roomId > 0;

  return useQuery({
    queryKey: adminRoomsQueryKeys.detail(roomId ?? 0),
    queryFn: () => service.getDetail(roomId!),
    enabled,
    staleTime: 1000 * 30,
    // If you navigate away/back quickly, React Query may serve cached "fresh" data
    // and skip hitting the backend (staleTime=30s). Force a refetch on mount.
    refetchOnMount: "always",
  });
}

export function useAdminRoomCreateMutation() {
  const queryClient = useQueryClient();
  const service = useAdminRoomsService();

  return useMutation({
    mutationFn: (payload: CreateClassroomRequest) => service.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoomsQueryKeys.all });
    },
  });
}

export function useAdminRoomUpdateMutation() {
  const queryClient = useQueryClient();
  const service = useAdminRoomsService();

  return useMutation({
    mutationFn: (payload: UpdateClassroomRequest) => service.update(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoomsQueryKeys.all });
    },
  });
}

export function useAdminRoomStatusMutation() {
  const queryClient = useQueryClient();
  const service = useAdminRoomsService();

  return useMutation({
    mutationFn: (payload: UpdateClassroomStatusRequest) =>
      service.updateStatus(payload),
    meta: { skipGlobalError: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminRoomsQueryKeys.all });
    },
  });
}