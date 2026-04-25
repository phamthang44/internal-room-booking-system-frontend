import { z } from "zod";
import type { AppToastTone } from "@shared/errors/appToastStore";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { formatIsoRelativeCaption } from "@shared/utils/date";

const BOOKING_EVENT_TYPES = [
  "BOOKING_CREATED",
  "BOOKING_APPROVED",
  "BOOKING_REJECTED",
  "BOOKING_CANCELLED",
  "BOOKING_CHECKED_IN",
  "BOOKING_COMPLETED",
] as const;

const bookingNotificationSchema = z.object({
  type: z.enum(BOOKING_EVENT_TYPES),
  title: z.string(),
  message: z.string(),
  bookingId: z.number(),
  status: z.string(),
  timestamp: z.string(),
});

export type BookingNotificationPayload = z.infer<typeof bookingNotificationSchema>;

type BookingEventType = BookingNotificationPayload["type"];

export function parseBookingNotificationPayload(raw: string): BookingNotificationPayload | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = bookingNotificationSchema.safeParse(parsed);
    if (!result.success) return null;
    return result.data;
  } catch {
    return null;
  }
}

function mapTypeToTone(type: BookingEventType): AppToastTone {
  switch (type) {
    case "BOOKING_CREATED":
      return "info";
    case "BOOKING_APPROVED":
    case "BOOKING_CHECKED_IN":
    case "BOOKING_COMPLETED":
      return "success";
    case "BOOKING_REJECTED":
      return "error";
    case "BOOKING_CANCELLED":
      return "warning";
    default:
      return "info";
  }
}

function mapTypeToMaterialIcon(type: BookingEventType): string {
  switch (type) {
    case "BOOKING_CREATED":
      return "info";
    case "BOOKING_APPROVED":
      return "check_circle";
    case "BOOKING_REJECTED":
      return "cancel";
    case "BOOKING_CANCELLED":
      return "warning";
    case "BOOKING_CHECKED_IN":
      return "login";
    case "BOOKING_COMPLETED":
      return "task_alt";
    default:
      return "notifications";
  }
}

const DEDUPE_MS = 2500;
let lastFingerprint = "";
let lastAt = 0;

function fingerprint(payload: BookingNotificationPayload): string {
  // Backend may emit the same logical event multiple times with different timestamps.
  // Prefer stable fields for dedupe to avoid repeated toasts.
  return `${payload.type}|${payload.bookingId}|${payload.title}|${payload.message}`;
}

/**
 * Shows a toast for a validated booking notification from STOMP.
 * Dedupes rapid repeats of the same event (type + booking + timestamp).
 */
export function presentBookingNotification(payload: BookingNotificationPayload): void {
  const fp = fingerprint(payload);
  const now = Date.now();
  if (fp === lastFingerprint && now - lastAt < DEDUPE_MS) {
    return;
  }
  lastFingerprint = fp;
  lastAt = now;

  const tone = mapTypeToTone(payload.type);
  const materialIcon = mapTypeToMaterialIcon(payload.type);
  const pulseAccent = payload.type === "BOOKING_CHECKED_IN";
  const caption = formatIsoRelativeCaption(payload.timestamp);

  useAppToastStore.getState().push({
    tone,
    plainTitle: payload.title,
    titleI18nKey: "common.toast.successTitle",
    message: payload.message,
    bookingId: payload.bookingId,
    materialIcon,
    pulseAccent,
    caption,
  });
}
