import { useI18n } from "@shared/i18n/useI18n";

export const AttendanceCard = (props: {
  attendanceRate?: number;
  noShowCount?: number;
  cancelledThisMonthCount?: number;
  avgActualAttendees?: number;
}) => {
  const { t } = useI18n();

  const rateRaw = props.attendanceRate ?? 0;
  const rate = clamp01(rateRaw);
  const percent = Math.round(rate * 100);

  const radius = 34;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - rate);

  return (
    <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-slate-100/50">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {t("dashboard.attendance.title")}
          </p>
          <p className="font-headline text-2xl font-extrabold text-on-surface mt-1">
            {t("dashboard.attendance.percent", { value: percent })}
          </p>
          <p className="text-sm font-body text-on-surface-variant mt-1">
            {t("dashboard.attendance.subtitle")}
          </p>
        </div>

        <div className="shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-surface-container-highest"
              strokeWidth={stroke}
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="currentColor"
              className={getRingColorClass(percent)}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 48 48)"
            />
            <text
              x="48"
              y="52"
              textAnchor="middle"
              className="fill-current text-on-surface font-headline font-extrabold"
              fontSize="18"
            >
              {percent}%
            </text>
          </svg>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat labelKey="dashboard.attendance.stats.noShow" value={props.noShowCount} />
        <Stat
          labelKey="dashboard.attendance.stats.cancelledThisMonth"
          value={props.cancelledThisMonthCount}
        />
        <Stat
          labelKey="dashboard.attendance.stats.avgAttendees"
          value={props.avgActualAttendees}
          format={(v) => (Number.isFinite(v) ? v.toFixed(1) : "—")}
        />
        <Stat labelKey="dashboard.attendance.stats.rate" value={percent} format={(v) => `${v}%`} />
      </div>
    </section>
  );
};

function Stat(props: {
  labelKey: string;
  value?: number;
  format?: (value: number) => string;
}) {
  const { t } = useI18n();
  const v = props.value;
  const display =
    typeof v === "number" && Number.isFinite(v)
      ? props.format
        ? props.format(v)
        : String(v)
      : "—";

  return (
    <div className="rounded-xl bg-surface-container-low p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {t(props.labelKey)}
      </p>
      <p className="mt-1 font-headline text-lg font-extrabold text-on-surface">{display}</p>
    </div>
  );
}

function clamp01(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function getRingColorClass(percent: number) {
  if (percent >= 90) return "text-emerald-600";
  if (percent >= 75) return "text-primary";
  if (percent >= 60) return "text-amber-600";
  return "text-error";
}

