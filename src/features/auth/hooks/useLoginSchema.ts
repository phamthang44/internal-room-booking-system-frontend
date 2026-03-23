import { useI18n } from "@shared/i18n/useI18n";
import { z } from "zod";

export interface LoginFormData {
  identifier: string; // Can be email or username
  password: string;
}

// Custom email pattern - covers standard email formats
// Pattern: user@domain.extension
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Create schema with i18n messages
export const useLoginSchema = () => {
  const { t } = useI18n();

  const schema = z.object({
    identifier: z
      .string()
      .min(1, t("auth.login.email.error.required"))
      .refine(
        (value) => EMAIL_PATTERN.test(value),
        t("auth.login.email.error.invalid"),
      ),
    password: z
      .string()
      .min(1, t("auth.login.password.error.required"))
      .min(8, t("auth.login.password.error.minLength")),
  });

  return schema;
};
