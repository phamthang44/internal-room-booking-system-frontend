import {
  format,
  isToday,
  isTomorrow,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";
import {
  translate,
  getLanguageFromStorage,
  type TranslationParams,
} from "@shared/i18n/translate";

const locales = {
  en: enUS,
  vi: vi,
};

/**
 * Formats a timestamp into a localized relative time string (e.g., "Just now", "2 hours ago", "Yesterday").
 *
 * @param timestamp ISO date string
 * @param t i18n translation function
 * @param language Current language ("en" | "vi")
 */
export function getRelativeTime(
  timestamp: string,
  t: (key: string, params?: TranslationParams) => string,
  language: "en" | "vi" = "en",
): string {
  const date = new Date(timestamp);
  const now = new Date();

  if (Number.isNaN(date.getTime())) {
    return t("common.date.justNow");
  }

  const minutesDiff = differenceInMinutes(now, date);

  if (minutesDiff < 1) {
    return t("common.date.justNow");
  }

  if (minutesDiff < 60) {
    if (minutesDiff === 1) {
      return t("common.date.minuteAgo");
    }
    return t("common.date.minutesAgo", { count: minutesDiff });
  }

  const hoursDiff = differenceInHours(now, date);

  if (hoursDiff < 24) {
    if (hoursDiff === 1) {
      return t("common.date.hourAgo");
    }
    return t("common.date.hoursAgo", { count: hoursDiff });
  }

  const daysDiff = differenceInDays(now, date);

  if (daysDiff === 1) {
    return t("common.date.yesterday");
  }

  if (daysDiff < 7) {
    return t("common.date.daysAgo", { count: daysDiff });
  }

  // Fallback to absolute date for older activities
  return format(date, "MMM d", { locale: locales[language] });
}

/**
 * Relative time for non-React code (e.g. STOMP toast captions). Uses the same
 * strings as {@link getRelativeTime} and the active UI language from storage.
 */
export function formatIsoRelativeCaption(iso: string): string | undefined {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  const language = getLanguageFromStorage();
  const t = (key: string, params?: TranslationParams) =>
    translate(key, params, language);
  return getRelativeTime(iso, t, language);
}

/**
 * Formats a booking date into a localized display string (e.g., "Today", "Tomorrow", "Apr 15").
 *
 * @param dateString ISO date string
 * @param t i18n translation function
 * @param language Current language ("en" | "vi")
 */
/**
 * Whether `dateString` falls on today's calendar day in the local timezone.
 * Use to gate same-day actions (e.g. check-in) on dashboard rows.
 */
export function isBookingDateToday(dateString: string): boolean {
  const trimmed = dateString.trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? parseISO(trimmed)
    : new Date(trimmed);
  if (Number.isNaN(date.getTime())) return false;
  return isToday(date);
}

export function formatDisplayDate(
  dateString: string,
  t: any,
  language: "en" | "vi" = "en",
): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return t("common.date.today");
  }

  if (isTomorrow(date)) {
    return t("common.date.tomorrow");
  }

  return format(date, "MMM d", { locale: locales[language] });
}
