import { Link } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

interface AdminKpiBentoProps {
  pendingApprovalCount: number; bookingsTodayCount: number; activeRoomsCount: number; activePenaltyCount: number;
}

export function AdminKpiBento({ pendingApprovalCount, bookingsTodayCount, activeRoomsCount, activePenaltyCount }: AdminKpiBentoProps) {
  const { t } = useI18n();
  const items = [
    { key: "pendingApprovals", value: pendingApprovalCount, link: "/admin/approvals" },
    { key: "bookingsToday", value: bookingsTodayCount },
    { key: "activeRooms", value: activeRoomsCount },
    { key: "activePenalties", value: activePenaltyCount },
  ];
  return (
    <div className="panel-shell">
      <dl className="metric-strip is-admin">
        {items.map((item) => (
          <div key={item.key} className={`metric-cell ${item.link && item.value > 0 ? "needs-attention" : ""}`}>
            <dt>{item.link ? <Link className="hover:underline" to={item.link}>{t(`adminDashboard.kpis.${item.key}`)} ↗</Link> : t(`adminDashboard.kpis.${item.key}`)}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
