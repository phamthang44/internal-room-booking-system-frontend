import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { useAuthStore } from "./useAuthStore";
import { extractErrorMessage } from "../utils/errorExtractor";
import { decodeJWT } from "../utils/jwt";
import type { LoginRequest, User } from "../types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setError, setLoading } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (data: LoginRequest) => {
      return await authApi.login(data);
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
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to process login response";
        setError(errorMessage);
        setLoading(false);
      }
    },
    onError: (error: any) => {
      const errorMessage = extractErrorMessage(error);

      setError(errorMessage);
      setLoading(false);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
