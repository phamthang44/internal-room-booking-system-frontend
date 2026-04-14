import { useAppToastStore } from "./appToastStore";

/**
 * Shows a global success toast.
 * Keep it lightweight (no dedupe needed for success cases).
 */
export const presentAppSuccess = (message: string): void => {
  useAppToastStore.getState().push({
    tone: "success",
    titleI18nKey: "common.toast.successTitle",
    message,
  });
};

