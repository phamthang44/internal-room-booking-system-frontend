import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import type { ResetPasswordPayload } from "../types/auth.types";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { presentAppError } from "@shared/errors/presentAppError";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    meta: { skipGlobalError: true },
    onSuccess: (message) => {
      presentAppSuccess(message ?? "Password reset successfully.");
      navigate("/login");
    },
    onError: (error) => {
      presentAppError(error);
    },
  });
}
