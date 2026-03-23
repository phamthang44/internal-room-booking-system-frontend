import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import authApi from "../api/auth.api";
import { useAuthStore } from "./useAuthStore";
import type { LoginRequest } from "../types/auth.types";

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
    onSuccess: (data) => {
      // Store token in localStorage and auth store
      localStorage.setItem("authToken", data.accessToken);

      // Update auth state
      setUser(data.user);
      setToken(data.accessToken);
      setLoading(false);

      // Redirect to dashboard
      navigate("/dashboard");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Login failed. Please try again.";

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
