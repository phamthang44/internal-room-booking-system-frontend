import { Link } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { useAuthStore } from "@features/auth";
import { useI18n } from "@shared/i18n/useI18n";
import { useDashboard } from "../hooks/useDashboard";
import { DashboardStats } from "../components/DashboardStats";
import { RecentlyViewedSection } from "../components/RecentlyViewedSection";
import { UpcomingBookingsSection } from "../components/UpcomingBookingsSection";

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { t, language } = useI18n();
  const { summary, upcomingBookings, recentRooms } = useDashboard();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const dateLabel = new Date().toLocaleDateString(
    language === "vi" ? "vi-VN" : "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        {/* ── Hero greeting ── */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface-variant">
              {dateLabel}
            </p>
            <h1 className="mt-1 font-headline text-3xl font-bold tracking-tight text-on-surface">
              {t("dashboard.greeting").replace("{{name}}", firstName)}
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <Link
            to="/rooms"
            id="browse-rooms-cta"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:shadow-md hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            {t("dashboard.newBooking")}
          </Link>
        </div>

        {/* ── KPI stats ── */}
        <DashboardStats
          data={summary.data}
          isLoading={summary.isLoading}
        />

        {/* ── Recently viewed rooms ── */}
        <RecentlyViewedSection
          rooms={recentRooms.data}
          isLoading={recentRooms.isLoading}
        />

        {/* ── Upcoming bookings ── */}
        <UpcomingBookingsSection
          bookings={upcomingBookings.data}
          isLoading={upcomingBookings.isLoading}
          error={upcomingBookings.error}
        />
      </div>
    </AppLayout>
  );
};
