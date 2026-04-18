import {
  Client,
  ReconnectionTimeMode,
  type IMessage,
  type StompSubscription,
} from "@stomp/stompjs";

export interface StompSessionOptions {
  brokerURL: string;
  /** Sent as `Authorization: Bearer …` when set. */
  token: string | null;
  destinations: string[];
  onMessage: (message: IMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
}

/**
 * Single STOMP client: exponential backoff reconnect (via @stomp/stompjs), subscribe on each connect.
 */
export function startStompSession(options: StompSessionOptions): () => Promise<void> {
  const client = new Client({
    brokerURL: options.brokerURL,
    reconnectDelay: 2000,
    maxReconnectDelay: 60_000,
    reconnectTimeMode: ReconnectionTimeMode.EXPONENTIAL,
    connectionTimeout: 15_000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  let activeSubs: StompSubscription[] = [];

  const applyAuthHeaders = () => {
    const headers: Record<string, string> = {};
    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }
    client.connectHeaders = headers;
  };

  client.beforeConnect = () => {
    applyAuthHeaders();
  };

  client.onConnect = () => {
    for (const s of activeSubs) {
      try {
        s.unsubscribe();
      } catch {
        /* ignore */
      }
    }
    activeSubs = [];

    options.onConnectionChange?.(true);

    for (const destination of options.destinations) {
      const sub = client.subscribe(destination, (msg) => options.onMessage(msg));
      activeSubs.push(sub);
    }
  };

  client.onDisconnect = () => {
    options.onConnectionChange?.(false);
  };

  client.onStompError = (frame) => {
    if (import.meta.env.DEV) {
      const msg = frame.headers["message"] ?? frame.body;
      console.warn("[STOMP] broker error:", msg);
    }
  };

  applyAuthHeaders();
  client.activate();

  return () => client.deactivate();
}
