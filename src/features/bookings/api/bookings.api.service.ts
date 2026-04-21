import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "@features/auth";
import { BOOKINGS_ENDPOINTS } from "../constants/bookings.endpoints";
import type {
  ApiResult,
  BookingDetailResponse,
  BookingSearchParams,
  CancelBookingRequest,
  CheckInRequest,
  CheckoutRequest,
  CreateBookingRequest,
  CreateBookingResponse,
} from "../types/bookings.api.types";
import type { BookingActivityItem, BookingDetail, BookingHistoryItem, BookingStatus } from "@/data/mockData";
import { deriveCheckInWindow } from "../utils/checkInTime";
import { getBookingHistoryIcon, getBookingHistoryTone } from "../utils/formatBookingHistory";

const toTimeRange = (slots: { startTime?: string; endTime?: string }[]) => {
  const s = slots?.[0]?.startTime?.slice(0, 5) ?? "00:00";
  const e = slots?.[0]?.endTime?.slice(0, 5) ?? "00:00";
  return { startTime: s, endTime: e };
};

const toTimeSummary = (slots: { startTime?: string; endTime?: string }[]) => {
  if (!slots || slots.length === 0) return "";
  return slots
    .map((s) => `${s.startTime?.slice(0, 5) ?? ""} - ${s.endTime?.slice(0, 5) ?? ""}`.trim())
    .filter(Boolean)
    .join(", ");
};

const mapStatusApiToUi = (
  status?: string | null,
  checkoutTimeIso?: string | null,
): BookingStatus => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "APPROVED":
      return "confirmed";
    case "CANCELLED":
      return "cancelled";
    case "REJECTED":
      return "rejected";
    case "CHECKED_IN":
      return checkoutTimeIso ? "completed" : "inUse";
    case "COMPLETED":
      return "completed";
    default:
      // safest neutral outcome for unknown server values
      return "pending";
  }
};

// Business rule: once approved/confirmed, a booking should not be cancellable by the student.
const canCancelFromStatus = (status?: string | null): boolean => status === "PENDING";

const iconForStatus = (status: BookingStatus): string => {
  if (status === "pending") return "hourglass_top";
  if (status === "confirmed") return "event_available";
  if (status === "inUse") return "meeting_room";
  if (status === "completed") return "task_alt";
  if (status === "cancelled") return "cancel";
  return "block";
};

const formatInstantLabel = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const lang = localStorage.getItem("language");
  const locale = lang === "vi" ? "vi-VN" : lang === "en" ? "en-US" : undefined;
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const unwrapApiResult = <T,>(body: unknown): { data: T | null; meta?: unknown } => {
  if (body && typeof body === "object" && "data" in body) {
    const d = (body as { data?: T }).data;
    return { data: d ?? null, meta: (body as { meta?: unknown }).meta };
  }
  return { data: (body as T) ?? null };
};

export interface MyBookingsUiData {
  summary: {
    reservedSlots: number;
  };
  recentActivity: {
    items: BookingActivityItem[];
  };
  history: {
    items: BookingHistoryItem[];
  };
  meta?: unknown;
}

const adaptMyBookings = (rows: BookingDetailResponse[]): MyBookingsUiData => {
  const activity: BookingActivityItem[] = [];
  const history: BookingHistoryItem[] = [];

  for (const r of rows) {
    const id = r.bookingId != null ? String(r.bookingId) : "";
    const uiStatus = mapStatusApiToUi(r.status, r.checkoutTime ?? null);
    const time = toTimeRange(r.timeSlots ?? []);
    const timeSummary = toTimeSummary(r.timeSlots ?? []);
    const bookingDate = r.bookingDate ?? "";
    const roomName = r.roomName ?? "";
    const buildingName = r.buildingName ?? "";

    // Use bookingId as roomCode fallback (design expects a compact code)
    const roomCode = id ? `#${id}` : "";

    const isActivity = uiStatus === "pending" || uiStatus === "confirmed" || uiStatus === "inUse";

    if (isActivity) {
      activity.push({
        id,
        roomCode,
        roomName,
        icon: iconForStatus(uiStatus),
        dateLabel: bookingDate,
        time,
        status: uiStatus,
        canCancel: canCancelFromStatus(r.status),
      });
    } else {
      history.push({
        id,
        roomLabel: [roomName, buildingName].filter(Boolean).join(" - "),
        dateTimeLabel: [bookingDate, timeSummary ? `• ${timeSummary}` : ""].filter(Boolean).join(" "),
        status: uiStatus,
      });
    }
  }

  // Summary: number of not-cancelled future-ish bookings (best-effort without serverTime)
  const reservedSlots = activity.length;

  return {
    summary: { reservedSlots },
    recentActivity: { items: activity },
    history: { items: history },
  };
};

const PLACEHOLDER_MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCMJ6HhNRqZz5bexlHnpptF8H8irQAcCV36IRVioCbKPBcebbjA-WlLklKaIS3T3rqVPNvjayefkq9GQOP_mW5BUIe6x5689g1IzNyXetrEKUif9-xOyi6T7P6c0fy_slFyUo3RA2X9-O6TBCg9CCrjSAwUBE-aBcUUw1ShZCqcHYvyxE_uK6YO5nH4wIRQ7n7eJ2ZpEXHxRuTY2xNKuezuhmBjz-vgDildFt-AFjzdbUA1Nvs5hndn-GKdjmtTFhieVVzcOTwgKGA";

