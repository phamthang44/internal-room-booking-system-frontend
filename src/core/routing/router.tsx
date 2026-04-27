import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage, useAuthStore, useInitAuth, useProfileStore } from "@features/auth";
import { HomePage, LoadingScreen } from "@features/home";
import { AdminDashboard, StudentDashboard } from "@features/dashboard";
import { RoomListPage, RoomDetailPage, BookingConfirmationPage } from "@features/rooms";
import { MyBookingsPage, BookingDetailPage, BookingCheckInPage } from "@features/bookings";
import { AdminUserPenaltiesPage, MyPenaltiesPage } from "@features/penalties";
import {
  AdminRoomAuditPanelPage,
  AdminRoomsListPage,
  AdminRoomUpsertPage,
} from "@features/adminRooms";
import { AdminApprovalsPage } from "@features/approvals";
import { AdminBookingDetailPage } from "@features/adminBookings";
import { AdminEquipmentListPage } from "@features/adminEquipment";
import { AdminUsersPage } from "@features/adminUsers";
import { NotFoundPage } from "@features/error";
import { AppToastStack } from "@shared/components/AppToastStack";
import { FullScreenLoader } from "@shared/components/FullScreenLoader";

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasInitialized } = useAuthStore();

  if (!hasInitialized) {
    return <FullScreenLoader messageKey="common.loading.restoringSession" />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Admin-only route wrapper (requires authenticated user with role ADMIN)
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasInitialized } = useAuthStore();
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (token && !profile && !isLoading) {
      void fetchProfile();
    }
  }, [token, profile, isLoading, fetchProfile]);

  if (!hasInitialized) {
    return <FullScreenLoader messageKey="common.loading.restoringSession" />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // While profile is loading, show a lightweight loading state.
  if (!profile) {
    return <FullScreenLoader messageKey="common.loading.loadingProfile" />;
  }

  if (profile.roleName !== "ADMIN") {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

// Staff/admin route wrapper (requires authenticated user with role ADMIN or STAFF)
const StaffRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, hasInitialized } = useAuthStore();
  const { profile, isLoading, fetchProfile } = useProfileStore();

  useEffect(() => {
    if (token && !profile && !isLoading) {
      void fetchProfile();
    }
  }, [token, profile, isLoading, fetchProfile]);

  if (!hasInitialized) {
    return <FullScreenLoader messageKey="common.loading.restoringSession" />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <FullScreenLoader messageKey="common.loading.loadingProfile" />;
  }

  const role = profile.roleName;
  if (role !== "ADMIN" && role !== "STAFF") {
    return <Navigate to="/404" replace />;
  }

  return <>{children}</>;
};

// App initialization component - runs auth init logic before rendering routes
const RouterContent = () => {
  // This hook will attempt to refresh token on app load
  useInitAuth();

  return (
    <>
      <AppToastStack />

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
          path="/bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/penalties"
          element={
            <ProtectedRoute>
              <MyPenaltiesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings/:bookingId"
          element={
            <ProtectedRoute>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings/:bookingId/checkin"
          element={
            <ProtectedRoute>
              <BookingCheckInPage />
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

        {/* Admin Routes */}
        <Route
          path="/admin/rooms"
          element={
            <AdminRoute>
              <AdminRoomsListPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/new"
          element={
            <AdminRoute>
              <AdminRoomUpsertPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/:id/edit"
          element={
            <AdminRoute>
              <AdminRoomUpsertPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/rooms/:id/audit"
          element={
            <AdminRoute>
              <AdminRoomAuditPanelPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/equipment"
          element={
            <AdminRoute>
              <AdminEquipmentListPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users/:userId/penalties"
          element={
            <AdminRoute>
              <AdminUserPenaltiesPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <StaffRoute>
              <AdminApprovalsPage />
            </StaffRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <StaffRoute>
              <AdminDashboard />
            </StaffRoute>
          }
        />
        <Route
          path="/admin/bookings/:bookingId"
          element={
            <StaffRoute>
              <AdminBookingDetailPage />
            </StaffRoute>
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
