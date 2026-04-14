import { AppLayout } from "@shared/components/AppLayout";
import { useAuthStore } from "@features/auth";
import { useI18n } from "@shared/i18n/useI18n";
import { useStudentDashboardRecentActivity } from "../hooks/useStudentDashboardRecentActivity";
import { HeroSection } from "../components/recent-activity/HeroSection";
import { SummaryBento } from "../components/recent-activity/SummaryBento";
import { ActivityCarousel } from "../components/recent-activity/ActivityCarousel";
import { UpcomingList } from "../components/recent-activity/UpcomingList";

export const StudentDashboardRecentActivity = () => {
  const { user } = useAuthStore();
  const { t } = useI18n();
  const { data, isLoading, error } = useStudentDashboardRecentActivity();

  const firstName = user?.fullName?.split(" ")[0] ?? "Student";

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <HeroSection name={firstName} />

        {isLoading ? (
          <div className="flex animate-pulse flex-col items-center justify-center space-y-4 py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            <p className="text-on-surface-variant text-sm font-medium">
              {t("dashboard.loading.message")}
            </p>
          </div>
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
            <SummaryBento data={data?.data} />
            <ActivityCarousel historyList={data?.data?.historyList} />
            <UpcomingList upcomingList={data?.data?.upcomingList} />
          </>
        )}
      </div>
    </AppLayout>
  );
};
