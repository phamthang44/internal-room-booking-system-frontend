import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { useAuthStore } from "./useAuthStore";
import type { CredentialResponse } from "@react-oauth/google";

export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { setUser, setToken, setError, setLoading } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (credentialResponse: CredentialResponse) => {
      // Extract id_token from Google credential response
      if (!credentialResponse.credential) {
        throw new Error("No credential in response");
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
    onSuccess: (data) => {
      // Store token in localStorage (refreshToken stored in httpOnly cookie by backend)
      localStorage.setItem("authToken", data.accessToken);

      // Update auth state with user data
      setUser(data.user);
      setToken(data.accessToken);
      setLoading(false);

      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Google login failed. Please try again.";

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
