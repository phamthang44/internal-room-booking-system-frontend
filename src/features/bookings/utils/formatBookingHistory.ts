/** Composite key: `${action}|${statusAfter}` — both normalized UPPER_SNAKE. */
const EVENT_TITLE_KEY_BY_PAIR: Record<string, string> = {
  "CREATE_BOOKING|PENDING":
    "bookings.detail.history.events.createBooking_pending",
  "SUBMIT_BOOKING|PENDING":
    "bookings.detail.history.events.submitBooking_pending",
  "APPROVE_BOOKING|APPROVED":
    "bookings.detail.history.events.approveBooking_approved",
  "APPROVE_BOOKING|CONFIRMED":
    "bookings.detail.history.events.approveBooking_confirmed",
  "CONFIRM_BOOKING|CONFIRMED":
    "bookings.detail.history.events.confirmBooking_confirmed",
  "CONFIRM_BOOKING|APPROVED":
    "bookings.detail.history.events.confirmBooking_approved",
  "CHECK_IN|CHECKED_IN": "bookings.detail.history.events.checkIn_checkedIn",
  "CHECK_IN|APPROVED": "bookings.detail.history.events.checkIn_approved",
  "CHECK_OUT|COMPLETED": "bookings.detail.history.events.checkOut_completed",
  "CANCEL_BOOKING|CANCELLED":
    "bookings.detail.history.events.cancelBooking_cancelled",
  "CANCEL|CANCELLED": "bookings.detail.history.events.cancel_cancelled",
  "REJECT_BOOKING|REJECTED":
    "bookings.detail.history.events.rejectBooking_rejected",
  "REJECT|REJECTED": "bookings.detail.history.events.reject_rejected",
  "SYSTEM_REJECT|REJECTED":
    "bookings.detail.history.events.systemReject_rejected",
};

export type BookingHistoryTone = "primary" | "neutral" | "danger";

function normalizeCode(value?: string | null): string {
  return (value ?? "").trim().toUpperCase();
}

function humanizeCode(value: string): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .split(/_+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function pairKey(action: string, statusAfter: string): string {
  return `${action}|${statusAfter}`;
}

export function getBookingHistoryTitleI18nKey(
  action?: string | null,
  statusAfter?: string | null,
): string | null {
  const a = normalizeCode(action);
  const s = normalizeCode(statusAfter);
  return EVENT_TITLE_KEY_BY_PAIR[pairKey(a, s)] ?? null;
}

export type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * User-facing title for a history row. Uses composite i18n keys when known;
 * otherwise `bookings.detail.history.fallback` with humanized codes.
 */
export function formatBookingHistoryTitle(
  t: TranslateFn,
  action?: string | null,
  statusAfter?: string | null,
  legacyTitle?: string | null,
): string {
  const a = normalizeCode(action);
  const s = normalizeCode(statusAfter);

  if (!a && !s) {
    return (legacyTitle ?? "").trim() || t("bookings.detail.history.unknownEvent");
  }

  const key = getBookingHistoryTitleI18nKey(action, statusAfter);
  if (key) return t(key);

  const parts = [humanizeCode(a), humanizeCode(s)].filter(Boolean);
  if (parts.length === 0) {
    return (legacyTitle ?? "").trim() || t("bookings.detail.history.unknownEvent");
  }

  return t("bookings.detail.history.fallback", {
    summary: parts.join(" · "),
  });
}

export function getBookingHistoryIcon(
  action?: string | null,
  statusAfter?: string | null,
): string {
  const actionUpper = normalizeCode(action);
  const statusUpper = normalizeCode(statusAfter);

  if (
    actionUpper === "CHECK_OUT" ||
    statusUpper === "COMPLETED" ||
    actionUpper === "COMPLETED"
  ) {
    return "logout";
  }
  if (
    actionUpper === "APPROVE_BOOKING" ||
    actionUpper === "CONFIRM_BOOKING" ||
    statusUpper === "APPROVED" ||
    statusUpper === "CONFIRMED"
  ) {
    return "check_circle";
  }
  if (
    actionUpper === "CREATE_BOOKING" ||
    actionUpper === "SUBMIT_BOOKING" ||
    statusUpper === "PENDING"
  ) {
    return "hourglass_top";
  }
  if (actionUpper === "CHECK_IN" || statusUpper === "CHECKED_IN") {
    return "login";
  }
  if (
    actionUpper.includes("CANCEL") ||
    statusUpper === "CANCELLED" ||
    actionUpper.includes("REJECT") ||
    statusUpper === "REJECTED"
  ) {
    return "cancel";
  }

  return "history";
}

export function getBookingHistoryTone(
  action?: string | null,
  statusAfter?: string | null,
): BookingHistoryTone {
  const actionUpper = normalizeCode(action);
  const statusUpper = normalizeCode(statusAfter);

  if (statusUpper === "REJECTED" || statusUpper === "CANCELLED") return "danger";
  if (actionUpper.includes("REJECT") || actionUpper.includes("CANCEL")) return "danger";

  if (
    statusUpper === "APPROVED" ||
    statusUpper === "CONFIRMED" ||
    statusUpper === "COMPLETED" ||
    statusUpper === "CHECKED_IN"
  ) {
    return "primary";
  }
  if (
    actionUpper === "APPROVE_BOOKING" ||
    actionUpper === "CONFIRM_BOOKING" ||
    actionUpper === "CHECK_OUT" ||
    actionUpper === "CHECK_IN"
  ) {
    return "primary";
  }
  return "neutral";
}
