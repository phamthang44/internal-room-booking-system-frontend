// Environment configuration
export const ENV = {
  /**
   * API base URL for axios.
   *
   * - In production we default to same-origin `/api/v1` so hosting rewrites (e.g. Vercel `vercel.json`)
   *   can proxy requests to the backend without exposing the browser to backend CORS config.
   * - In development you can override with `VITE_API_URL` (e.g. `http://localhost:8080/api/v1`)
   *   or set `VITE_API_URL=/api/v1` to use the Vite dev proxy.
   */
  API_URL:
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "/api/v1" : "http://localhost:3000/api/v1"),
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  ENVIRONMENT: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
