import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { useAuthStore } from "./useAuthStore";
import { useProfileStore } from "./useProfileStore";
import { useI18n } from "@shared/i18n/useI18n";
import type { CredentialResponse } from "@react-oauth/google";
import type { LoginResponseData, User } from "../types/auth.types";

export type GoogleAuthError =
  | "USER_NOT_FOUND"
  | "INVALID_TOKEN"
  | "NETWORK_ERROR"
  | "UNKNOWN";

/**
 * Hook for Google OAuth authentication
 * Handles credential response from @react-oauth/google library
 * Exchanges ID Token with backend and manages state
 *
 * Security:
 * - Never stores token in localStorage (XSS vulnerability)
 * - Stores accessToken in memory via Zustand store only
 * - Stores refreshToken in httpOnly cookie via backend response
 *
 * Usage:
 * const { googleLogin, isLoading, error } = useGoogleLogin()
 * googleLogin(credentialResponse)
 */
export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setUser, setToken, setError, setLoading } = useAuthStore();

  const mutation = useMutation({
    meta: { skipGlobalError: true },
    mutationFn: async (credentialResponse: CredentialResponse) => {
      // Extract id_token from Google credential response
      if (!credentialResponse.credential) {
        throw new Error("INVALID_TOKEN");
      }

      // Send id_token to backend via POST (never GET) with secure body
      return await authApi.googleLogin({
        idToken: credentialResponse.credential,
      });
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: async (data) => {
      try {
        // Extract data from ApiResponse wrapper
        const responseData: LoginResponseData = data.data;
        const { accessToken, role } = responseData;

        useProfileStore.getState().clearProfile();

        // NOTE: Do NOT store accessToken in localStorage (XSS vulnerability)
        // Keep in memory via Zustand store only
        // Backend handles refreshToken in httpOnly cookie automatically

        // Store the token first so subsequent API calls can use it
        setToken(accessToken);

        // Fetch full user profile from /users/me
        try {
          const userResponse = await authApi.getCurrentUser();
          setUser(userResponse.data);
        } catch (error) {
          // If fetching user profile fails, create minimal user object
          console.error("Failed to fetch user profile:", error);
          const user: User = {
            id: 0,
            fullName: "Unknown User",
            username: "",
            roleName: role || "STUDENT",
            email: "",
            studentCode: "",
          };
          setUser(user);
        }

        setLoading(false);

        // Redirect to loading screen for consistent post-login flow
        navigate("/loading");
      } catch (error) {
        const errorMessage = "Failed to process authentication response";
        setError(errorMessage);
        setLoading(false);
      }
    },
    onError: (error: any) => {
      const errorCode: GoogleAuthError = categorizeError(error);
      const backendMessage =
        error?.response?.data?.error?.message || error?.response?.data?.message;
      const fallbackMessage = getErrorMessage(errorCode, t);
      const errorMessage = backendMessage || fallbackMessage;

      setError(errorMessage);
      setLoading(false);
    },
  });

  return {
    googleLogin: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};

/**
 * Categorize OAuth errors based on backend response or error type
 */
function categorizeError(error: any): GoogleAuthError {
  const code =
    error?.response?.data?.error?.code || error?.response?.data?.code;
  const status = error?.response?.status;
  const message = error?.message?.toLowerCase() || "";

  // Backend-specific error codes (from server)
  if (code === "USER_NOT_FOUND") {
    return "USER_NOT_FOUND";
  }
  if (code === "AUTH_014") {
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
  if (status === 403) {
    return "INVALID_TOKEN";
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
