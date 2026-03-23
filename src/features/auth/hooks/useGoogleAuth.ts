import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { useAuthStore } from "./useAuthStore";
import { useI18n } from "@shared/i18n/useI18n";
import { decodeJWT } from "../utils/jwt";
import type { User } from "../types/auth.types";

export type GoogleAuthError =
  | "USER_NOT_FOUND"
  | "INVALID_TOKEN"
  | "NETWORK_ERROR"
  | "UNKNOWN";

/**
 * Hook for Google OAuth authentication
 * Handles token exchange with backend and state management
 *
 * Usage:
 * const { authenticate, isLoading, error, errorType } = useGoogleAuth()
 * authenticate(idToken)
 */
export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setUser, setToken, setError, setLoading } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (idToken: string) => {
      if (!idToken || typeof idToken !== "string") {
        throw new Error("INVALID_TOKEN");
      }
      // Send id_token to backend for validation and exchange
      return await authApi.googleLogin({ idToken });
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      try {
        const { accessToken, refreshToken, role } = response.data;

        // NOTE: Do NOT store accessToken in localStorage (XSS vulnerability)
        // Keep in memory via Zustand store only
        // Backend handles refreshToken in httpOnly cookie automatically

        // Decode JWT to extract user information
        const tokenPayload = decodeJWT(accessToken);
        if (!tokenPayload) {
          throw new Error("Failed to decode authentication token");
        }

        // Create user object from token data
        const user: User = {
          id: tokenPayload.userId?.toString() || "",
          username: tokenPayload.sub || "",
          role: role || tokenPayload.role || "STUDENT",
        };

        // Update auth state (stored in memory via Zustand)
        setUser(user);
        setToken(accessToken); // Stored in Zustand, not localStorage
        setLoading(false);

        // Redirect to loading screen first, then to home page
        navigate("/loading");
      } catch (error) {
        const errorCode: GoogleAuthError = "UNKNOWN";
        const errorMessage = getErrorMessage(errorCode, t);
        setError(errorMessage);
        setLoading(false);
      }
    },
    onError: (error: any) => {
      const errorCode: GoogleAuthError = categorizeError(error);
      const errorMessage = getErrorMessage(errorCode, t);

      setError(errorMessage);
      setLoading(false);
    },
  });

  return {
    authenticate: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

/**
 * Categorize OAuth errors based on backend response or error type
 */
function categorizeError(error: any): GoogleAuthError {
  const code = error?.response?.data?.code;
  const status = error?.response?.status;
  const message = error?.message?.toLowerCase() || "";

  // Backend-specific error codes (from server)
  if (code === "USER_NOT_FOUND") {
    return "USER_NOT_FOUND";
  }
  if (code === "INVALID_TOKEN") {
    return "INVALID_TOKEN";
  }

  // HTTP status codes
  if (status >= 500) {
    return "NETWORK_ERROR";
  }
  if (status === 400 || status === 401) {
    return "INVALID_TOKEN";
  }
  if (status === 404) {
    return "USER_NOT_FOUND";
  }

  // Network errors
  if (message.includes("network") || message.includes("enotfound")) {
    return "NETWORK_ERROR";
  }
  if (message.includes("timeout")) {
    return "NETWORK_ERROR";
  }

  return "UNKNOWN";
}

/**
 * Get user-facing error message based on error type
 */
function getErrorMessage(
  errorType: GoogleAuthError,
  t: (key: string) => string,
): string {
  const errorMessages: Record<GoogleAuthError, string> = {
    USER_NOT_FOUND: t("auth.login.oauth.error.userNotFound"),
    INVALID_TOKEN: t("auth.login.oauth.error.invalidToken"),
    NETWORK_ERROR: t("auth.login.oauth.error.network"),
    UNKNOWN: t("auth.login.oauth.error.unknown"),
  };

  return errorMessages[errorType];
}
