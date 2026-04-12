/**
 * Extract user-facing message from API / Axios errors (shared across features).
 */

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, string>;
    traceId?: string;
  };
  message?: string;
  meta?: { traceId?: string };
}

export const extractApiErrorMessage = (error: unknown): string => {
  try {
    const err = error as { response?: { data?: ApiErrorResponse }; message?: string };
    const data = err?.response?.data;

    if (!data) {
      return err?.message || "An error occurred. Please try again.";
    }

    if (data.error?.details) {
      const fieldErrors = Object.values(data.error.details);
      if (fieldErrors.length > 0) return fieldErrors[0]!;
    }

    if (data.error?.message) return data.error.message;
    if (data.message) return data.message;

    return "An error occurred. Please try again.";
  } catch {
    return error instanceof Error
      ? error.message
      : "An error occurred. Please try again.";
  }
};

export const getApiErrorCode = (error: unknown): string | undefined => {
  return (error as { response?: { data?: ApiErrorResponse } })?.response?.data?.error
    ?.code;
};

export const isValidationApiError = (error: unknown): boolean => {
  return (
    getApiErrorCode(error)?.includes("SYS_005") === true ||
    !!(error as { response?: { data?: ApiErrorResponse } })?.response?.data?.error
      ?.details
  );
};
