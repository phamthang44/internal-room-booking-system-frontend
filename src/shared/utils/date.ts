import {
  format,
  isToday,
  isTomorrow,
  differenceInHours,
  differenceInDays,
} from "date-fns";
import { enUS, vi } from "date-fns/locale";

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
  t: any,
  language: "en" | "vi" = "en",
): string {
  const date = new Date(timestamp);
  const now = new Date();

  const hoursDiff = differenceInHours(now, date);

  if (hoursDiff < 1) {
    return t("common.date.justNow");
  }

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
 * Formats a booking date into a localized display string (e.g., "Today", "Tomorrow", "Apr 15").
 *
 * @param dateString ISO date string
 * @param t i18n translation function
 * @param language Current language ("en" | "vi")
 */
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
