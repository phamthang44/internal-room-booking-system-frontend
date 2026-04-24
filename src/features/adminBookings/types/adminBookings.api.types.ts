// ─────────────────────────────────────────────────────────────────────────────
// Admin Bookings — API Types (from documents/docs/admin-booking-contract.md)
// Base: /api/v1/admin/bookings
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp?: string;
  meta?: {
    message?: string;
    page?: number;
    size?: number;
    totalElements?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    traceId?: string;
    serverTime?: number;
  };
}

export type AdminBookingStatusApi =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "COMPLETED";

export type AdminBookingSortApi = "NEWEST" | "OLDEST";

export type BookingApprovalAction = "APPROVE" | "REJECT";

export interface BookingApprovalRequest {
  action: BookingApprovalAction;
  /** Mandatory when rejecting (max 500 chars). */
  reason?: string;
}

export interface AdminBookingSearchParams {
  bookingId?: number;
  studentCode?: string;
  classroomId?: number;
  status?: AdminBookingStatusApi;
  /** Format: YYYY-MM-DD */
  bookingDate?: string;
  /** 1-indexed (Default: 1) */
  page?: number;
  /** Items per page (Default: 20) */
  size?: number;
  sort?: AdminBookingSortApi;
}

export interface AdminBookingTimeSlotDto {
  id?: number;
  startTime?: string;
  endTime?: string;
  slotName?: string;
}

/**
 * Admin approvals list row (backend current shape).
 */
export interface AdminBookingItemResponse {
  id: number;
  studentName: string;
  room: {
    roomName: string;
    capacity: number;
    actualAttendees: number;
    requestedAttendees: number;
  };
  purpose?: string;
  /** Format: YYYY-MM-DD */
  date: string;
  timeSlot: {
    id: number;
    startTime: string;
    endTime: string;
    slotName: string;
  };
  status?: AdminBookingStatusApi | string;
}

export interface AdminBookingDetailResponse {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    studentCode: string;
  };
  adminClassroom: {
    roomName: string;
    capacity: number;
    actualAttendees: number;
    requestedAttendees: number;
  };
  purpose: string;
  /** Format: YYYY-MM-DD */
  bookingDate: string;
  timeSlots: Array<{
    id: number;
    startTime: string;
    endTime: string;
    slotName: string;
  }>;
  audit: {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
  };
}

