import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { useStudentRecommendations } from "../../hooks/useStudentRecommendations";
import type { RoomRecommendationResponse } from "../../api/student-dashboard.api";
import type { TranslationParams } from "@shared/i18n/useI18n";

export const RecommendationsSection = () => {
  const { t } = useI18n();
  const [attendees, setAttendees] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  const { data, isLoading } = useStudentRecommendations({
    attendees,
  });

  const rooms = data?.data ?? [];

  const chips = useMemo(() => {
    return rooms.map((room) => ({
      classroomId: room.classroomId,
      label: getReasonLabel(room, attendees, t),
    }));
  }, [rooms, attendees, t]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {t("dashboard.recommendations.title")}
          </h3>
          <p className="text-sm font-body text-on-surface-variant">
            {t("dashboard.recommendations.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {t("dashboard.recommendations.attendees")}
          </label>
          <input
            value={attendees ?? ""}
            onChange={(e) => {
              const raw = e.target.value.trim();
              if (!raw) {
                setAttendees(undefined);
                return;
              }
              const n = Number(raw);
              setAttendees(Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined);
            }}
            inputMode="numeric"
            placeholder={t("common.placeholders.na")}
            className="w-24 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm font-body text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-100/50 bg-surface-container-lowest p-5 animate-pulse"
            >
              <div className="h-5 w-2/3 rounded bg-surface-container-highest" />
              <div className="mt-2 h-3 w-1/2 rounded bg-surface-container-highest" />
              <div className="mt-4 flex gap-2">
                <div className="h-6 w-24 rounded-full bg-surface-container-highest" />
                <div className="h-6 w-32 rounded-full bg-surface-container-highest" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="h-16 rounded-xl bg-surface-container-highest" />
                <div className="h-16 rounded-xl bg-surface-container-highest" />
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
            auto_awesome
          </span>
          <p className="text-on-surface-variant font-body">
            {t("dashboard.recommendations.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => {
            const chip = chips.find((c) => c.classroomId === room.classroomId)?.label;
            const statusLabel = t(
              `dashboard.recommendations.status.${room.status}`,
            );
            return (
              <button
                key={room.classroomId}
                type="button"
                onClick={() =>
                  navigate(`/rooms/${encodeURIComponent(String(room.classroomId))}`)
                }
                className="text-left bg-surface-container-lowest rounded-2xl border border-slate-100/50 p-5 shadow-sm hover:shadow-md transition-shadow active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-headline font-extrabold text-on-surface truncate">
                      {room.roomName}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {room.buildingName} · {room.roomTypeName}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusPillClass(
                      room.status,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs font-bold rounded-full bg-surface-container-low px-3 py-1 text-on-surface">
                    {t("dashboard.recommendations.capacity", { value: room.capacity })}
                  </span>
                  {chip ? (
                    <span className="text-xs font-bold rounded-full bg-primary px-3 py-1 text-on-primary inline-flex items-center gap-1.5 border border-primary/20 shadow-sm">
                      <span className="material-symbols-outlined text-[16px]">
                        auto_awesome
                      </span>
                      <span className="truncate">{chip}</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Metric
                    label={t("dashboard.recommendations.metrics.bookedTimes")}
                    value={room.bookingCount}
                  />
                  <Metric
                    label={t("dashboard.recommendations.metrics.avgAttendees")}
                    value={room.avgActualAttendees}
                    format={(v) => (Number.isFinite(v) ? v.toFixed(1) : "—")}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};

function Metric(props: { label: string; value: number; format?: (v: number) => string }) {
  const display = props.format ? props.format(props.value) : String(props.value);
  return (
    <div className="rounded-xl bg-surface-container-low p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
        {props.label}
      </p>
      <p className="mt-1 font-headline text-lg font-extrabold text-on-surface">
        {display}
      </p>
    </div>
  );
}

function statusPillClass(status: RoomRecommendationResponse["status"]) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-50 text-emerald-700";
    case "OCCUPIED":
      return "bg-amber-50 text-amber-700";
    case "MAINTENANCE":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

function getReasonLabel(
  room: RoomRecommendationResponse,
  attendees: number | undefined,
  t: (key: string, params?: TranslationParams) => string,
) {
  const value0 =
    room.reasonKey === "recommendation.reason.capacity_match"
      ? attendees ?? room.capacity
      : room.bookingCount;

  const translated = t(room.reasonKey, { "0": value0 });

  // Compatibility: backend docs use `{0}` but our i18n interpolator supports `{{0}}`.
  // If the translation string still contains `{0}`, replace it here so UI is correct.
  return translated.replace(/\{0\}/g, String(value0));
}

