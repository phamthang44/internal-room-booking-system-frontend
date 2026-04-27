import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { bookingsApiService, type MyBookingsUiData } from "../api/bookings.api.service";
import type { BookingSearchParams } from "../types/bookings.api.types";

const DEFAULT_SIZE = 100;

export function MySchedulePage() {
  const { t, language } = useI18n();
  const navigate = useNavigate();

  const params: BookingSearchParams = useMemo(() => {
    return {
      page: 1,
      size: DEFAULT_SIZE,
      sort: "booking_date_asc",
    };
  }, []);

  const query = useQuery({
    queryKey: ["bookings", "my", "schedule", params],
    queryFn: (): Promise<MyBookingsUiData> => bookingsApiService.searchMyBookings(params),
    staleTime: 1000 * 15,
  });

  const items = query.data?.recentActivity.items ?? [];

  const grouped = useMemo(() => {
    const map = new Map<string, typeof items>();
    for (const it of items) {
      const key = it.dateLabel || t("common.placeholders.tbd");
      const existing = map.get(key);
      if (existing) existing.push(it);
      else map.set(key, [it]);
    }

    const toDateValue = (key: string) => {
      const d = new Date(`${key}T00:00:00`);
      const ms = d.getTime();
      return Number.isNaN(ms) ? Number.POSITIVE_INFINITY : ms;
    };

    return Array.from(map.entries())
      .sort((a, b) => toDateValue(a[0]) - toDateValue(b[0]))
      .map(([date, rows]) => ({ date, rows }));
  }, [items, t]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
              {t("schedule.title")}
            </h2>
            <p className="text-on-surface-variant max-w-lg">{t("schedule.subtitle")}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:opacity-95 active:scale-95 transition-all"
          >
            {t("schedule.actions.createBooking")}
          </button>
        </div>

        {query.isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            {t("common.loading.loading")}
          </div>
        ) : query.isError ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            {t("schedule.error.loadFailed")}
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-3xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
              calendar_month
            </span>
            <p className="text-on-surface-variant font-body">{t("schedule.empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {grouped.map((g) => {
              const dateLabel = formatDateLabel(g.date, language);
              return (
                <section key={g.date} className="rounded-3xl overflow-hidden bg-surface-container-lowest shadow-sm">
                  <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                    <p className="font-headline font-extrabold text-on-surface">{dateLabel}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      {t("schedule.count", { value: g.rows.length })}
                    </span>
                  </div>
                  <div className="divide-y divide-outline-variant/10">
                    {g.rows.map((it) => {
                      return (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => navigate(`/bookings/${encodeURIComponent(String(it.id))}`)}
                          className="w-full text-left px-6 py-4 hover:bg-surface-container-low transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-body font-bold text-on-surface truncate">
                                {it.roomName || it.roomCode}
                              </p>
                              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[16px]">
                                  schedule
                                </span>
                                {it.time.startTime} - {it.time.endTime}
                              </p>
                            </div>
                            <span className={`shrink-0 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusClass(it.status)}`}>
                              {it.status}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function statusClass(status: string) {
  if (status === "confirmed") return "bg-emerald-50 text-emerald-700";
  if (status === "pending") return "bg-amber-50 text-amber-700";
  if (status === "inUse") return "bg-primary-container text-on-primary-container";
  return "bg-slate-50 text-slate-700";
}

function formatDateLabel(value: string, language: string) {
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(language === "vi" ? "vi-VN" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

