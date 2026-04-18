/**
 * Reads `import.meta.env.VITE_STOMP_BROKER_URL`.
 * Expects native WebSocket URLs: `ws://…` or `wss://…` (use `wss` in production).
 */
export function getStompBrokerUrl(): string | null {
  const raw = import.meta.env.VITE_STOMP_BROKER_URL;
  if (raw == null || String(raw).trim() === "") return null;

  const url = String(raw).trim();

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") {
      if (import.meta.env.DEV) {
        console.warn(
          "[STOMP] VITE_STOMP_BROKER_URL must use ws: or wss: protocol. WebSocket disabled.",
        );
      }
      return null;
    }
    return url;
  } catch {
    if (import.meta.env.DEV) {
      console.warn(
        "[STOMP] VITE_STOMP_BROKER_URL is not a valid URL. WebSocket disabled.",
      );
    }
    return null;
  }
}
