import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, AuthState } from "../types/auth.types";

interface AuthStoreState extends AuthState {
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStoreState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) =>
          set({
            user,
            isAuthenticated: Boolean(user),
          }),

        setToken: (token) =>
          set({
            token,
            isAuthenticated: Boolean(token),
          }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error }),

        reset: () => set(initialState),

        clearAuth: () => set(initialState),
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);
