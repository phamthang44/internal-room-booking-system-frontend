import { useMemo } from "react";
import { z } from "zod";
import { useI18n } from "@shared/i18n/useI18n";

export function useUpdateProfileSchema() {
  const { t } = useI18n();

  return useMemo(
    () =>
      z.object({
        fullName: z
          .string()
          .min(2, t("settings.profile.validation.fullNameMin"))
          .max(100, t("settings.profile.validation.fullNameMax")),
        phoneNumber: z
          .string()
          .min(8, t("settings.profile.validation.phoneMin"))
          .max(20, t("settings.profile.validation.phoneMax"))
          .regex(/^[+0-9][\d\s-]{6,18}$/, t("settings.profile.validation.phoneFormat")),
      }),
    [t],
  );
}

export type UpdateProfileFormValues = z.infer<ReturnType<typeof useUpdateProfileSchema>>;
