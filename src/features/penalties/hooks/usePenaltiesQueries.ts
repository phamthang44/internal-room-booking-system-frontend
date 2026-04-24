import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { normalizeApiError } from "@shared/errors/normalizeApiError";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { penaltiesApiService } from "../api/penalties.api.service";
import type { PenaltyExtendRequest, PenaltyRevokeRequest } from "../types/penalties.api.types";
import { penaltiesQueryKeys } from "./penalties.queryKeys";

export function useMyPenaltiesQuery() {
  return useQuery({
    queryKey: penaltiesQueryKeys.myPenalties(),
    queryFn: () => penaltiesApiService.getMyPenalties(),
    staleTime: 1000 * 15,
    refetchOnWindowFocus: true,
  });
}

export function useMyViolationsQuery() {
  return useQuery({
    queryKey: penaltiesQueryKeys.myViolations(),
    queryFn: () => penaltiesApiService.getMyViolations(),
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
  });
}

export function useAdminUserPenaltiesQuery(userId: number | null) {
  return useQuery({
    queryKey: userId != null ? penaltiesQueryKeys.adminUserSnapshot(userId) : ["penalties", "admin", "user", "none"],
    queryFn: () => {
      if (userId == null) throw new Error("adminUserPenalties: missing userId");
      return penaltiesApiService.getAdminUserPenalties(userId);
    },
    enabled: userId != null,
    staleTime: 1000 * 10,
  });
}

const pushErrorToast = (err: unknown) => {
  const n = normalizeApiError(err);
  useAppToastStore.getState().push({
    tone: "error",
    titleI18nKey: n.titleI18nKey,
    message: n.message,
    traceId: n.traceId,
  });
};

export function useRevokePenaltyMutation(args?: { userId?: number }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ penaltyId, payload }: { penaltyId: number; payload: PenaltyRevokeRequest }) =>
      penaltiesApiService.revokePenalty(penaltyId, payload),
    onSuccess: () => {
      presentAppSuccess("Penalty updated");
      void qc.invalidateQueries({ queryKey: penaltiesQueryKeys.all });
      if (args?.userId != null) {
        void qc.invalidateQueries({ queryKey: penaltiesQueryKeys.adminUser(args.userId) });
      }
    },
    onError: pushErrorToast,
  });
}

export function useExtendPenaltyMutation(args?: { userId?: number }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ penaltyId, payload }: { penaltyId: number; payload: PenaltyExtendRequest }) =>
      penaltiesApiService.extendPenalty(penaltyId, payload),
    onSuccess: () => {
      presentAppSuccess("Penalty updated");
      void qc.invalidateQueries({ queryKey: penaltiesQueryKeys.all });
      if (args?.userId != null) {
        void qc.invalidateQueries({ queryKey: penaltiesQueryKeys.adminUser(args.userId) });
      }
    },
    onError: pushErrorToast,
  });
}

