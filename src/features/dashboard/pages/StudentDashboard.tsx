import { AppLayout } from "@shared/components/AppLayout";
import { useAuthStore } from "@features/auth";
import { useI18n } from "@shared/i18n/useI18n";
import { DashboardSkeleton } from "../components/DashboardSkeleton";
import { useStudentDashboardRecentActivity } from "../hooks/useStudentDashboardRecentActivity";
import { HeroSection } from "../components/recent-activity/HeroSection";
import { SummaryBento } from "../components/recent-activity/SummaryBento";
import { ActivityCarousel } from "../components/recent-activity/ActivityCarousel";
import { UpcomingList } from "../components/recent-activity/UpcomingList";
import { PenaltyBanner } from "../components/student/PenaltyBanner";
import { AttendanceCard } from "../components/student/AttendanceCard";
import { RecommendationsSection } from "../components/student/RecommendationsSection";

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useI18n();
  const { data, isLoading, error } = useStudentDashboardRecentActivity();

  const firstName = user?.fullName?.trim().split(/\s+/).slice(-1)[0] || t("nav.dashboard");

  return (
    <AppLayout>
      <div className="page-frame space-y-7 dashboard-section">
        <HeroSection name={firstName} />

        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-6 text-center text-error">
            <span className="material-symbols-outlined text-[32px] mb-2 block">
              error_outline
            </span>
            <p className="font-semibold">{t("dashboard.error.title")}</p>
            <p className="text-sm mt-1">{t("dashboard.error.message")}</p>
          </div>
        ) : (
          <>
            <PenaltyBanner
              hasPenalty={data?.data?.hasPenalty}
              penaltyLevel={data?.data?.penaltyLevel}
              penaltyExpiresAt={data?.data?.penaltyExpiresAt}
            />
            <div className="dashboard-work-grid">
              <UpcomingList upcomingList={data?.data?.upcomingList} />
              <SummaryBento data={data?.data} />
            </div>
            <RecommendationsSection />
            <AttendanceCard
              attendanceRate={data?.data?.attendanceRate}
              noShowCount={data?.data?.noShowCount}
              cancelledThisMonthCount={data?.data?.cancelledThisMonthCount}
              avgActualAttendees={data?.data?.avgActualAttendees}
            />
            <ActivityCarousel historyList={data?.data?.historyList} />
          </>
        )}
      </div>
    </AppLayout>
  );
};
