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
    if (uid != null && uid > 0) {
      return [...fromEnv, `/topic/notifications/${uid}`];
    }
    return fromEnv;
  }, [user?.id]);

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
        const body = msg.body;
        if (typeof body === "string") {
          const notification = parseBookingNotificationPayload(body);
          if (notification) {
            presentBookingNotification(notification);
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
