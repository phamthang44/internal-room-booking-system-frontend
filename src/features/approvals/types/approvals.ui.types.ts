import type { AdminBookingStatusApi } from "@features/adminBookings";

export type ReliabilityFlag = "reliable" | "highNoShow" | "none";

export interface ApprovalsStudentCellUI {
  readonly initials: string;
  readonly fullName: string;
  readonly studentCode: string;
  readonly reliability: ReliabilityFlag;
}

export interface ApprovalsVenueCellUI {
  readonly roomName: string;
  readonly loadLabel: string; // "90 / 120"
  readonly loadPct: number; // 0..1
  readonly loadTone: "primary" | "warning" | "neutral";
}

export interface ApprovalsDateCellUI {
  readonly dateLabel: string; // "2026-04-21" or formatted
  readonly timeLabel: string; // "07:00 - 09:00"
  readonly slotName?: string;
}

export interface ApprovalsStatusCellUI {
  readonly badgeLabelKey:
    | "approvals.status.pending"
    | "approvals.status.approved"
    | "approvals.status.rejected"
    | "approvals.status.available"
    | "approvals.status.conflictAlert"
    | "approvals.status.cancelled"
    | "approvals.status.checkedIn"
    | "approvals.status.completed";
  readonly badgeTone: "pending" | "approved" | "rejected" | "available" | "conflict" | "neutral";
  readonly hint?: string;
}

export interface ApprovalRowUI {
  readonly bookingId: number;
  readonly student: ApprovalsStudentCellUI;
  readonly purposeTitle: string;
  readonly purposeSubtitle?: string;
  readonly venue: ApprovalsVenueCellUI;
  readonly date: ApprovalsDateCellUI;
  readonly status: ApprovalsStatusCellUI;
  readonly bookingStatus: AdminBookingStatusApi | string;
}

