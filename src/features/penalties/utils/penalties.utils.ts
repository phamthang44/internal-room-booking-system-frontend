import type { PenaltyRecordResponse, PenaltyTypeApi } from "../types/penalties.api.types";

export function isPenaltyActive(p: PenaltyRecordResponse | null | undefined): boolean {
  if (!p) return false;
  // Some backends use `active` instead of `isActive`.
  if ((p as unknown as { active?: boolean }).active === true) return true;
  if (p.isActive === true) return true;
  const status = (p.status ?? "").toString().toUpperCase();
  if (status === "ACTIVE") return true;
  // Explicit non-active states should never be treated as active,
  // even if end time is still in the future.
  if (status === "REVOKED" || status === "EXPIRED") return false;

  // Some backends may omit status but include end time.
  const endIso = (p.endDate ?? p.endTime) as string | null | undefined;
  if (!endIso) return false;
  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() > Date.now();
}

export function pickPenaltyType(p: PenaltyRecordResponse | null | undefined): PenaltyTypeApi | null {
  const raw = (p?.type ?? p?.action ?? "").toString().toUpperCase();
  if (!raw) return null;
  const t = raw;
  if (t === "WARNING") return "WARNING";
  if (t === "APPROVAL_REQUIRED" || t === "REQUIRE_APPROVAL") return "APPROVAL_REQUIRED";
  if (t === "TEMPORARY_BAN") return "TEMPORARY_BAN";
  if (t === "PERMANENT_BAN") return "PERMANENT_BAN";
  return null;
}

export function penaltyEndIso(p: PenaltyRecordResponse | null | undefined): string | null {
  const v = (p?.endDate ?? p?.endTime) as string | null | undefined;
  return v ?? null;
}

export function penaltyTitle(p: PenaltyRecordResponse | null | undefined): string {
  if (!p) return "—";
  const title = (p.action ?? p.type ?? "").toString().trim();
  return title || "—";
}

