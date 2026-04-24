// ─────────────────────────────────────────────────────────────────────────────
// useRoomDetail — React Query hook for fetching room detail
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { normalizeApiError } from "@shared/errors/normalizeApiError";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { roomDetailApiService } from "../api/roomDetail.api.service";
import type { BookingSubmitPayload } from "../types/roomDetail.types";

// ── Query key factory ─────────────────────────────────────────────────────────
export const roomDetailQueryKeys = {
  all: ["roomDetail"] as const,
  detail: (id: string) => ["roomDetail", id] as const,
};

// ── useRoomDetail ─────────────────────────────────────────────────────────────
export const useRoomDetail = (roomId: string) => {
  return useQuery({
    queryKey: roomDetailQueryKeys.detail(roomId),
    queryFn: () => roomDetailApiService.getRoomById(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ── useSubmitBooking ──────────────────────────────────────────────────────────
export const useSubmitBooking = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BookingSubmitPayload) =>
      roomDetailApiService.submitBooking(payload),
    onSuccess: (data) => {
      // Invalidate dashboard and bookings queries so they refresh
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // Navigate to success page with booking details as state
      navigate("/booking/success", { state: { booking: data } });
    },
    onError: (err) => {
      const n = normalizeApiError(err);
      useAppToastStore.getState().push({
        tone: "error",
        titleI18nKey: n.titleI18nKey,
        message: n.message,
        traceId: n.traceId,
      });

      const msg = (n.message ?? "").toLowerCase();
      const looksLikePenalty =
        n.status === 403 ||
        msg.includes("ban") ||
        msg.includes("banned") ||
        msg.includes("suspend") ||
        msg.includes("suspended") ||
        msg.includes("penalt");

      if (looksLikePenalty) {
        navigate("/penalties", {
          state: { from: "booking", message: n.message },
          replace: false,
        });
      }
    },
  });
};
