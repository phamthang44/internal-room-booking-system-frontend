import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@shared/i18n/useI18n";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { useResetPassword } from "../hooks/useResetPassword";
import { useResetPasswordSchema } from "../hooks/useResetPasswordSchema";
import type { ResetPasswordFormValues } from "../hooks/useResetPasswordSchema";

interface ResetPasswordFormProps {
  email: string;
}

export const ResetPasswordForm = ({ email }: ResetPasswordFormProps) => {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const schema = useResetPasswordSchema();
  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate({
      email,
      otp: data.otp,
      newPassword: data.newPassword,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Read-only email indicator */}
      <div className="rounded-xl bg-surface-container-low px-4 py-3 text-sm text-on-surface-variant">
        <span className="font-medium text-on-surface">{t("auth.resetPassword.sendingTo")}</span>{" "}
        {email}
      </div>

      {/* OTP Field */}
      <FormField
        label={t("auth.resetPassword.otp.label")}
        error={errors.otp?.message?.toString()}
        required
      >
        <Input
          {...register("otp")}
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder={t("auth.resetPassword.otp.placeholder")}
          isError={!!errors.otp}
          disabled={mutation.isPending}
          className="tracking-[0.5em] text-center font-mono text-lg"
        />
      </FormField>

      {/* New Password Field */}
      <FormField
        label={t("auth.resetPassword.newPassword.label")}
        error={errors.newPassword?.message?.toString()}
        required
      >
        <div className="relative">
          <Input
            {...register("newPassword")}
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.resetPassword.newPassword.placeholder")}
            isError={!!errors.newPassword}
            disabled={mutation.isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-lg">
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
      </FormField>

      {/* Confirm Password Field */}
      <FormField
        label={t("auth.resetPassword.confirmPassword.label")}
        error={errors.confirmPassword?.message?.toString()}
        required
      >
        <div className="relative">
          <Input
            {...register("confirmPassword")}
            type={showConfirm ? "text" : "password"}
            placeholder={t("auth.resetPassword.confirmPassword.placeholder")}
            isError={!!errors.confirmPassword}
            disabled={mutation.isPending}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-lg">
              {showConfirm ? "visibility" : "visibility_off"}
            </span>
          </button>
        </div>
      </FormField>

      <Button
        type="submit"
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending
          ? t("auth.resetPassword.submit.resetting")
          : t("auth.resetPassword.submit.reset")}
      </Button>
    </form>
  );
};
