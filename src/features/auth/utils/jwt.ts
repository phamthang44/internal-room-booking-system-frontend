/**
 * JWT Utilities
 * Helper functions for working with JWT tokens
 */

export interface JWTPayload {
  iss?: string;
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
  userId?: number;
  [key: string]: any;
}

/**
 * Decode JWT token (without verification - verification happens on backend)
 * @param token - JWT token string
 * @returns Decoded payload
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      if (import.meta.env.DEV) console.error("Invalid JWT format");
      return null;
    }

    // Decode payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded);
    return JSON.parse(decoded);
  } catch (error) {
    if (import.meta.env.DEV) console.error("Failed to decode JWT:", error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if expired, false if valid
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWT(token);
  if (!payload?.exp) {
    return true;
  }

  // exp is in seconds, current time is in milliseconds
  const expirationTime = payload.exp * 1000;
  return Date.now() > expirationTime;
};
