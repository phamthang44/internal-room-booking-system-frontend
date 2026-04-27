import { useI18n } from "@shared/i18n/useI18n";

interface AdminKpiBentoProps {
  pendingApprovalCount: number;
  bookingsTodayCount: number;
  activeRoomsCount: number;
  activePenaltyCount: number;
}

export function AdminKpiBento({
  pendingApprovalCount,
  bookingsTodayCount,
  activeRoomsCount,
  activePenaltyCount,
}: AdminKpiBentoProps) {
  const { t } = useI18n();

  const items = [
    {
      key: "pendingApprovalCount",
      value: pendingApprovalCount,
      label: t("adminDashboard.kpis.pendingApprovals"),
      badge: "bg-amber-50 text-amber-700",
      icon: "verified_user",
      tone: "text-amber-600",
    },
    {
      key: "bookingsTodayCount",
      value: bookingsTodayCount,
      label: t("adminDashboard.kpis.bookingsToday"),
      badge: "bg-blue-50 text-blue-900",
      icon: "today",
      tone: "text-blue-600",
    },
    {
      key: "activeRoomsCount",
      value: activeRoomsCount,
      label: t("adminDashboard.kpis.activeRooms"),
      badge: "bg-emerald-50 text-emerald-700",
      icon: "meeting_room",
      tone: "text-emerald-600",
    },
    {
      key: "activePenaltyCount",
      value: activePenaltyCount,
      label: t("adminDashboard.kpis.activePenalties"),
      badge: "bg-red-50 text-red-700",
      icon: "policy",
      tone: "text-red-600",
    },
  ] as const;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-body">
      {items.map((item) => (
        <div
          key={item.key}
          className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm group hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${item.badge}`}>
              <span
                className="material-symbols-outlined"
                data-icon={item.icon}
              >
                {item.icon}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${item.tone}`}
            >
              {t("adminDashboard.kpis.labels.today")}
            </span>
          </div>

          <p className="text-4xl font-extrabold text-on-surface font-headline">
            {String(item.value ?? 0).padStart(2, "0")}
          </p>
          <p className="text-sm font-semibold text-on-surface-variant mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </section>
  );
}

