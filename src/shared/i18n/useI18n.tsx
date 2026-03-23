import { createContext, useContext, useState, type ReactNode } from "react";
import { en } from "./translations/en";
import { vi } from "./translations/vi";

type Language = "en" | "vi";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = { en, vi };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Get nested value from object using dot notation
const getNestedValue = (obj: any, path: string): string => {
  return (
    path.split(".").reduce((current, prop) => current?.[prop], obj) ?? path
  );
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to get from localStorage
    const saved = localStorage.getItem("language");
    if (saved === "en" || saved === "vi") {
      return saved;
    }
    // Default to English
    return "en";
  });

  // Save to localStorage on change
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    // Emit event for components to listen to
    window.dispatchEvent(
      new CustomEvent("languageChange", { detail: { language: lang } }),
    );
  };

  // Translation function
  const t = (key: string): string => {
    const value = getNestedValue(translations[language], key);
    return typeof value === "string" ? value : key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
};
