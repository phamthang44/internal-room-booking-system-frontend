/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_GOOGLE_REDIRECT_URI: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_ADMIN_DATA_MODE: string;
  /** Native WebSocket URL for STOMP (`ws://` / `wss://`). Empty = WebSocket disabled. */
  readonly VITE_STOMP_BROKER_URL?: string;
  /** Comma-separated STOMP destinations (e.g. `/topic/bookings,/user/queue/updates`). */
  readonly VITE_STOMP_SUBSCRIBE_DESTINATIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
