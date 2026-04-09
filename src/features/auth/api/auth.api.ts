import apiClient, { refreshClient } from "@core/api/client";
import type {
  LoginRequest,
  LoginResponse,
  LoginResponseData,
  User,
  ApiResponse,
} from "../types/auth.types";
import { AUTH_ENDPOINTS } from "../constants/auth.constants";

/**
 * Google OAuth Login Request
 * Contains the ID Token from Google (never decoded on frontend)
 */
export interface GoogleLoginRequest {
  idToken: string;
}

/**
 * Error codes returned by backend for OAuth errors
 * Frontend uses these to categorize and display specific error messages
 */
export interface GoogleOAuthErrorResponse {
  code?: "USER_NOT_FOUND" | "INVALID_TOKEN" | string;
  message?: string;
}

export const authApi = {
  /**
   * Login with email and password
   * Returns access token and user data
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.LOGIN,
      data,
    );
    return response.data;
  },

  /**
   * Google OAuth Login - Exchange Google ID Token for system credentials
   *
   * Security Notes:
   * - Frontend sends ID Token to backend (never trusts it)
   * - Backend validates token with Google's servers
   * - Backend checks if user exists in system
   * - Backend generates system JWT token
   * - Frontend receives system credentials (not Google token)
   *
   * Backend Responsibilities:
   * 1. Validate id_token signature with Google's public keys
   * 2. Verify token expiration
   * 3. Check if user email exists in database
   * 4. Return error codes for specific cases:
   *    - { code: "USER_NOT_FOUND" } - If email not in database
   *    - { code: "INVALID_TOKEN" } - If token invalid/expired
   * 5. Generate system JWT accessToken
   * 6. Set refreshToken in httpOnly, Secure cookie
   * 7. Return { accessToken, user }
   *
   * @param data - Contains Google idToken
   * @returns LoginResponse with system accessToken and user info
   * @throws Error with code property for error categorization
   */
  googleLogin: async (data: GoogleLoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      AUTH_ENDPOINTS.GOOGLE_LOGIN,
      data,
    );
    return response.data;
  },

  /**
   * Logout - clear session on backend
   */
  logout: async (): Promise<void> => {
    await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
  },

  /**
   * Get current user profile
   * Returns user data wrapped in ApiResponse structure
   */
  getCurrentUser: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(
      AUTH_ENDPOINTS.GET_CURRENT_USER,
    );
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   * Auth is handled by httpOnly cookie only (no Bearer header)
   * Header clearing is already handled by refreshClient interceptor
   */
  refreshToken: async (): Promise<ApiResponse<LoginResponseData>> => {
    const response = await refreshClient.post<ApiResponse<LoginResponseData>>(
      AUTH_ENDPOINTS.REFRESH,
    );
    return response.data;
  },
};

export default authApi;
