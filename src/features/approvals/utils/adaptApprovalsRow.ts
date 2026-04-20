import type { AdminBookingItemResponse } from "@features/adminBookings";
import type { ApprovalRowUI, ReliabilityFlag } from "../types/approvals.ui.types";

const initialsFromName = (name: string): string => {
  const parts = name
    .split(" ")
    .map((p) => p.trim())
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
};

const safeDateLabel = (isoOrDate: string | undefined, fallback = "—"): string => {
  if (!isoOrDate) return fallback;
  const d = new Date(isoOrDate);
  if (Number.isNaN(d.getTime())) return isoOrDate;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
};

const safeSlotRange = (slot?: { startTime?: string; endTime?: string }): string => {
  if (!slot) return "—";
  const s = slot.startTime?.slice(0, 5) ?? "";
  const e = slot.endTime?.slice(0, 5) ?? "";
  const label = [s, e].filter(Boolean).join(" - ");
  return label || "—";
};

const normalizeReliability = (raw?: string | null): ReliabilityFlag => {
  if (!raw) return "none";
  const v = raw.toLowerCase();
  if (v.includes("reliable")) return "reliable";
  if (v.includes("no-show") || v.includes("noshow") || v.includes("risk")) return "highNoShow";
  return "none";
};

export function adaptApprovalsRow(raw: AdminBookingItemResponse): ApprovalRowUI {
  const bookingId = raw.id ?? 0;

  const studentName = raw.studentName ?? "Student";
  // Not included in the list response currently (we render Booking ID in the table).
  const studentCode = "—";

  const reliabilityRaw = (raw as unknown as { reliability?: string | null }).reliability ?? null;
  const reliability = normalizeReliability(reliabilityRaw);

  const roomName = raw.room?.roomName ?? "—";
  const capacity = raw.room?.capacity ?? null;
  const requested = raw.room?.requestedAttendees ?? null;
  const loadLabel =
    capacity && requested != null ? `${requested} / ${capacity}` : requested != null ? `${requested}` : "—";
  const loadPct =
    capacity && requested != null && capacity > 0 ? Math.min(1, Math.max(0, requested / capacity)) : 0.25;
  const loadTone: "primary" | "warning" | "neutral" =
    loadPct >= 0.9 ? "warning" : loadPct > 0 ? "primary" : "neutral";

  const bookingStatus = (raw.status ?? "PENDING").toString().toUpperCase();

  // Conflict/status pill
  // - Pending: show "Conflict Alert" when conflictNote exists, otherwise "Pending"
  // - Approved/Rejected: show their final state and keep conflictNote only as a hint
  const conflictNote = (raw as unknown as { conflictNote?: string }).conflictNote;
  const hasConflict = Boolean(conflictNote?.trim());

  const badgeLabelKey =
    bookingStatus === "APPROVED"
      ? "approvals.status.approved"
      : bookingStatus === "REJECTED"
        ? "approvals.status.rejected"
        : hasConflict
          ? "approvals.status.conflictAlert"
          : "approvals.status.pending";

  const badgeTone =
    bookingStatus === "APPROVED"
      ? "approved"
      : bookingStatus === "REJECTED"
        ? "rejected"
        : hasConflict
          ? "conflict"
          : "pending";

  return {
    bookingId,
    bookingStatus: raw.status ?? "PENDING",
    student: {
      initials: initialsFromName(studentName),
      fullName: studentName,
      studentCode: String(studentCode),
      reliability,
    },
    purposeTitle: raw.purpose ?? "—",
    purposeSubtitle: undefined,
    venue: {
      roomName,
      loadLabel,
      loadPct,
      loadTone,
    },
    date: {
      dateLabel: safeDateLabel(raw.date),
      timeLabel: safeSlotRange(raw.timeSlot),
      slotName: raw.timeSlot?.slotName,
    },
    status: {
      badgeLabelKey,
      badgeTone,
      hint: hasConflict ? conflictNote : undefined,
    },
  };
}

