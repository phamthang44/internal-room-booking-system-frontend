import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useLoginSchema } from "../hooks/useLoginSchema";
import { useI18n } from "@shared/i18n/useI18n";
import { useState } from "react";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { extractApiErrorMessage } from "@shared/errors/extractApiErrorMessage";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useI18n();
  const loginSchema = useLoginSchema();
  const { login, isLoading, error: loginError } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate when field loses focus
    reValidateMode: "onChange", // Re-validate on change after blur
  });

  const onSubmit = (data: any) => {
    login(data);
  };

  const friendlyErrorMessage = loginError
    ? (() => {
        const status = (loginError as any)?.response?.status as number | undefined;
        if (status === 401) return t("auth.login.errors.invalidCredentials");
        return extractApiErrorMessage(loginError);
      })()
    : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Identifier Field (Email or Username) */}
      <FormField
        label={t("auth.login.email.label")}
        error={errors.identifier?.message?.toString()}
        required
      >
        <Input
          {...register("identifier")}
          type="text"
          placeholder={t("auth.login.email.placeholder")}
          isError={!!errors.identifier}
          disabled={isLoading}
        />
      </FormField>

      {/* Password Field */}
      <FormField
        label={t("auth.login.password.label")}
        error={errors.password?.message?.toString()}
        required
      >
        <div className="relative">
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.login.password.placeholder")}
            isError={!!errors.password}
            disabled={isLoading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
      </FormField>

      {/* Forgot Password Link */}
      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {t("auth.login.forgotPassword")}
        </Link>
      </div>

      {/* API Error */}
      {friendlyErrorMessage && (
        <div className="p-3 bg-error-container rounded-lg">
          <p className="text-sm text-on-error-container font-medium">
            {friendlyErrorMessage}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading
          ? t("auth.login.submit.signing")
          : t("auth.login.submit.signIn")}
      </Button>
    </form>
  );
};
