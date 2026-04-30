import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { useProfileStore } from "@features/auth";
import { Button } from "@shared/components/Button";

function SecurityCard({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">{title}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

export const SecuritySection = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const profile = useProfileStore((s) => s.profile);

  const handleChangePassword = () => {
    const email = profile?.email ?? "";
    navigate(`/forgot-password${email ? `?hint=${encodeURIComponent(email)}` : ""}`);
  };

  return (
    <div className="space-y-4">
      <SecurityCard
        icon="lock"
        title={t("settings.security.changePassword.title")}
        description={t("settings.security.changePassword.description")}
        action={
          <Button size="sm" variant="outline" onClick={handleChangePassword}>
            {t("settings.security.changePassword.action")}
          </Button>
        }
      />

      <SecurityCard
        icon="devices"
        title={t("settings.security.sessions.title")}
        description={t("settings.security.sessions.description")}
        action={
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-container px-3 py-1 text-xs font-bold text-on-tertiary-container">
            <span className="h-1.5 w-1.5 rounded-full bg-tertiary-fixed-dim" />
            {t("settings.security.sessions.active")}
          </span>
        }
      />
    </div>
  );
};
