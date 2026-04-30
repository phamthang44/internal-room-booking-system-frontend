import apiClient from "@core/api/client";
import type { UpdateProfilePayload, UpdateProfileResponse } from "../types/settings.types";
import type { ApiResponse } from "@features/auth/types/auth.types";

// TODO: wire to PUT /api/v1/profile once backend endpoint is ready
const SETTINGS_ENDPOINTS = {
  UPDATE_PROFILE: "/profile",
} as const;

export const settingsApi = {
  updateProfile: async (payload: UpdateProfilePayload): Promise<string> => {
    const response = await apiClient.put<ApiResponse<UpdateProfileResponse>>(
      SETTINGS_ENDPOINTS.UPDATE_PROFILE,
      payload,
    );
    return response.data.meta.message;
  },
};
