import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User, AuthState } from "../types/auth.types";
import {
  clearAccessToken,
  setAccessToken,
  subscribeAccessToken,
} from "@core/auth/accessToken";

interface AuthStoreState extends AuthState {
  hasInitialized: boolean;
  // Actions
  setHasInitialized: (hasInitialized: boolean) => void;
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
    (set, get) => ({
      ...initialState,
      hasInitialized: false,

      setHasInitialized: (hasInitialized: boolean) => set({ hasInitialized }),

      setUser: (user: User | null) =>
        set({
          user,
          isAuthenticated: Boolean(user) || Boolean(get().token),
        }),

      setToken: (token: string | null) => {
        setAccessToken(token);
        set({
          token,
          isAuthenticated: Boolean(token),
        });
      },

      setLoading: (isLoading: boolean) => set({ isLoading }),

      setError: (error: string | null) => set({ error }),

      reset: () => {
        clearAccessToken();
        set(initialState);
      },

      clearAuth: () => {
        clearAccessToken();
        set(initialState);
      },
    }),
    { name: "AuthStore" },
  ),
);

// Keep Zustand token state in sync with the in-memory token used by axios.
subscribeAccessToken((token) => {
  const state = useAuthStore.getState();
  if (state.token === token) return;
  useAuthStore.setState({
    token,
    isAuthenticated: Boolean(token),
  });
});
