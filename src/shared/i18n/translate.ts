import { en } from "./translations/en";
import { vi } from "./translations/vi";

export type Language = "en" | "vi";

/** Values substituted for `{{key}}` placeholders in translation strings. */
export type TranslationParams = Record<string, string | number>;

const translations = { en, vi };

const getNestedValue = (obj: any, path: string): string => {
  return (
    path.split(".").reduce((current, prop) => current?.[prop], obj) ?? path
  );
};

const interpolate = (template: string, params: TranslationParams): string =>
  template.replace(/\{\{(\w+)\}\}/g, (_, name: string) => {
    const v = params[name];
    return v !== undefined && v !== null ? String(v) : `{{${name}}}`;
  });

export function getLanguageFromStorage(): Language {
  if (typeof localStorage === "undefined") return "en";
  const saved = localStorage.getItem("language");
  return saved === "vi" ? "vi" : "en";
}

/**
 * Resolve a translation key outside React (e.g. toasts). Pass `language` to match
 * the in-app locale; defaults to the same `language` key used by `I18nProvider`.
 */
export function translate(
  key: string,
  params?: TranslationParams,
  language: Language = getLanguageFromStorage(),
): string {
  const value = getNestedValue(translations[language], key);
  if (typeof value !== "string") return key;
  return params ? interpolate(value, params) : value;
}
