import { useI18n } from "@shared/i18n/useI18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const AuthHeader = () => {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 w-full z-40 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-outline-variant/10">
      <div className="text-xl font-bold text-primary dark:text-white font-headline tracking-tight">
        {t("common.appName")}
      </div>
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-slate-200/50 transition-colors active:scale-95 text-slate-500 cursor-pointer"
          title={t("common.help")}
        >
          <span className="material-symbols-outlined text-xl">
            help_outline
          </span>
        </button>
        <LanguageSwitcher />
      </div>
    </header>
  );
};
