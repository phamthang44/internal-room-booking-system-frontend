import { useI18n } from "@shared/i18n/useI18n";
import type { StudentDashboardData } from "../../api/student-dashboard.api";

interface SummaryBentoProps { data?: StudentDashboardData; }

export const SummaryBento = ({ data }: SummaryBentoProps) => {
  const { t } = useI18n();
  const items = [
    { label: "dashboard.stats.upcomingToday", value: data?.upcomingBookings },
    { label: "dashboard.stats.pendingRequests", value: data?.pendingBookings },
    { label: "dashboard.stats.totalBookings", value: data?.totalBookings },
  ];
  return (
    <div className="panel-shell">
      <dl className="metric-strip">
        {items.map((item) => (
          <div key={item.label} className="metric-cell">
            <dt>{t(item.label)}</dt>
            <dd>{item.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
