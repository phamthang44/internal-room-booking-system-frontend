import axios from "axios";
import { extractApiErrorMessage } from "@shared/errors/extractApiErrorMessage";

export function extractAdminRoomsErrorCode(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const d = error.response?.data as {
    errorCode?: string;
    error?: { code?: string };
  };
  return d?.errorCode ?? d?.error?.code;
}

/**
 * Prefer known backend codes mapped in i18n; otherwise use normalized API message.
 */
export function messageForAdminRoomsError(
  error: unknown,
  translate: (key: string) => string,
): string {
  const code = extractAdminRoomsErrorCode(error);
  if (code) {
    const key = `adminRooms.errors.codes.${code}`;
    const resolved = translate(key);
    if (resolved !== key) {
      return resolved;
    }
  }
  return extractApiErrorMessage(error);
}
