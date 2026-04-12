import { normalizeApiError } from "./normalizeApiError";
import { useAppToastStore } from "./appToastStore";

const DEDUPE_MS = 2500;
let lastFingerprint = "";
let lastAt = 0;

const fingerprint = (normalized: ReturnType<typeof normalizeApiError>): string =>
  `${normalized.status ?? "x"}|${normalized.titleI18nKey}|${normalized.message.slice(0, 120)}`;

/**
 * Shows a global toast for a normalized error. Dedupes rapid repeats (retries / double fire).
 */
export const presentAppError = (error: unknown): void => {
  const normalized = normalizeApiError(error);
  const fp = fingerprint(normalized);
  const now = Date.now();
  if (fp === lastFingerprint && now - lastAt < DEDUPE_MS) {
    return;
  }
  lastFingerprint = fp;
  lastAt = now;

  useAppToastStore.getState().push({
    titleI18nKey: normalized.titleI18nKey,
    message: normalized.message,
    traceId: normalized.traceId,
  });
};
