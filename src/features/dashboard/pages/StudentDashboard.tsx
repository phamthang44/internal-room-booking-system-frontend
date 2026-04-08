import { AppLayout } from "@shared/components/AppLayout";
import { useAuthStore } from "@features/auth";
import { useI18n } from "@shared/i18n/useI18n";
import { LoadingScreen } from "@features/home";
import { useStudentDashboardRecentActivity } from "../hooks/useStudentDashboardRecentActivity";
import { HeroSection } from "../components/recent-activity/HeroSection";
import { SummaryBento } from "../components/recent-activity/SummaryBento";
import { ActivityCarousel } from "../components/recent-activity/ActivityCarousel";
import { UpcomingList } from "../components/recent-activity/UpcomingList";

export const StudentDashboard = () => {
  const { user } = useAuthStore();
  const { t } = useI18n();
  const { data, isLoading, error } = useStudentDashboardRecentActivity();

  const firstName = user?.fullName?.split(" ")[0] ?? "Student";

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl p-6 md:p-8 space-y-8">
        <HeroSection name={firstName} />

        {error ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-6 text-center text-error">
            <span className="material-symbols-outlined text-[32px] mb-2 block">
              error_outline
            </span>
            <p className="font-semibold">{t("dashboard.error.title")}</p>
            <p className="text-sm mt-1">{t("dashboard.error.message")}</p>
          </div>
        ) : (
          <>
            <SummaryBento data={data?.data} />
            <ActivityCarousel historyList={data?.data?.historyList} />
            <UpcomingList upcomingList={data?.data?.upcomingList} />
          </>
        )}
      </div>
    </AppLayout>
  );
};
