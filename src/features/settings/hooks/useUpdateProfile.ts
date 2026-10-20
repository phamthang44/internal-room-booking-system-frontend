import { useMutation } from "@tanstack/react-query";
import { useProfileStore } from "@features/auth";
import { settingsApi } from "../api/settings.api";
import type { UpdateProfilePayload } from "../types/settings.types";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { presentAppError } from "@shared/errors/presentAppError";

export function useUpdateProfile() {
  const fetchProfile = useProfileStore((s) => s.fetchProfile);

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => settingsApi.updateProfile(payload),
    meta: { skipGlobalError: true },
    onSuccess: async ({ message }) => {
      presentAppSuccess(message ?? "Profile updated successfully.");
      await fetchProfile();
    },
    onError: (error) => {
      presentAppError(error);
    },
  });
}
