import axios from "axios";
import { extractApiErrorMessage } from "./extractApiErrorMessage";

export interface NormalizedAppError {
  /** HTTP status when available */
  status: number | null;
  /** User-facing detail (prefer backend message) */
  message: string;
  traceId?: string;
  /** i18n key for toast title */
  titleI18nKey: string;
}

interface ErrorBody {
  error?: { traceId?: string };
  meta?: { traceId?: string };
  traceId?: string;
}

const titleKeyForStatus = (status: number): string => {
  if (status === 401 || status === 403 || status === 404) {
    return `common.errors.http.${status}.title`;
  }
  if (status >= 500) return "common.errors.http.500.title";
  if (status === 408 || status === 504) return "common.errors.toast.timeoutTitle";
  if (status === 429) return "common.errors.toast.rateLimitTitle";
  return "common.errors.toast.genericTitle";
};

export const normalizeApiError = (error: unknown): NormalizedAppError => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorBody | undefined;
    const traceId =
      data?.meta?.traceId ?? data?.error?.traceId ?? data?.traceId;

    if (!error.response) {
      return {
        status: null,
        message: extractApiErrorMessage(error),
        traceId,
        titleI18nKey:
          error.code === "ECONNABORTED"
            ? "common.errors.toast.timeoutTitle"
            : "common.errors.toast.networkTitle",
      };
    }

    const status = error.response.status;
    return {
      status,
      message: extractApiErrorMessage(error),
      traceId,
      titleI18nKey: titleKeyForStatus(status),
    };
  }

  if (error instanceof Error) {
    return {
      status: null,
      message: error.message,
      titleI18nKey: "common.errors.toast.genericTitle",
    };
  }

  return {
    status: null,
    message: String(error),
    titleI18nKey: "common.errors.toast.genericTitle",
  };
};
