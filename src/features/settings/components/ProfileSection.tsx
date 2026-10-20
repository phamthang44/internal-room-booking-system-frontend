import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@shared/i18n/useI18n";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import { cn } from "@shared/utils/cn";
import { useProfileStore } from "@features/auth";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { useUpdateProfileSchema } from "../hooks/useUpdateProfileSchema";
import type { UpdateProfileFormValues } from "../hooks/useUpdateProfileSchema";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  LECTURER: "Lecturer",
  ADMIN: "Administrator",
  FACILITY_STAFF: "Facility Staff",
  MANAGER: "Manager",
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-error-container text-error",
  MANAGER: "bg-secondary-container text-on-secondary-container",
  FACILITY_STAFF: "bg-tertiary-container text-on-tertiary-container",
  LECTURER: "bg-primary-container text-on-primary-container",
  STUDENT: "bg-surface-container text-on-surface-variant",
};

function ReadOnlyRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-surface-container-low/50 px-4 py-3">
      <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-on-surface-variant">{label}</p>
        <p className="truncate text-sm font-semibold text-on-surface">{value || "—"}</p>
      </div>
    </div>
  );
}

export const ProfileSection = () => {
  const { t } = useI18n();
  const profile = useProfileStore((s) => s.profile);
  const schema = useUpdateProfileSchema();
  const mutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: profile?.fullName ?? "",
      phoneNumber: profile?.phoneNumber ?? "",
    },
  });

  useEffect(() => {
    if (profile)
      reset({
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber ?? "",
      });
  }, [profile, reset]);

  const onSubmit = (data: UpdateProfileFormValues) => {
    mutation.mutate(data);
  };

  const initials = profile?.fullName
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  const roleLabel = ROLE_LABELS[profile?.roleName ?? ""] ?? profile?.roleName ?? "—";
  const roleColor = ROLE_COLORS[profile?.roleName ?? ""] ?? ROLE_COLORS.STUDENT;

  return (
    <div className="space-y-8">
      {/* Avatar + identity */}
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-on-primary shadow-md">
          {initials}
        </div>
        <div>
          <p className="text-xl font-extrabold tracking-tight text-on-surface font-headline">
            {profile?.fullName ?? "—"}
          </p>
          <p className="text-sm text-on-surface-variant">{profile?.email ?? "—"}</p>
          <span className={cn("mt-1.5 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", roleColor)}>
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Read-only info grid */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
          {t("settings.profile.accountInfo")}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <ReadOnlyRow icon="badge" label={t("settings.profile.fields.username")} value={profile?.username ?? ""} />
          <ReadOnlyRow icon="school" label={t("settings.profile.fields.studentCode")} value={profile?.studentCode ?? ""} />
          <ReadOnlyRow icon="mail" label={t("settings.profile.fields.email")} value={profile?.email ?? ""} />
          <ReadOnlyRow icon="manage_accounts" label={t("settings.profile.fields.role")} value={roleLabel} />
        </div>
      </div>

      {/* Editable form */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
          {t("settings.profile.editableInfo")}
        </p>
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              label={t("settings.profile.fields.fullName")}
              error={errors.fullName?.message}
              required
            >
              <Input
                {...register("fullName")}
                type="text"
                placeholder={t("settings.profile.fields.fullNamePlaceholder")}
                isError={!!errors.fullName}
                disabled={mutation.isPending}
              />
            </FormField>

            <FormField
              label={t("settings.profile.fields.phoneNumber")}
              error={errors.phoneNumber?.message}
              required
            >
              <Input
                {...register("phoneNumber")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={t("settings.profile.fields.phoneNumberPlaceholder")}
                isError={!!errors.phoneNumber}
                disabled={mutation.isPending}
              />
            </FormField>

            <div className="flex items-center justify-between gap-4 pt-1">
              <p className="text-xs text-on-surface-variant">
                {t("settings.profile.editNote")}
              </p>
              <Button
                type="submit"
                size="sm"
                disabled={mutation.isPending || !isDirty}
                isLoading={mutation.isPending}
              >
                {mutation.isPending
                  ? t("settings.profile.submit.saving")
                  : t("settings.profile.submit.save")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
