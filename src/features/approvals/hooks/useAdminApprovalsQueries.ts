import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminBookingsApiService,
  type AdminBookingSearchParams,
  type BookingApprovalRequest,
} from "@features/adminBookings";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import type { ApprovalTabKey } from "@/hooks/useApprovalsUi";

export const adminApprovalsQueryKeys = {
  all: ["admin", "bookings"] as const,
  list: (params: AdminBookingSearchParams) =>
    [...adminApprovalsQueryKeys.all, "list", params] as const,
};

export interface UseAdminApprovalsListQueryParams {
  status?: AdminBookingSearchParams["status"];
  page: number;
  size: number;
  sort?: AdminBookingSearchParams["sort"];
  bookingId?: number;
  studentCode?: string;
  classroomId?: number;
  bookingDate?: string;
}

export function useAdminApprovalsListQuery(params: UseAdminApprovalsListQueryParams) {
  const apiParams: AdminBookingSearchParams = useMemo(
    () => ({
      status: params.status,
      bookingId: params.bookingId,
      studentCode: params.studentCode?.trim() || undefined,
      classroomId: params.classroomId,
      bookingDate: params.bookingDate?.trim() || undefined,
      page: params.page,
      size: params.size,
      sort: params.sort ?? "NEWEST",
    }),
    [
      params.status,
      params.bookingId,
      params.studentCode,
      params.classroomId,
      params.bookingDate,
      params.page,
      params.size,
      params.sort,
    ],
  );

  return useQuery({
    queryKey: adminApprovalsQueryKeys.list(apiParams),
    queryFn: () => adminBookingsApiService.search(apiParams),
    staleTime: 1000 * 10,
    select: (data) => {
      // Counts aren’t in contract yet; keep optional + resilient.
      const counts = data?.meta && typeof data.meta === "object"
        ? (data.meta as unknown as { counts?: Record<string, number> }).counts
        : undefined;
      const processedCounts = (counts || {}) as Record<string, number>;
      const historyCount = data.meta?.totalElements;

      return {
        rows: data.rows,
        meta: data.meta,
        counts: {
          ...processedCounts,
          HISTORY: historyCount,
        } as Partial<Record<ApprovalTabKey, number>>,
      };
    },
  });
}

export interface ApproveBookingArgs {
  bookingId: number;
}

export interface RejectBookingArgs {
  bookingId: number;
  reason: string;
}

export interface BulkApproveArgs {
  bulkIds: number[];
}

export interface BulkRejectArgs {
  bulkIds: number[];
  reason: string;
}

export function useApproveBookingMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: ApproveBookingArgs | BulkApproveArgs) => {
      if ("bulkIds" in args) {
        const ids = args.bulkIds;
        for (const id of ids) {
          const payload: BookingApprovalRequest = { action: "APPROVE" };
          await adminBookingsApiService.approve(id, payload);
        }
        return ids.length;
      }
      const payload: BookingApprovalRequest = { action: "APPROVE" };
      await adminBookingsApiService.approve(args.bookingId, payload);
      return 1;
    },
    onSuccess: () => {
      presentAppSuccess("Approval updated");
      void qc.invalidateQueries({ queryKey: adminApprovalsQueryKeys.all });
    },
  });
}

export function useRejectBookingMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (args: RejectBookingArgs | BulkRejectArgs) => {
      if ("bulkIds" in args) {
        const ids = args.bulkIds;
        for (const id of ids) {
          const payload: BookingApprovalRequest = {
            action: "REJECT",
            reason: args.reason,
          };
          await adminBookingsApiService.reject(id, payload);
        }
        return ids.length;
      }

      const payload: BookingApprovalRequest = {
        action: "REJECT",
        reason: args.reason,
      };
      await adminBookingsApiService.reject(args.bookingId, payload);
      return 1;
    },
    meta: { skipGlobalError: true },
    onSuccess: () => {
      presentAppSuccess("Rejection submitted");
      void qc.invalidateQueries({ queryKey: adminApprovalsQueryKeys.all });
    },
  });
}

