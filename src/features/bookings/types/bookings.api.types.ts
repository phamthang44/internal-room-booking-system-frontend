// ─────────────────────────────────────────────────────────────────────────────
// Bookings — API Types (from documents/docs/booking-api-contract.md)
// Base: /api/v1/bookings
// ─────────────────────────────────────────────────────────────────────────────

export interface ApiMeta {
  serverTime?: number;
  message?: string;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  traceId?: string;
}

export interface ApiErrorDetail {
  code?: string;
  message?: string;
  traceId?: string;
  details?: unknown;
}

export interface ApiResult<T> {
  data?: T;
  meta?: ApiMeta;
  error?: ApiErrorDetail;
}

export type BookingStatusApi =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "COMPLETED";

export type BookingSortApi =
  | "newest"
  | "booking_date_asc"
  | "booking_date_desc"
  | "status_asc"
  | "status_desc";

export interface BookingTimeSlotDto {
  id?: number;
  startTime?: string; // "08:00:00"
  endTime?: string; // "09:00:00"
  slotName?: string;
}

export interface BookingHistorySummaryResponse {
  bookingId?: number;
  classroomName?: string;
  action?: string; // CHECK_IN, CANCEL, ...
  statusAfter?: string;
  timestamp?: string; // Instant ISO-8601
  note?: string;
  performedBy?: string;
}

export interface BookingDetailResponse {
  bookingId?: number;
  roomName?: string;
  buildingName?: string;
  buildingAddress?: string;
  bookingDate?: string; // yyyy-MM-dd
  timeSlots?: BookingTimeSlotDto[];
  purpose?: string;
  attendees?: number;
  status?: BookingStatusApi;
  checkinTime?: string; // Instant ISO-8601
  checkoutTime?: string; // Instant ISO-8601
  // Backend currently returns `bookingHistorySummaryResponses`
  bookingHistorySummaryResponses?: BookingHistorySummaryResponse[];
  // Fallback for older/alternate naming (safe to keep optional)
  bookingHistorySummary?: BookingHistorySummaryResponse[];
}

export interface CreateBookingRequest {
  classroomId: number;
  bookingDate: string; // yyyy-MM-dd
  timeSlotIds: number[];
  timeBooking: string; // Instant ISO-8601
  attendees: number;
  purpose: string;
}

export interface CreateBookingResponse {
  bookingId?: number;
  roomName?: string;
  building?: {
    id?: number;
    name?: string;
    address?: string;
  };
  bookingDate?: string;
  timeSlots?: BookingTimeSlotDto[];
  bookingStatus?: BookingStatusApi;
}

export interface CancelBookingRequest {
  cancelReason: string;
  cancelTime: string; // Instant ISO-8601
}

export interface CheckInRequest {
  checkInTime: string; // Instant ISO-8601
}

export interface CheckoutRequest {
  checkoutTime: string; // Instant ISO-8601
}

export interface BookingSearchParams {
  keyword?: string | null;
  bookingDate?: string | null;
  status?: BookingStatusApi | null;
  timeSlotId?: number | null;
  attendees?: number; // min attendees
  page?: number; // 1-indexed in contract
  size?: number;
  sort?: BookingSortApi;
}

