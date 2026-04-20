import type { QueryClient } from "@tanstack/react-query";

const DEBOUNCE_MS = 400;

/**
 * Debounced invalidation for booking-related queries after realtime messages.
 */
export function createDebouncedBookingInvalidator(queryClient: QueryClient) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = undefined;
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({
        queryKey: ["student-dashboard-recent-activity"],
      });
      void queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
    }, DEBOUNCE_MS);
  };
}
