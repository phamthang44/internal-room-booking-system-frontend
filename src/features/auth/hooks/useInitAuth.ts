import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import authApi from "../api/auth.api";

/**
 * Initialize authentication on app load.
 *
 * This hook:
 * 1. Waits for Zustand to rehydrate from localStorage
 * 2. If no token exists but refresh token is in httpOnly cookie, attempts to refresh
 * 3. Ensures user session persists across page refreshes
 *
 * NOTE: Uses `refreshClient` (raw axios) instead of `apiClient` so that a
 * 401 response from /auth/refresh does NOT trigger the interceptor's own
 * refresh logic, which would cause a loop.
 */
export const useInitAuth = () => {
  const { token, hasInitialized, setHasInitialized, setToken, setUser, setLoading } =
    useAuthStore();

  useEffect(() => {
    if (hasInitialized) return;

    // If token already exists, we're good
    if (token) {
      setHasInitialized(true);
      return;
    }

    // Token doesn't exist. Try to refresh using refresh token from httpOnly cookie
    const initRefresh = async () => {
      try {
        setLoading(true);
        const refreshResponse = await authApi.refreshToken();
        const { accessToken } = refreshResponse.data;
        setToken(accessToken);

        // Fetch user profile after token refresh
        try {
          const userResponse = await authApi.getCurrentUser();
          setUser(userResponse.data);
        } catch (profileError) {
          console.error(
            "Failed to fetch user profile after token refresh:",
            profileError,
          );
        }
      } catch {
        // Refresh failed — user will be redirected to login by ProtectedRoute.
        // This is expected if the refresh token is expired or not present in
        // the httpOnly cookie.
      } finally {
        setLoading(false);
        setHasInitialized(true);
      }
    };

    initRefresh();
  }, [hasInitialized, token, setHasInitialized, setToken, setUser, setLoading]);
};
