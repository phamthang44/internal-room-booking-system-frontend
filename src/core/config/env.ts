// Environment configuration
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  ENVIRONMENT: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;
