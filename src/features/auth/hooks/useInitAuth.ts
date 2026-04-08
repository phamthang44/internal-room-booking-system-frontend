import { useEffect } from "react";
import { useAuthStore } from "./useAuthStore";
import authApi from "../api/auth.api";
import apiClient from "@core/api/client";

/**
 * Initialize authentication on app load.
 *
 * This hook:
 * 1. Waits for Zustand to rehydrate from localStorage
 * 2. If no token exists but refresh token is in httpOnly cookie, attempts to refresh
 * 3. Ensures user session persists across page refreshes
 */
export const useInitAuth = () => {
  const { token, hasHydrated, setToken, setUser } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) {
      return; // Wait for store to rehydrate
    }

    // If token already exists, we're good
    if (token) {
      return;
    }

    // Token doesn't exist. Try to refresh using refresh token from httpOnly cookie
    const refreshToken = async () => {
      try {
        const response = await apiClient.post<{
          accessToken: string;
        }>("/auth/refresh");

        setToken(response.data.accessToken);
        
        // Fetch user profile after token refresh
        try {
          const userResponse = await authApi.getCurrentUser();
          setUser(userResponse.data);
        } catch (error) {
          console.error("Failed to fetch user profile after token refresh:", error);
        }
      } catch {
        // Refresh failed - user will be redirected to login by ProtectedRoute
        // This is expected if refresh token is expired or invalid
      }
    };

    refreshToken();
  }, [hasHydrated, token, setToken, setUser]);
};
