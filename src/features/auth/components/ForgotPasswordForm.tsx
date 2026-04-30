import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { useForgotPassword } from "../hooks/useForgotPassword";
import { useForgotPasswordSchema } from "../hooks/useForgotPasswordSchema";
import type { ForgotPasswordFormValues } from "../hooks/useForgotPasswordSchema";
import { useOtpCooldown } from "../hooks/useOtpCooldown";

export const ForgotPasswordForm = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const schema = useForgotPasswordSchema();
  const mutation = useForgotPassword();
  const cooldown = useOtpCooldown();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data, {
      onSuccess: () => {
        cooldown.start();
        navigate(`/reset-password?email=${encodeURIComponent(data.email)}`);
      },
    });
  };

  const handleResend = () => {
    const email = getValues("email");
    if (!email || cooldown.isCoolingDown) return;
    mutation.mutate(
      { email },
      { onSuccess: () => cooldown.start() },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <FormField
        label={t("auth.forgotPassword.email.label")}
        error={errors.email?.message?.toString()}
        required
      >
        <Input
          {...register("email")}
          type="email"
          placeholder={t("auth.forgotPassword.email.placeholder")}
          isError={!!errors.email}
          disabled={mutation.isPending}
        />
      </FormField>

      <Button
        type="submit"
        disabled={mutation.isPending}
        isLoading={mutation.isPending}
        className="w-full"
      >
        {mutation.isPending
          ? t("auth.forgotPassword.submit.sending")
          : t("auth.forgotPassword.submit.send")}
      </Button>

      {cooldown.isCoolingDown && (
        <p className="text-center text-xs text-on-surface-variant">
          {t("auth.forgotPassword.resend.cooldown", { seconds: cooldown.secondsLeft })}
        </p>
      )}

      {mutation.isSuccess && !cooldown.isCoolingDown && (
        <button
          type="button"
          onClick={handleResend}
          className="w-full text-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          {t("auth.forgotPassword.resend.label")}
        </button>
      )}
    </form>
  );
};