const adaptBookingDetail = (raw: BookingDetailResponse): BookingDetail => {
  const bookingId = raw.bookingId != null ? String(raw.bookingId) : "";
  const bookingCode = bookingId ? `#${bookingId}` : "#";
  const status = mapStatusApiToUi(raw.status, raw.checkoutTime ?? null);

  const timeSummary = toTimeSummary(raw.timeSlots ?? []);
  const bookingDate = raw.bookingDate ?? "";
  const firstSlotStart = raw.timeSlots?.[0]?.startTime ?? null;
  const checkInWindow = deriveCheckInWindow(bookingDate, firstSlotStart);

  const primaryLocation = [raw.roomName, raw.buildingName].filter(Boolean).join(" - ");
  const secondaryLocation = raw.buildingAddress ?? undefined;
  let performedBy = localStorage.getItem("language") === "vi" ? "Bởi: " : "By: ";
  return {
    id: bookingId,
    bookingCode,
    status,
    title: raw.roomName ?? "",
    location: {
      primary: primaryLocation,
      secondary: secondaryLocation,
    },
    schedule: {
      dateLabel: bookingDate,
      timeLabel: timeSummary,
      ...(bookingDate ? { dateIso: bookingDate } : {}),
    },
    checkInWindow: checkInWindow
      ? { opensAtIso: checkInWindow.opensAt.toISOString(), expiresAtIso: checkInWindow.expiresAt.toISOString() }
      : undefined,
    purpose: raw.purpose ?? "",
    attendeesCount: raw.attendees ?? 0,
    canCancel: canCancelFromStatus(raw.status),
    map: {
      imageUrl: PLACEHOLDER_MAP_IMAGE,
      title: raw.buildingName ?? "",
      description: raw.buildingAddress ?? "",
      ctaLabel: "",
    },
    actions: {
      addToCalendarLabel: "",
      contactSupportLabel: "",
      cancelLabel: "",
      cancelHint: "",
    },
    proTip: undefined,
    timeline: (raw.bookingHistorySummaryResponses ?? raw.bookingHistorySummary ?? []).map((h, idx) => {
      const action = h.action ?? undefined;
      const statusAfter = h.statusAfter ?? undefined;
      return {
        id: String(h.timestamp ?? idx),
        action,
        statusAfter,
        atLabel: formatInstantLabel(h.timestamp),
        note: [h.performedBy ? `${performedBy} ${h.performedBy}` : "", h.note ?? ""].filter(Boolean).join(" — ") || undefined,
        icon: getBookingHistoryIcon(action, statusAfter),
        tone: getBookingHistoryTone(action, statusAfter),
      };
    }),
  };
};

export const bookingsApiService = {
  searchMyBookings: async (
    params: BookingSearchParams = {}
  ): Promise<MyBookingsUiData> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.get<ApiResult<BookingDetailResponse[]>>(BOOKINGS_ENDPOINTS.BASE, {
      ...getAuthConfig(token ?? null),
      params,
    });
    const unwrapped = unwrapApiResult<BookingDetailResponse[]>(response.data);
    const rows = unwrapped.data ?? [];
    const ui = adaptMyBookings(rows);
    return { ...ui, meta: unwrapped.meta };
  },

  getBookingDetail: async (id: string): Promise<BookingDetail> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.get<ApiResult<BookingDetailResponse>>(BOOKINGS_ENDPOINTS.DETAIL(id), {
      ...getAuthConfig(token ?? null),
    });
    const unwrapped = unwrapApiResult<BookingDetailResponse>(response.data);
    if (!unwrapped.data) throw new Error("bookingDetail: empty response");
    return adaptBookingDetail(unwrapped.data);
  },

  createBooking: async (payload: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const { token } = useAuthStore.getState();
    const response = await apiClient.post<ApiResult<CreateBookingResponse>>(
      BOOKINGS_ENDPOINTS.BASE,
      payload,
      { ...getAuthConfig(token ?? null) }
    );
    const unwrapped = unwrapApiResult<CreateBookingResponse>(response.data);
    return unwrapped.data ?? {};
  },

  cancelBooking: async (bookingId: number): Promise<string | null> => {
    const { token } = useAuthStore.getState();
    const payload: CancelBookingRequest = {
      bookingId,
      cancelTime: new Date().toISOString(),
    };
    const response = await apiClient.patch<ApiResult<unknown>>(
      BOOKINGS_ENDPOINTS.CANCEL,
      payload,
      { ...getAuthConfig(token ?? null) }
    );
    return response.data?.meta?.message ?? null;
  },

  checkInBooking: async (bookingId: number): Promise<string | null> => {
    const { token } = useAuthStore.getState();
    const payload: CheckInRequest = {
      bookingId,
      checkInTime: new Date().toISOString(),
    };
    const response = await apiClient.patch<ApiResult<unknown>>(
      BOOKINGS_ENDPOINTS.CHECK_IN,
      payload,
      { ...getAuthConfig(token ?? null) }
    );
    return response.data?.meta?.message ?? null;
  },

  checkoutBooking: async (bookingId: number): Promise<string | null> => {
    const { token } = useAuthStore.getState();
    const payload: CheckoutRequest = {
      bookingId,
      checkoutTime: new Date().toISOString(),
    };
    const response = await apiClient.patch<ApiResult<unknown>>(
      BOOKINGS_ENDPOINTS.CHECK_OUT,
      payload,
      { ...getAuthConfig(token ?? null) }
    );
    return response.data?.meta?.message ?? null;
  },
};

