/**
 * Comma-separated STOMP destinations from `VITE_STOMP_SUBSCRIBE_DESTINATIONS`
 * (e.g. `/topic/bookings,/user/queue/updates`). Whitespace is trimmed; empty entries skipped.
 */
export function parseSubscribeDestinations(): string[] {
  const raw = import.meta.env.VITE_STOMP_SUBSCRIBE_DESTINATIONS;
  if (raw == null || String(raw).trim() === "") return [];

  return String(raw)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
