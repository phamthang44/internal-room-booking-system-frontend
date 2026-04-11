import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, useAuthStore, useInitAuth } from "@features/auth";
import { HomePage, LoadingScreen } from "@features/home";
import { StudentDashboard } from "@features/dashboard";
import { RoomListPage, RoomDetailPage, BookingConfirmationPage } from "@features/rooms";
import { NotFoundPage } from "@features/error";
import { HttpErrorToast } from "@shared/components/HttpErrorToast";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex items-center gap-3 text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          <span className="text-sm font-medium">Restoring session...</span>
        </div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// App initialization component - runs auth init logic before rendering routes
const RouterContent = () => {
  // This hook will attempt to refresh token on app load
  useInitAuth();

  return (
    <>
      {/* Global HTTP error toast — renders above everything */}
      <HttpErrorToast />

      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/loading"
          element={
            <ProtectedRoute>
              <LoadingScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <RoomListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rooms/:roomId"
          element={
            <ProtectedRoute>
              <RoomDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/success"
          element={
            <ProtectedRoute>
              <BookingConfirmationPage />
            </ProtectedRoute>
          }
        />

        {/* Error Pages */}
        <Route path="/404" element={<NotFoundPage />} />

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all — show 404 page instead of silently redirecting */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export const Router = () => {
  return <RouterContent />;
};

export default Router;
