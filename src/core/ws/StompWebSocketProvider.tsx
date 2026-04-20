import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@features/auth";
import { getStompBrokerUrl } from "./brokerUrl";
import { parseSubscribeDestinations } from "./parseSubscribeDestinations";
import { startStompSession } from "./stompSession";
import { createDebouncedBookingInvalidator } from "./invalidateBookingQueries";
import { parseBookingNotificationPayload, presentBookingNotification } from "./bookingNotification";
import { notificationsQueryKeys } from "@features/notifications";
import { adminApprovalsQueryKeys } from "@features/approvals/hooks/useAdminApprovalsQueries";

export interface StompDebugValue {
  brokerConfigured: boolean;
  connected: boolean;
  destinationCount: number;
  lastMessagePreview: string | null;
}

const StompDebugContext = createContext<StompDebugValue | null>(null);

/** Dev / diagnostics: connection summary when `StompWebSocketProvider` is mounted. */
export function useStompDebug(): StompDebugValue | null {
  return useContext(StompDebugContext);
}

export function StompWebSocketProvider({ children }: { readonly children: ReactNode }) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const brokerURL = useMemo(() => getStompBrokerUrl(), []);
  const destinations = useMemo(() => {
    const fromEnv = parseSubscribeDestinations();
    const uid = user?.id;
    const role = user?.roleName;
    const isAdminOrStaff =
      role === "ADMIN" || role === "FACILITY_STAFF" || role === "MANAGER";

    const all = new Set<string>(fromEnv);
    if (uid != null && uid > 0) {
      all.add(`/topic/notifications/${uid}`);
    }
    if (isAdminOrStaff) {
      all.add("/topic/admin/bookings");
    }
    return Array.from(all);
  }, [user?.id, user?.roleName]);

  const [connected, setConnected] = useState(false);
  const [lastMessagePreview, setLastMessagePreview] = useState<string | null>(null);

  const invalidate = useMemo(
    () => createDebouncedBookingInvalidator(queryClient),
    [queryClient],
  );

  useEffect(() => {
    if (!brokerURL || !token) {
      setConnected(false);
      return;
    }

    if (destinations.length === 0 && import.meta.env.DEV) {
      console.info(
        "[STOMP] No subscriptions (set VITE_STOMP_SUBSCRIBE_DESTINATIONS and/or log in with a user id).",
      );
    }

    const teardown = startStompSession({
      brokerURL,
      token,
      destinations,
      onMessage: (msg) => {
        const destination = msg.headers?.destination ?? "";
        const body = msg.body;
        // Admin dashboard realtime: invalidate on any admin-bookings message,
        // regardless of payload shape (admin payload may differ from student payload).
        if (destination.includes("/topic/admin/bookings")) {
          void queryClient.invalidateQueries({ queryKey: adminApprovalsQueryKeys.all });
        }

        // Toasts: only present for the per-user notifications topic to avoid duplicate toasts
        // when admins/staff also receive the same event on `/topic/admin/bookings`.
        const shouldPresentToast = destination.includes("/topic/notifications/");

        if (shouldPresentToast && typeof body === "string") {
          const notification = parseBookingNotificationPayload(body);
          if (notification) {
            presentBookingNotification(notification);
            void queryClient.invalidateQueries({ queryKey: notificationsQueryKeys.all });
          }
        }
        const preview =
          typeof body === "string"
            ? body.length > 200
              ? `${body.slice(0, 200)}…`
              : body
            : "";
        if (preview) setLastMessagePreview(preview);
        invalidate();
      },
      onConnectionChange: setConnected,
    });

    return () => {
      void teardown();
    };
  }, [brokerURL, token, destinations, invalidate]);

  const debugValue: StompDebugValue = useMemo(
    () => ({
      brokerConfigured: Boolean(brokerURL),
      connected,
      destinationCount: destinations.length,
      lastMessagePreview,
    }),
    [brokerURL, connected, destinations.length, lastMessagePreview],
  );

  return (
    <StompDebugContext.Provider value={debugValue}>{children}</StompDebugContext.Provider>
  );
}
