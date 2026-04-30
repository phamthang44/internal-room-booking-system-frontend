import { useI18n } from "@shared/i18n/useI18n";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@shared/utils/cn";

function PreferenceRow({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-on-surface">{title}</p>
          <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0 pl-14 sm:pl-0">{children}</div>
    </div>
  );
}

export const AppearanceSection = () => {
  const { t, language, setLanguage } = useI18n();
  const queryClient = useQueryClient();

  const handleLanguageChange = (lang: "en" | "vi") => {
    if (language === lang) return;
    setLanguage(lang);
    queryClient.invalidateQueries();
  };

  return (
    <div className="space-y-4">
      <PreferenceRow
        icon="translate"
        title={t("settings.appearance.language.title")}
        description={t("settings.appearance.language.description")}
      >
        <div className="flex w-full items-center gap-1 rounded-xl bg-surface-container p-1 sm:w-auto">
          {(["en", "vi"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={cn(
                "flex-1 rounded-lg px-4 py-1.5 text-sm font-bold transition-all sm:flex-none",
                language === lang
                  ? "bg-primary text-on-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface",
              )}
            >
              {lang === "en" ? "English" : "Tiếng Việt"}
            </button>
          ))}
        </div>
      </PreferenceRow>

      <PreferenceRow
        icon="dark_mode"
        title={t("settings.appearance.theme.title")}
        description={t("settings.appearance.theme.description")}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-xs font-bold text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">construction</span>
          {t("settings.appearance.theme.comingSoon")}
        </span>
      </PreferenceRow>
    </div>
  );
};
