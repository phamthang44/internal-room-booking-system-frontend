import { useI18n } from "@shared/i18n/useI18n";

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-1">
      {(["en", "vi"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
            language === lang
              ? "bg-primary text-white"
              : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
          }`}
          title={lang.toUpperCase()}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
