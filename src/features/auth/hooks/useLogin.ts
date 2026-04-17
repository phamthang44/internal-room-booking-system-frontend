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
    meta: { skipGlobalError: true },
    mutationFn: async (data: LoginRequest) => {
      return await authApi.login(data);
    },
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: async (response) => {
      try {
        const { accessToken, role } = response.data;

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
          // If fetching user profile fails, create minimal user object from token
          console.error("Failed to fetch user profile:", error);
          const tokenPayload = decodeJWT(accessToken);
          if (tokenPayload) {
            const user: User = {
              id: tokenPayload.userId || 0,
              fullName: tokenPayload.sub || "Unknown User",
              username: tokenPayload.sub || "",
              roleName: role || tokenPayload.role || "STUDENT",
              email: "",
              studentCode: "",
            };
            setUser(user);
          }
        }

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
