import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { LoadingScreen } from "@features/home";
import { AdminDashboardHero } from "../components/admin/AdminDashboardHero";
import { AdminKpiBento } from "../components/admin/AdminKpiBento";
import { BookingStatusBreakdownCard } from "../components/admin/BookingStatusBreakdownCard";
import { RecentViolationsCard } from "../components/admin/RecentViolationsCard";
import { AdminAnalyticsSection } from "../components/admin/AdminAnalyticsSection";
import { useAdminDashboardOverview } from "../hooks/useAdminDashboardOverview";
import { useAdminDashboardAnalytics } from "../hooks/useAdminDashboardAnalytics";

export function AdminDashboard() {
  const { t } = useI18n();
  const { data, isLoading, error } = useAdminDashboardOverview();
  const analytics = useAdminDashboardAnalytics();

  if (isLoading) return <LoadingScreen />;

  const payload = data?.data;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <AdminDashboardHero />

        {error ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-6 text-center text-error">
            <span className="material-symbols-outlined text-[32px] mb-2 block">
              error_outline
            </span>
            <p className="font-semibold">{t("adminDashboard.error.title")}</p>
            <p className="text-sm mt-1">{t("adminDashboard.error.message")}</p>
          </div>
        ) : (
          <>
            <AdminKpiBento
              pendingApprovalCount={payload?.pendingApprovalCount ?? 0}
              bookingsTodayCount={payload?.bookingsTodayCount ?? 0}
              activeRoomsCount={payload?.activeRoomsCount ?? 0}
              activePenaltyCount={payload?.activePenaltyCount ?? 0}
            />
            <AdminAnalyticsSection
              bookingTrend={analytics.bookingTrend}
              roomStats={analytics.roomStats}
              violationTrend={analytics.violationTrend}
              trendDays={analytics.trendDays}
              setTrendDays={analytics.setTrendDays}
              roomWeeks={analytics.roomWeeks}
              setRoomWeeks={analytics.setRoomWeeks}
              violationWeeks={analytics.violationWeeks}
              setViolationWeeks={analytics.setViolationWeeks}
              isLoading={analytics.isLoading}
            />
            <BookingStatusBreakdownCard breakdown={payload?.bookingStatusBreakdown} />
            <RecentViolationsCard violations={payload?.recentViolations} />
          </>
        )}
      </div>
    </AppLayout>
  );
}

