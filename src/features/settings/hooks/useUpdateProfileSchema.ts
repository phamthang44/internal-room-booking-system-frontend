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
      }),
    [t],
  );
}

export type UpdateProfileFormValues = z.infer<ReturnType<typeof useUpdateProfileSchema>>;
