import { useMutation } from "@tanstack/react-query";
import authApi from "../api/auth.api";
import type { OtpRequestPayload } from "../types/auth.types";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { presentAppError } from "@shared/errors/presentAppError";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: OtpRequestPayload) => authApi.forgotPassword(payload),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "OTP sent to your email.");
    },
    onError: (error) => {
      presentAppError(error);
    },
  });
}
