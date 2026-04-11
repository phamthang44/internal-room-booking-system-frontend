// ─────────────────────────────────────────────────────────────────────────────
// useRoomDetail — React Query hook for fetching room detail
// ─────────────────────────────────────────────────────────────────────────────
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  });
};
