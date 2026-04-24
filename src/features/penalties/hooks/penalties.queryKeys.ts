import type { AdminUserPenaltiesResponse } from "../types/penalties.api.types";

export const penaltiesQueryKeys = {
  all: ["penalties"] as const,
  me: () => [...penaltiesQueryKeys.all, "me"] as const,
  myPenalties: () => [...penaltiesQueryKeys.me(), "penalties"] as const,
  myViolations: () => [...penaltiesQueryKeys.me(), "violations"] as const,
  admin: () => [...penaltiesQueryKeys.all, "admin"] as const,
  adminUser: (userId: number) => [...penaltiesQueryKeys.admin(), "user", userId] as const,
  adminUserSnapshot: (userId: number) =>
    [...penaltiesQueryKeys.adminUser(userId), "snapshot"] as const satisfies readonly unknown[],
} as const;

export type AdminUserPenaltyQueryKey = ReturnType<typeof penaltiesQueryKeys.adminUserSnapshot>;
export type AdminUserPenaltyQueryData = AdminUserPenaltiesResponse;

