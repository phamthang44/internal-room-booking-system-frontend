import { useMemo } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import ReactECharts from "echarts-for-react";
import type {
  DailyBookingTrendResponse,
  RoomUtilizationResponse,
  ViolationTrendResponse,
} from "../../types/adminDashboard.types";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function formatDateLabel(date: string) {
  // "YYYY-MM-DD" -> "MM/DD" (keeps chart compact and locale-neutral)
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return `${parts[1]}/${parts[2]}`;
}

function normalizeViolationTypeKey(key: string): string {
  return key.trim().toUpperCase();
}

function getViolationTypeLabel(typeKey: string, t: (k: string) => string) {
  const k = normalizeViolationTypeKey(typeKey || "UNKNOWN");
  const mapKey = `penalties.violationTypes.${k}`;
  const translated = t(mapKey);
  return translated === mapKey ? k.replace(/_/g, " ") : translated;
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
    const byDate = new Map<
      string,
      { date: string; dateLabel: string; counts: Record<string, number> }
    >();
    const types = new Set<string>();
    for (const v of violationTrend ?? []) {
      const date = v.date;
      const type = normalizeViolationTypeKey((v.violationType ?? "UNKNOWN").toString());
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

  const bookingTrendOption = useMemo(() => {
    const categories = trendSeries.map((p) => p.dateLabel);
    const values = trendSeries.map((p) => p.totalBookings);
    return {
      animation: true,
      grid: { left: 8, right: 12, top: 18, bottom: 8, containLabel: true },
      xAxis: {
        type: "category",
        data: categories,
        boundaryGap: false,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(0,0,0,0.12)" } },
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.6)" },
      },
      yAxis: {
        type: "value",
        splitNumber: 4,
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.6)" },
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.06)" } },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(0,0,0,0.10)",
        borderWidth: 1,
        textStyle: { color: "rgba(0,0,0,0.86)" },
        axisPointer: { type: "line", lineStyle: { color: "rgba(103,80,164,0.35)" } },
      },
      series: [
        {
          name: t("adminDashboard.analytics.bookingTrend.caption"),
          type: "line",
          smooth: 0.35,
          data: values,
          symbol: "circle",
          symbolSize: 6,
          showSymbol: false,
          lineStyle: { width: 3, color: "#6750A4" },
          areaStyle: {
            opacity: 0.18,
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(103,80,164,0.35)" },
                { offset: 1, color: "rgba(103,80,164,0)" },
              ],
            },
          },
        },
      ],
    } as const;
  }, [trendSeries, t]);

  const roomUtilizationOption = useMemo(() => {
    const data = [...topRooms].reverse();
    const categories = data.map((r) => r.roomName);
    const values = data.map((r) => Number(r.utilizationPct ?? 0));
    return {
      animation: true,
      grid: { left: 12, right: 12, top: 8, bottom: 8, containLabel: true },
      xAxis: {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.6)", formatter: "{value}%" },
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.06)" } },
      },
      yAxis: {
        type: "category",
        data: categories,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(0,0,0,0.12)" } },
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.7)", width: 88, overflow: "truncate" },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(0,0,0,0.10)",
        borderWidth: 1,
        textStyle: { color: "rgba(0,0,0,0.86)" },
        valueFormatter: (value: unknown) => `${Number(value ?? 0).toFixed(1)}%`,
      },
      series: [
        {
          name: t("adminDashboard.analytics.roomStats.title"),
          type: "bar",
          data: values,
          barWidth: 14,
          itemStyle: { color: "#6750A4", borderRadius: [10, 10, 10, 10] },
          emphasis: { focus: "series" },
        },
      ],
    } as const;
  }, [topRooms, t]);

  const violationTrendOption = useMemo(() => {
    const palette = ["#D32F2F", "#EF6C00", "#F9A825", "#1976D2", "#2E7D32", "#6A1B9A", "#546E7A"];
    const types = violationTimeSeries.typeList.slice(0, 6);
    const dates = violationTimeSeries.series.map((r) => r.dateLabel);

    return {
      animation: true,
      grid: { left: 8, right: 12, top: 32, bottom: 8, containLabel: true },
      legend: {
        top: 0,
        left: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 11, color: "rgba(0,0,0,0.7)" },
        formatter: (name: string) => getViolationTypeLabel(name, t),
      },
      xAxis: {
        type: "category",
        data: dates,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "rgba(0,0,0,0.12)" } },
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.6)" },
      },
      yAxis: {
        type: "value",
        splitNumber: 4,
        axisLabel: { fontSize: 11, color: "rgba(0,0,0,0.6)" },
        splitLine: { lineStyle: { color: "rgba(0,0,0,0.06)" } },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(255,255,255,0.92)",
        borderColor: "rgba(0,0,0,0.10)",
        borderWidth: 1,
        textStyle: { color: "rgba(0,0,0,0.86)" },
      },
      series: types.map((type, idx) => ({
        name: type,
        type: "bar",
        stack: "violations",
        barWidth: 18,
        itemStyle: {
          color: palette[idx] ?? "#9E9E9E",
          borderRadius: idx === types.length - 1 ? [8, 8, 0, 0] : 0,
        },
        emphasis: { focus: "series" as const },
        data: violationTimeSeries.series.map((row) => row.counts[type] ?? 0),
      })),
    } as const;
  }, [t, violationTimeSeries.series, violationTimeSeries.typeList]);

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
                <ReactECharts
                  option={bookingTrendOption}
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
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
                <ReactECharts
                  option={roomUtilizationOption}
                  style={{ height: "100%", width: "100%" }}
                  opts={{ renderer: "svg" }}
                />
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
            <ReactECharts
              option={violationTrendOption}
              style={{ height: "100%", width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

