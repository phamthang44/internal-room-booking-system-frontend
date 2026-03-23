// Auth domain types
export type UserRole =
  | "STUDENT"
  | "LECTURER"
  | "ADMIN"
  | "FACILITY_STAFF"
  | "MANAGER";

export interface User {
  id: string;
  username?: string;
  name?: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
