import type { PenaltyRecordResponse, PenaltyTypeApi } from "../types/penalties.api.types";

export function isPenaltyActive(p: PenaltyRecordResponse | null | undefined): boolean {
  if (!p) return false;
  if (p.isActive === true) return true;
  const status = (p.status ?? "").toString().toUpperCase();
  if (status === "ACTIVE") return true;

  // Some backends may omit status but include end time.
  const endIso = (p.endDate ?? p.endTime) as string | null | undefined;
  if (!endIso) return false;
  const end = new Date(endIso);
  if (Number.isNaN(end.getTime())) return false;
  return end.getTime() > Date.now();
}

export function pickPenaltyType(p: PenaltyRecordResponse | null | undefined): PenaltyTypeApi | null {
  if (!p?.type) return null;
  const t = p.type.toString().toUpperCase();
  if (t === "WARNING") return "WARNING";
  if (t === "APPROVAL_REQUIRED") return "APPROVAL_REQUIRED";
  if (t === "TEMPORARY_BAN") return "TEMPORARY_BAN";
  if (t === "PERMANENT_BAN") return "PERMANENT_BAN";
  return null;
}

export function penaltyEndIso(p: PenaltyRecordResponse | null | undefined): string | null {
  const v = (p?.endDate ?? p?.endTime) as string | null | undefined;
  return v ?? null;
}

