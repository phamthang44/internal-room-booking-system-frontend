/**
 * API Request Helper
 * Utility functions for authenticated API requests
 */

import type { AxiosRequestConfig } from "axios";

/**
 * Get config with authorization token
 * Used to add accessToken from Zustand store to requests
 *
 * Usage:
 * const config = getAuthConfig();
 * apiClient.post("/endpoint", data, config);
 */
export const getAuthConfig = (token: string | null): AxiosRequestConfig => {
  const config: AxiosRequestConfig = {};

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
};

/**
 * Get config with both token and custom headers
 */
export const getAuthConfigWithHeaders = (
  token: string | null,
  customHeaders?: Record<string, string>,
): AxiosRequestConfig => {
  const config = getAuthConfig(token);

  if (customHeaders) {
    config.headers = {
      ...config.headers,
      ...customHeaders,
    };
  }

  return config;
};
