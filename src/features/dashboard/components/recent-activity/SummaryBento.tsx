import { useI18n } from "@shared/i18n/useI18n";
import type { StudentDashboardData } from "../../api/student-dashboard.api";

interface SummaryBentoProps {
  data?: StudentDashboardData;
}

export const SummaryBento = ({ data }: SummaryBentoProps) => {
  const { t } = useI18n();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-blue-50 text-blue-900 rounded-xl">
            <span
              className="material-symbols-outlined"
              data-icon="calendar_month"
            >
              calendar_month
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            {t("dashboard.stats.labels.lifetime")}
          </span>
        </div>
        <p className="text-4xl font-extrabold text-on-surface font-headline">
          {String(data?.totalBookings ?? 0).padStart(2, "0")}
        </p>
        <p className="text-sm font-semibold text-on-surface-variant mt-1">
          {t("dashboard.stats.totalBookings")}
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <span className="material-symbols-outlined" data-icon="today">
              today
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
            {t("dashboard.stats.labels.active")}
          </span>
        </div>
        <p className="text-4xl font-extrabold text-on-surface font-headline">
          {String(data?.upcomingBookings ?? 0).padStart(2, "0")}
        </p>
        <p className="text-sm font-semibold text-on-surface-variant mt-1">
          {t("dashboard.stats.upcomingToday")}
        </p>
      </div>

      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
            <span
              className="material-symbols-outlined"
              data-icon="pending_actions"
            >
              pending_actions
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
            {t("dashboard.stats.labels.awaiting")}
          </span>
        </div>
        <p className="text-4xl font-extrabold text-on-surface font-headline">
          {String(data?.pendingBookings ?? 0).padStart(2, "0")}
        </p>
        <p className="text-sm font-semibold text-on-surface-variant mt-1">
          {t("dashboard.stats.pendingRequests")}
        </p>
      </div>
    </section>
  );
};
