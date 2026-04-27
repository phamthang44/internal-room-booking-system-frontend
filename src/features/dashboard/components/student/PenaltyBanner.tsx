import { useI18n } from "@shared/i18n/useI18n";

type PenaltyLevel = "WARNING" | "REQUIRE_APPROVAL" | "BAN_TEMP" | "PERMANENT_BAN";

export const PenaltyBanner = (props: {
  hasPenalty?: boolean;
  penaltyLevel?: PenaltyLevel;
  penaltyExpiresAt?: string;
}) => {
  const { t, language } = useI18n();

  if (!props.hasPenalty) return null;

  const level = props.penaltyLevel ?? "WARNING";
  const ui = getPenaltyUi(level);
  const expiresAtText = props.penaltyExpiresAt
    ? formatExpiresAt(props.penaltyExpiresAt, language)
    : null;

  return (
    <section className={`rounded-2xl border p-5 ${ui.containerClass}`}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 ${ui.iconClass}`}>
          <span className="material-symbols-outlined" data-icon={ui.icon}>
            {ui.icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-headline font-extrabold tracking-tight text-on-surface">
            {t(ui.titleKey)}
          </p>
          <p className="text-sm font-body text-on-surface-variant mt-0.5">
            {t(ui.messageKey)}
            {expiresAtText ? ` ${t("dashboard.penalty.until", { value: expiresAtText })}` : ""}
          </p>
        </div>
      </div>
    </section>
  );
};

function getPenaltyUi(level: PenaltyLevel) {
  switch (level) {
    case "REQUIRE_APPROVAL":
      return {
        icon: "verified_user",
        iconClass: "text-amber-700",
        containerClass: "border-amber-200 bg-amber-50/60",
        titleKey: "dashboard.penalty.titles.requireApproval",
        messageKey: "dashboard.penalty.messages.requireApproval",
      } as const;
    case "BAN_TEMP":
      return {
        icon: "block",
        iconClass: "text-error",
        containerClass: "border-error-container bg-error-container/20",
        titleKey: "dashboard.penalty.titles.tempBan",
        messageKey: "dashboard.penalty.messages.tempBan",
      } as const;
    case "PERMANENT_BAN":
      return {
        icon: "gpp_maybe",
        iconClass: "text-error",
        containerClass: "border-error-container bg-error-container/20",
        titleKey: "dashboard.penalty.titles.permanentBan",
        messageKey: "dashboard.penalty.messages.permanentBan",
      } as const;
    case "WARNING":
    default:
      return {
        icon: "warning",
        iconClass: "text-amber-700",
        containerClass: "border-amber-200 bg-amber-50/60",
        titleKey: "dashboard.penalty.titles.warning",
        messageKey: "dashboard.penalty.messages.warning",
      } as const;
  }
}

function formatExpiresAt(value: string, language: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat(language === "vi" ? "vi-VN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

