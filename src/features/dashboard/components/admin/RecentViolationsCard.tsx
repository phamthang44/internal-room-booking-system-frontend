import { useMemo } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { getRelativeTime } from "@shared/utils/date";
import type { RecentViolationSummary } from "../../types/adminDashboard.types";

interface RecentViolationsCardProps {
  violations?: RecentViolationSummary[];
}

function getSeverityTheme(points: number) {
  if (points >= 8) {
    return { chip: "bg-red-50 text-red-700", icon: "error" };
  }
  if (points >= 4) {
    return { chip: "bg-amber-50 text-amber-700", icon: "warning" };
  }
  return { chip: "bg-emerald-50 text-emerald-700", icon: "info" };
}

export function RecentViolationsCard({ violations }: RecentViolationsCardProps) {
  const { t, language } = useI18n();

  const rows = useMemo(() => (violations ?? []).slice(0, 6), [violations]);

  const getViolationLabel = (typeKey: string) => {
    const k = String(typeKey ?? "UNKNOWN").trim().toUpperCase();
    const mapKey = `penalties.violationTypes.${k}`;
    const translated = t(mapKey);
    return translated === mapKey ? k.replace(/_/g, " ") : translated;
  };

  if (!rows.length) {
    return (
      <section className="space-y-4">
        <div>
          <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {t("adminDashboard.violations.title")}
          </h3>
          <p className="text-sm font-body text-on-surface-variant">
            {t("adminDashboard.violations.subtitle")}
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
            gpp_good
          </span>
          <p className="text-on-surface-variant font-body">
            {t("adminDashboard.violations.empty")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {t("adminDashboard.violations.title")}
          </h3>
          <p className="text-sm font-body text-on-surface-variant">
            {t("adminDashboard.violations.subtitle")}
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        {/* Desktop table */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-3 px-6 py-4 border-b border-outline-variant/15 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70">
            <div className="col-span-4">{t("adminDashboard.violations.columns.user")}</div>
            <div className="col-span-2">{t("adminDashboard.violations.columns.studentCode")}</div>
            <div className="col-span-4">{t("adminDashboard.violations.columns.type")}</div>
            <div className="col-span-2 text-right">{t("adminDashboard.violations.columns.points")}</div>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {rows.map((v) => {
              const rel = getRelativeTime(v.createdAt, t, language);
              const theme = getSeverityTheme(v.severityPoints);
              return (
                <div
                  key={v.violationId}
                  className="grid grid-cols-12 gap-3 px-6 py-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="col-span-4 min-w-0">
                    <p className="truncate text-sm font-semibold text-on-surface">
                      {v.userEmail}
                    </p>
                    <p className="text-xs text-on-surface-variant">{rel}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-semibold text-on-surface">
                      {v.studentCode}
                    </span>
                  </div>
                  <div className="col-span-4 min-w-0">
                    <span className="truncate text-sm text-on-surface">
                      {getViolationLabel(v.violationType)}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.chip}`}
                      title={t("adminDashboard.violations.pointsLabel", {
                        count: v.severityPoints,
                      })}
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        {theme.icon}
                      </span>
                      {v.severityPoints}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-outline-variant/10">
          {rows.map((v) => {
            const rel = getRelativeTime(v.createdAt, t, language);
            const theme = getSeverityTheme(v.severityPoints);
            return (
              <div key={v.violationId} className="p-6 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-on-surface">
                      {v.userEmail}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {v.studentCode} • {rel}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${theme.chip}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {theme.icon}
                    </span>
                    {v.severityPoints}
                  </span>
                </div>
                <p className="text-sm text-on-surface">
                  {getViolationLabel(v.violationType)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

