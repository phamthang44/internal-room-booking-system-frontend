import { useMemo } from "react";
import { z } from "zod";
import { useI18n } from "@shared/i18n/useI18n";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{10,}$/;

export function useResetPasswordSchema() {
  const { t } = useI18n();

  return useMemo(
    () =>
      z
        .object({
          otp: z
            .string()
            .length(6, t("auth.resetPassword.validation.otpLength")),
          newPassword: z
            .string()
            .min(1, t("auth.resetPassword.validation.passwordRequired"))
            .regex(PASSWORD_REGEX, t("auth.resetPassword.validation.passwordWeak")),
          confirmPassword: z
            .string()
            .min(1, t("auth.resetPassword.validation.confirmRequired")),
        })
        .refine((data) => data.newPassword === data.confirmPassword, {
          message: t("auth.resetPassword.validation.passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t],
  );
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof useResetPasswordSchema>>;
