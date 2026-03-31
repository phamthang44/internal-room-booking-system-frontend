import { useI18n } from "@shared/i18n/useI18n";
import { SkeletonBlock } from "@shared/components/SkeletonBlock";
import type { DashboardSummary } from "../types/dashboard.types";

interface StatBadgeProps {
  label: string;
  value: number;
  icon: string;
  accent?: "primary" | "secondary" | "tertiary";
}

const StatBadge = ({ label, value, icon, accent = "primary" }: StatBadgeProps) => {
  const accentClasses = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary-container text-on-secondary-container",
    tertiary: "bg-tertiary-fixed/30 text-on-tertiary-container",
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-on-surface-variant">{label}</span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentClasses[accent]}`}
        >
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <p className="font-headline text-4xl font-bold tracking-tight text-on-surface">
        {String(value).padStart(2, "0")}
      </p>
    </div>
  );
};

const StatSkeleton = () => (
  <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5">
    <div className="flex items-center justify-between">
      <SkeletonBlock className="h-4 w-28" />
      <SkeletonBlock className="h-9 w-9 rounded-xl" />
    </div>
    <SkeletonBlock className="h-10 w-16" />
  </div>
);

interface DashboardStatsProps {
  data?: DashboardSummary;
  isLoading: boolean;
}

export const DashboardStats = ({ data, isLoading }: DashboardStatsProps) => {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatBadge
        label={t("dashboard.stats.totalBookings")}
        value={data.totalBookings}
        icon="event_note"
        accent="primary"
      />
      <StatBadge
        label={t("dashboard.stats.upcomingToday")}
        value={data.upcomingToday}
        icon="schedule"
        accent="secondary"
      />
      <StatBadge
        label={t("dashboard.stats.pendingRequests")}
        value={data.pendingRequests}
        icon="pending_actions"
        accent="tertiary"
      />
    </div>
  );
};
