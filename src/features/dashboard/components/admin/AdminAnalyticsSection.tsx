import { useMemo } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type {
  DailyBookingTrendResponse,
  RoomUtilizationResponse,
  ViolationTrendResponse,
} from "../../types/adminDashboard.types";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function formatDateLabel(date: string) {
  // "YYYY-MM-DD" -> "MM/DD" (keeps chart compact and locale-neutral)
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return `${parts[1]}/${parts[2]}`;
}

function TogglePills<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-surface-container px-1 py-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
            value === o.value
              ? "bg-surface-container-lowest text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function StatChip({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "good" | "warn";
}) {
  const toneClass =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-50 text-amber-700"
        : "bg-surface-container text-on-surface-variant";
  return (
    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", toneClass)}>
      <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">
        {label}
      </span>
      <span className="font-black">{value}</span>
    </span>
  );
}

export function AdminAnalyticsSection({
  bookingTrend,
  roomStats,
  violationTrend,
  trendDays,
  setTrendDays,
  roomWeeks,
  setRoomWeeks,
  violationWeeks,
  setViolationWeeks,
  isLoading,
}: {
  bookingTrend: DailyBookingTrendResponse[];
  roomStats: RoomUtilizationResponse[];
  violationTrend: ViolationTrendResponse[];
  trendDays: 7 | 30;
  setTrendDays: (v: 7 | 30) => void;
  roomWeeks: 4 | 8;
  setRoomWeeks: (v: 4 | 8) => void;
  violationWeeks: 4 | 8;
  setViolationWeeks: (v: 4 | 8) => void;
  isLoading: boolean;
}) {
  const { t } = useI18n();

  const trendSeries = useMemo(() => {
    return (bookingTrend ?? []).map((d) => ({
      date: d.date,
      dateLabel: formatDateLabel(d.date),
      totalBookings: Number(d.totalBookings ?? 0),
      pending: Number(d.pendingCount ?? 0),
      approved: Number(d.approvedCount ?? 0),
      rejected: Number(d.rejectedCount ?? 0),
      cancelled: Number(d.cancelledCount ?? 0),
      completed: Number(d.completedCount ?? 0),
      checkedIn: Number(d.checkedInCount ?? 0),
      noShow: Number(d.noShowCount ?? 0),
      newViolations: Number(d.newViolations ?? 0),
    }));
  }, [bookingTrend]);

  const trendMax = useMemo(() => {
    if (!trendSeries.length) return 0;
    return Math.max(...trendSeries.map((p) => p.totalBookings));
  }, [trendSeries]);

  const trendSum = useMemo(() => {
    return trendSeries.reduce((s, p) => s + p.totalBookings, 0);
  }, [trendSeries]);

  const topRooms = useMemo(() => {
    const rows = [...(roomStats ?? [])].sort(
      (a, b) => (b.utilizationPct ?? 0) - (a.utilizationPct ?? 0),
    );
    return rows.slice(0, 8).map((r) => ({
      classroomId: r.classroomId,
      roomName: r.roomName,
      weekStart: r.weekStart,
      utilizationPct: clamp(Number(r.utilizationPct ?? 0), 0, 100),
      totalBookings: Number(r.totalBookings ?? 0),
      avgAttendees: Number(r.avgAttendees ?? 0),
      bookedSlotCount: Number(r.bookedSlotCount ?? 0),
      totalSlotCapacity: Number(r.totalSlotCapacity ?? 0),
    }));
  }, [roomStats]);

  const violationTimeSeries = useMemo(() => {
    // Recharts stacked bar expects one row per date, with keys per type.
    // This is a small, direct grouping to pivot the chart-ready list.
    // Keep counts in a dedicated object to stay type-safe (no string index on row).
    const byDate = new Map<
      string,
      { date: string; dateLabel: string; counts: Record<string, number> }
    >();
    const types = new Set<string>();
    for (const v of violationTrend ?? []) {
      const date = v.date;
      const type = (v.violationType ?? "UNKNOWN").toString();
      const count = Number(v.violationCount ?? 0);
      types.add(type);
      const row =
        byDate.get(date) ?? {
          date,
          dateLabel: formatDateLabel(date),
          counts: {},
        };
      row.counts[type] = (row.counts[type] ?? 0) + count;
      byDate.set(date, row);
    }
    const series = Array.from(byDate.values()).sort((a, b) =>
      String(a.date).localeCompare(String(b.date)),
    );
    const typeList = Array.from(types.values()).sort();
    return { series, typeList };
  }, [violationTrend]);

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
          {t("adminDashboard.analytics.title")}
        </h3>
        <p className="text-sm font-body text-on-surface-variant">
          {t("adminDashboard.analytics.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking trend */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-on-surface">
                {t("adminDashboard.analytics.bookingTrend.title")}
              </p>
              <p className="text-xs text-on-surface-variant">
                {t("adminDashboard.analytics.bookingTrend.caption")}
              </p>
            </div>

            <TogglePills
              value={String(trendDays) as "7" | "30"}
              onChange={(v) => setTrendDays((v === "7" ? 7 : 30) as 7 | 30)}
              options={[
                { value: "7", label: t("adminDashboard.analytics.range.last7d") },
                { value: "30", label: t("adminDashboard.analytics.range.last30d") },
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <StatChip label={t("adminDashboard.analytics.bookingTrend.stats.total")} value={trendSum.toLocaleString()} tone="neutral" />
            <StatChip label={t("adminDashboard.analytics.bookingTrend.stats.peak")} value={trendMax.toLocaleString()} tone={trendMax >= 10 ? "warn" : "good"} />
          </div>

          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-4">
            {isLoading ? (
              <div className="h-[140px] animate-pulse rounded-xl bg-surface-container" />
            ) : trendSeries.length < 2 ? (
              <div className="h-[140px] flex items-center justify-center text-sm text-on-surface-variant">
                {t("adminDashboard.analytics.bookingTrend.empty")}
              </div>
            ) : (
              <div className="h-[180px]" aria-label={t("adminDashboard.analytics.bookingTrend.aria")}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                    <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                    <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} width={34} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                      labelFormatter={(label) => `${t("adminDashboard.analytics.bookingTrend.caption")} • ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalBookings"
                      name={t("adminDashboard.analytics.bookingTrend.caption")}
                      stroke="#6750A4"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Room utilization */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-on-surface">
                {t("adminDashboard.analytics.roomStats.title")}
              </p>
              <p className="text-xs text-on-surface-variant">
                {t("adminDashboard.analytics.roomStats.caption")}
              </p>
            </div>
            <TogglePills
              value={String(roomWeeks) as "4" | "8"}
              onChange={(v) => setRoomWeeks((v === "4" ? 4 : 8) as 4 | 8)}
              options={[
                { value: "4", label: t("adminDashboard.analytics.range.last4w") },
                { value: "8", label: t("adminDashboard.analytics.range.last8w") },
              ]}
            />
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="h-[168px] animate-pulse rounded-xl bg-surface-container" />
            ) : topRooms.length === 0 ? (
              <div className="h-[168px] flex items-center justify-center text-sm text-on-surface-variant">
                {t("adminDashboard.analytics.roomStats.empty")}
              </div>
            ) : (
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...topRooms].reverse()}
                    layout="vertical"
                    margin={{ top: 6, right: 12, bottom: 6, left: 90 }}
                  >
                    <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="roomName"
                      width={90}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(0,0,0,0.08)",
                      }}
                      formatter={(value: any) => [`${Number(value).toFixed(1)}%`, t("adminDashboard.analytics.roomStats.title")]}
                    />
                    <Bar dataKey="utilizationPct" name={t("adminDashboard.analytics.roomStats.title")} fill="#6750A4" radius={[8, 8, 8, 8]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Violation trend (stacked by type over time) */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-on-surface">
              {t("adminDashboard.analytics.violationTrend.title")}
            </p>
            <p className="text-xs text-on-surface-variant">
              {t("adminDashboard.analytics.violationTrend.caption")}
            </p>
          </div>
          <TogglePills
            value={String(violationWeeks) as "4" | "8"}
            onChange={(v) => setViolationWeeks((v === "4" ? 4 : 8) as 4 | 8)}
            options={[
              { value: "4", label: t("adminDashboard.analytics.range.last4w") },
              { value: "8", label: t("adminDashboard.analytics.range.last8w") },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="h-[120px] animate-pulse rounded-xl bg-surface-container" />
        ) : violationTimeSeries.series.length === 0 ? (
          <div className="h-[120px] flex items-center justify-center text-sm text-on-surface-variant">
            {t("adminDashboard.analytics.violationTrend.empty")}
          </div>
        ) : (
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationTimeSeries.series} margin={{ top: 10, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} width={34} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {violationTimeSeries.typeList.slice(0, 6).map((type, idx) => (
                  <Bar
                    key={type}
                    name={type}
                    dataKey={(row: { counts: Record<string, number> }) =>
                      row.counts[type] ?? 0
                    }
                    stackId="violations"
                    fill={["#D32F2F", "#EF6C00", "#F9A825", "#1976D2", "#2E7D32", "#6A1B9A"][idx] ?? "#9E9E9E"}
                    radius={idx === violationTimeSeries.typeList.length - 1 ? [8, 8, 0, 0] : 0}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
}

