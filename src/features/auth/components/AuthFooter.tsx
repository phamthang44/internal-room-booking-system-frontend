import { useI18n } from "@shared/i18n/useI18n";

export const AuthFooter = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 w-full py-8 border-t border-outline-variant/10 fixed bottom-0 left-0 right-0">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4">
        <p className="font-body text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {t("common.copyright")}
        </p>
        <div className="flex gap-6">
          <a
            href="#security"
            className="font-body text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all opacity-80 hover:opacity-100"
          >
            {t("common.security")}
          </a>
          <a
            href="#terms"
            className="font-body text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all opacity-80 hover:opacity-100"
          >
            {t("common.terms")}
          </a>
          <a
            href="#support"
            className="font-body text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all opacity-80 hover:opacity-100"
          >
            {t("common.support")}
          </a>
        </div>
      </div>
    </footer>
  );
};
