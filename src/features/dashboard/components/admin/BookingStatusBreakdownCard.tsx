import { useMemo } from "react";
import { useI18n } from "@shared/i18n/useI18n";

type Breakdown = Record<string, number> | undefined;

const STATUS_ORDER = [
  "APPROVED",
  "CONFIRMED",
  "PENDING",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
  "REJECTED",
  "EXPIRED",
  "COMPLETED",
] as const;

function normalizeStatusKey(key: string): string {
  return key.trim().toUpperCase();
}

function getStatusTheme(statusKey: string) {
  const k = normalizeStatusKey(statusKey);

  if (k === "APPROVED" || k === "CONFIRMED") {
    return {
      dot: "bg-emerald-500",
      segment: "bg-emerald-500",
      label: "text-emerald-700",
      icon: "check_circle",
    };
  }
  if (k === "PENDING") {
    return {
      dot: "bg-amber-500",
      segment: "bg-amber-500",
      label: "text-amber-700",
      icon: "pending",
    };
  }
  if (k === "CHECKED_IN") {
    return {
      dot: "bg-blue-500",
      segment: "bg-blue-500",
      label: "text-blue-700",
      icon: "login",
    };
  }
  if (k === "CANCELLED" || k === "REJECTED" || k === "EXPIRED") {
    return {
      dot: "bg-red-500",
      segment: "bg-red-500",
      label: "text-red-700",
      icon: "cancel",
    };
  }

  return {
    dot: "bg-slate-400",
    segment: "bg-slate-400",
    label: "text-slate-700",
    icon: "info",
  };
}

function getDisplayStatusLabel(statusKey: string, t: (k: string) => string) {
  const k = normalizeStatusKey(statusKey);
  const mapKey = `adminDashboard.breakdown.status.${k}`;
  const translated = t(mapKey);
  // If translation key is missing, i18n returns the key itself; fall back to raw.
  return translated === mapKey ? k.replace(/_/g, " ") : translated;
}

export function BookingStatusBreakdownCard({
  breakdown,
}: {
  breakdown: Breakdown;
}) {
  const { t } = useI18n();

  const rows = useMemo(() => {
    const raw = breakdown ?? {};
    const entries = Object.entries(raw).map(([k, v]) => ({
      key: normalizeStatusKey(k),
      count: Number(v ?? 0),
    }));

    const ordered = [
      ...STATUS_ORDER.map((k) => entries.find((e) => e.key === k)).filter(
        Boolean,
      ),
      ...entries
        .filter((e) => !STATUS_ORDER.includes(e.key as any))
        .sort((a, b) => b.count - a.count),
    ].filter(Boolean) as Array<{ key: string; count: number }>;

    const total = ordered.reduce((sum, r) => sum + r.count, 0);
    return ordered.map((r) => ({
      ...r,
      pct: total > 0 ? Math.round((r.count / total) * 100) : 0,
      total,
    }));
  }, [breakdown]);

  const total = rows[0]?.total ?? 0;
  const isEmpty = total <= 0;

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
          {t("adminDashboard.breakdown.title")}
        </h3>
        <p className="text-sm font-body text-on-surface-variant">
          {t("adminDashboard.breakdown.subtitle")}
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm">
        {isEmpty ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              bar_chart
            </span>
            <p className="text-on-surface-variant font-body">
              {t("adminDashboard.breakdown.empty")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Stacked bar */}
            <div
              className="h-3 w-full overflow-hidden rounded-full bg-surface-container"
              role="img"
              aria-label={t("adminDashboard.breakdown.aria.stackedBar")}
              title={t("adminDashboard.breakdown.aria.stackedBar")}
            >
              <div className="flex h-full w-full">
                {rows.map((r) => {
                  const theme = getStatusTheme(r.key);
                  return (
                    <div
                      key={r.key}
                      className={theme.segment}
                      style={{ width: `${r.pct}%` }}
                      title={`${getDisplayStatusLabel(r.key, t)}: ${r.count} (${r.pct}%)`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rows.map((r) => {
                const theme = getStatusTheme(r.key);
                const label = getDisplayStatusLabel(r.key, t);
                return (
                  <div
                    key={r.key}
                    className="flex items-center justify-between rounded-2xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} />
                      <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                        {theme.icon}
                      </span>
                      <span className="truncate text-sm font-semibold text-on-surface">
                        {label}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 shrink-0">
                      <span className={`text-sm font-bold ${theme.label}`}>
                        {r.count}
                      </span>
                      <span className="text-[11px] font-bold text-on-surface-variant/70">
                        {r.pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

