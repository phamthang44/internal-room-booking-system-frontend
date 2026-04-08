import { useI18n } from "@shared/i18n/useI18n";
import type { HistoryItem } from "../../api/student-dashboard.api";

interface ActivityCarouselProps {
  historyList?: HistoryItem[];
}

export const ActivityCarousel = ({ historyList }: ActivityCarouselProps) => {
  const { t } = useI18n();

  if (!historyList || historyList.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
              {t("dashboard.recentActivity.title")}
            </h3>
            <p className="text-sm font-body text-on-surface-variant">
              {t("dashboard.recentActivity.subtitle")}
            </p>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-12 rounded-2xl text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
            history
          </span>
          <p className="text-on-surface-variant font-body">
            {t("dashboard.recentActivity.noActivity")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {t("dashboard.recentActivity.title")}
          </h3>
          <p className="text-sm font-body text-on-surface-variant">
            {t("dashboard.recentActivity.subtitle")}
          </p>
        </div>
        <button className="text-primary font-bold font-body text-sm hover:underline">
          {t("dashboard.recentActivity.viewHistory")}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
        {historyList.slice(0, 3).map((item) => {
          const { icon, colorTheme, statusText } = getActivityStyle(
            item.action,
          );
          const timeAgoText = getTimeAgo(item.timestamp);
          const themeClasses = getThemeClasses(colorTheme);
          const roomName = item.roomName || `Booking #${item.bookingId}`;

          return (
            <div
              key={`${item.bookingId}-${item.timestamp}`}
              className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-slate-100/50 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-2.5 rounded-xl ${themeClasses.bg} ${themeClasses.text}`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    data-icon={icon}
                  >
                    {icon}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                  {timeAgoText}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface leading-tight">
                  {roomName}
                </h4>
                {item.building && (
                  <p className="text-[10px] text-on-surface-variant mt-0.5">
                    {item.building}
                  </p>
                )}
                <p
                  className={`text-xs font-medium mt-1 ${themeClasses.labelText}`}
                >
                  {statusText}
                </p>
                {item.note && item.note !== "N/A" && (
                  <p className="text-xs text-on-surface-variant mt-1 italic line-clamp-2">
                    {item.note}
                  </p>
                )}
              </div>
              <div className="mt-auto pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${themeClasses.dot}`}
                  ></span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase">
                    {item.action}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Helper Functions
function getActivityStyle(action: string) {
  const actionUpper = action.toUpperCase();

  if (actionUpper === "APPROVED" || actionUpper === "CONFIRMED") {
    return {
      icon: "check_circle",
      colorTheme: "emerald" as const,
      statusText: "Booking Confirmed",
    };
  } else if (actionUpper === "PENDING" || actionUpper === "SUBMITTED") {
    return {
      icon: "pending",
      colorTheme: "amber" as const,
      statusText: "Request Submitted",
    };
  } else if (actionUpper === "COMPLETED" || actionUpper === "CHECKED_IN") {
    return {
      icon: "login",
      colorTheme: "blue" as const,
      statusText: "Check-in Successful",
    };
  } else if (actionUpper === "CANCELLED" || actionUpper === "REJECTED") {
    return {
      icon: "cancel",
      colorTheme: "red" as const,
      statusText:
        actionUpper === "CANCELLED" ? "Booking Cancelled" : "Booking Rejected",
    };
  }

  return {
    icon: "info",
    colorTheme: "blue" as const,
    statusText: action,
  };
}

function getTimeAgo(timestamp: string): string {
  const date = new Date(timestamp);
  const hoursAgo = Math.floor((Date.now() - date.getTime()) / 3600000);

  if (hoursAgo < 1) return "Just now";
  if (hoursAgo < 24)
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getThemeClasses(colorTheme: "emerald" | "amber" | "blue" | "red") {
  const themes = {
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      dot: "bg-emerald-500",
      labelText: "text-emerald-700",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      dot: "bg-amber-500",
      labelText: "text-amber-700",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      dot: "bg-blue-500",
      labelText: "text-blue-700",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500",
      labelText: "text-red-700",
    },
  };

  return themes[colorTheme];
}
