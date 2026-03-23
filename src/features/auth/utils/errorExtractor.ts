/**
 * Error Extractor for API Responses
 *
 * Handles the poorly-designed API error responses and extracts
 * the most specific and user-friendly error message.
 *
 * Problematic response format:
 * {
 *   "error": {
 *     "code": "SYS_005",
 *     "message": "Generic message",
 *     "details": {
 *       "field": "Specific field error"
 *     }
 *   }
 * }
 *
 * This extracts the specific field error instead of the generic message.
 */

interface ApiErrorResponse {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, string>;
  };
  message?: string;
}

/**
 * Extract the most specific error message from API response
 * Priority: specific field error > generic message > default
 */
export const extractErrorMessage = (error: any): string => {
  try {
    // Check if it's an axios error with response data
    const data: ApiErrorResponse = error?.response?.data;

    if (!data) {
      return error?.message || "An error occurred. Please try again.";
    }

    // Priority 1: Check for specific field errors in details
    if (data.error?.details) {
      const fieldErrors = Object.values(data.error.details);
      if (fieldErrors && fieldErrors.length > 0) {
        // Return the first specific field error
        return fieldErrors[0];
      }
    }

    // Priority 2: Use generic message from error object
    if (data.error?.message) {
      return data.error.message;
    }

    // Priority 3: Fallback to top-level message
    if (data.message) {
      return data.message;
    }

    // Priority 4: Default message
    return "An error occurred. Please try again.";
  } catch {
    return error?.message || "An error occurred. Please try again.";
  }
};

/**
 * Get error code for categorization
 * Useful for handling specific error types differently
 */
export const getErrorCode = (error: any): string | undefined => {
  return error?.response?.data?.error?.code;
};

/**
 * Check if error is a validation/field error
 */
export const isValidationError = (error: any): boolean => {
  return (
    getErrorCode(error)?.includes("SYS_005") ||
    !!error?.response?.data?.error?.details
  );
};
