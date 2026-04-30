export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  GOOGLE_LOGIN: "/auth/google-login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  GET_CURRENT_USER: "/profile",
  OTP_REQUEST: "/auth/otp/request",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;
