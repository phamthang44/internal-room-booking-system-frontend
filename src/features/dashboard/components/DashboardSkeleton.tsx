import { useI18n } from "@shared/i18n/useI18n";

interface DashboardSkeletonProps { variant?: "student" | "admin"; }

/** Mirrors the dashboard's working layout without replacing the navigation shell. */
export function DashboardSkeleton({ variant = "student" }: DashboardSkeletonProps) {
  const { t } = useI18n();
  const isAdmin = variant === "admin";
  const metrics = (
    <div className="panel-shell">
      <div className={isAdmin ? "metric-strip is-admin" : "metric-strip"}>
        {Array.from({ length: isAdmin ? 4 : 3 }, (_, index) => (
          <div key={index} className="metric-cell">
            <div className="h-3 w-3/4 rounded bg-surface-container" />
            <div className="h-8 w-12 rounded bg-surface-container" />
          </div>
        ))}
      </div>
    </div>
  );
  const rows = (
    <div className="upcoming-surface p-5 space-y-6">
      <div className="h-4 w-40 max-w-full rounded bg-surface-container" />
      {[0, 1].map(index => (
        <div key={index} className="flex items-center gap-4 py-3">
          <div className="h-10 w-10 shrink-0 rounded-lg bg-surface-container" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 rounded bg-surface-container" />
            <div className="h-3 w-1/2 rounded bg-surface-container" />
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div data-dashboard-skeleton aria-busy="true">
      <p role="status" className="sr-only">{t("dashboard.loading.message")}</p>
      <div aria-hidden="true" className="space-y-7 motion-safe:animate-pulse">
        {isAdmin ? <>{metrics}<div className="dashboard-work-grid">{rows}{rows}</div></> : <div className="dashboard-work-grid">{rows}{metrics}</div>}
        <div className="rounded-2xl bg-surface-container-lowest p-6 space-y-5">
          <div className="h-4 w-40 max-w-full rounded bg-surface-container" />
          <div className="h-32 rounded-xl bg-surface-container/60" />
        </div>
      </div>
    </div>
  );
}
