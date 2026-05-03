// Auth domain types
export type UserRole =
  | "STUDENT"
  | "LECTURER"
  | "ADMIN"
  | "FACILITY_STAFF"
  | "MANAGER";

/**
 * User profile data from /users/me endpoint
 * Matches backend response structure
 */
export interface User {
  id: number;
  fullName: string;
  username: string;
  roleName: UserRole;
  email: string;
  studentCode: string;
  avatar?: string;
}

/**
 * GET /profile and PUT /profile response body (`data` field of {@link ApiResponse}).
 * `phoneNumber` may be omitted on older API responses until populated.
 */
export interface UserProfileResponse extends User {
  phoneNumber?: string;
}

export interface LoginRequest {
  identifier: string; // Can be email or username
  password: string;
}

/**
 * Backend API Response Wrapper Format
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  data: T;
  meta: {
    apiVersion: string;
    message: string;
    serverTime: number;
    traceId: string;
  };
}

/**
 * Login Response Data from Backend
 * Contains tokens and user role
 */
export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  role: UserRole;
  status: string; // e.g., "LOGIN_SUCCESS"
}

/**
 * Complete Login Response with wrapper
 */
export type LoginResponse = ApiResponse<LoginResponseData>;

export interface OtpRequestPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
