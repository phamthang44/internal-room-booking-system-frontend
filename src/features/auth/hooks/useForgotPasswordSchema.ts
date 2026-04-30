import { useMemo } from "react";
import { z } from "zod";
import { useI18n } from "@shared/i18n/useI18n";

export function useForgotPasswordSchema() {
  const { t } = useI18n();

  return useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t("auth.forgotPassword.validation.emailRequired"))
          .email(t("auth.forgotPassword.validation.emailInvalid"))
          .max(255, t("auth.forgotPassword.validation.emailTooLong")),
      }),
    [t],
  );
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof useForgotPasswordSchema>>;
