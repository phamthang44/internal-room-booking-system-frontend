/**
 * Known API values for {@link BookingHistorySummaryResponse.action} and
 * {@link BookingHistorySummaryResponse.statusAfter}. Documented for autocomplete;
 * the formatter still accepts arbitrary strings with a humanized fallback.
 */
export const BOOKING_HISTORY_ACTIONS = [
  "CREATE_BOOKING",
  "SUBMIT_BOOKING",
  "APPROVE_BOOKING",
  "CONFIRM_BOOKING",
  "CHECK_IN",
  "CHECK_OUT",
  "CANCEL_BOOKING",
  "REJECT_BOOKING",
  "CANCEL",
  "REJECT",
] as const;

export type BookingHistoryActionCode = (typeof BOOKING_HISTORY_ACTIONS)[number];

export const BOOKING_HISTORY_STATUSES = [
  "PENDING",
  "APPROVED",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "CHECKED_IN",
  "COMPLETED",
] as const;

export type BookingHistoryStatusCode = (typeof BOOKING_HISTORY_STATUSES)[number];
