import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { normalizeApiError } from "@shared/errors/normalizeApiError";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { useI18n } from "@shared/i18n/useI18n";
import { bookingsApiService } from "../api/bookings.api.service";

export interface UseBookingCheckoutResult {
  readonly isPending: boolean;
  readonly errorMessage: string | null;
  readonly successMessage: string | null;
  readonly checkout: () => Promise<void>;
}

export function useBookingCheckout(bookingId: string): UseBookingCheckoutResult {
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const id = Number(bookingId);
      if (!Number.isFinite(id)) {
        throw new Error("Invalid booking id");
      }
      return await bookingsApiService.checkoutBooking(id);
    },
    onMutate: () => {
      setErrorMessage(null);
      setSuccessMessage(null);
    },
    onSuccess: async (message) => {
      const msg = message ?? t("bookings.checkout.toast.successFallback");
      setSuccessMessage(msg);
      presentAppSuccess(msg);
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await queryClient.invalidateQueries({ queryKey: ["bookings", "detail", bookingId] });
    },
    onError: (err) => {
      const normalized = normalizeApiError(err);
      setErrorMessage(normalized.message);
    },
  });

  const checkout = useCallback(async () => {
    await mutation.mutateAsync();
  }, [mutation]);

  return {
    isPending: mutation.isPending,
    errorMessage,
    successMessage,
    checkout,
  };
}

