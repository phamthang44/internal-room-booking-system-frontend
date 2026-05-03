import apiClient from "@core/api/client";
import type { ApiResponse, UserProfileResponse } from "@features/auth/types/auth.types";
import type { UpdateProfilePayload } from "../types/settings.types";

const SETTINGS_ENDPOINTS = {
  UPDATE_PROFILE: "/profile",
} as const;

export const settingsApi = {
  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<{ profile: UserProfileResponse; message: string }> => {
    const response = await apiClient.put<ApiResponse<UserProfileResponse>>(
      SETTINGS_ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return {
      profile: response.data.data,
      message: response.data.meta.message,
    };
  },
};
