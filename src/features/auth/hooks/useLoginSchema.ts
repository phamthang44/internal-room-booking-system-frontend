import { useI18n } from "@shared/i18n/useI18n";
import { z } from "zod";

export interface LoginFormData {
  email: string;
  password: string;
}

// Create schema with i18n messages
export const useLoginSchema = () => {
  const { t } = useI18n();

  const schema = z.object({
    email: z
      .string()
      .min(1, t("auth.login.email.error.required"))
      .email(t("auth.login.email.error.invalid")),
    password: z
      .string()
      .min(1, t("auth.login.password.error.required"))
      .min(8, t("auth.login.password.error.minLength")),
  });

  return schema;
};
