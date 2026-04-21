import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { apiClient } from "@core/api";
import { getAuthConfig } from "@core/api/helpers";
import { useAuthStore } from "./useAuthStore";
import { AUTH_ENDPOINTS } from "../constants/auth.constants";

export interface UserProfileData {
  id: number;
  fullName: string;
  username: string;
  roleName: string;
  email: string;
  studentCode: string;
  avatar?: string; // in case google returns avatar later
}

interface ProfileApiResponse {
  data: UserProfileData;
  meta: {
    apiVersion: string;
    message: string;
    serverTime: number;
    traceId: string;
  };
}

interface ProfileState {
  profile: UserProfileData | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  devtools(
    (set) => ({
      profile: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          // get token from auth store
          const { token } = useAuthStore.getState();
          if (!token) throw new Error("No authentication token found");

          // Note: apiClient already sends 'Accept-Language' based on i18n via its interceptor
          const response = await apiClient.get<ProfileApiResponse>(
            AUTH_ENDPOINTS.GET_CURRENT_USER,
            getAuthConfig(token)
          );

          set({ profile: response.data.data, isLoading: false, error: null });
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || "Failed to fetch profile", 
            isLoading: false,
            profile: null
          });
        }
      },

      clearProfile: () => set({ profile: null, error: null, isLoading: false }),
    }),
    { name: "ProfileStore" }
  )
);
