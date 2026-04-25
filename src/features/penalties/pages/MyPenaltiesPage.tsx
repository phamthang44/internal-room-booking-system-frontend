import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useMyPenaltiesQuery, useMyViolationsQuery } from "../hooks/usePenaltiesQueries";
import { isPenaltyActive, penaltyEndIso, penaltyTitle } from "../utils/penalties.utils";

type TabKey = "ACTIVE" | "HISTORY" | "VIOLATIONS";

function formatInstant(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export function MyPenaltiesPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<TabKey>("ACTIVE");
  const location = useLocation();
  const redirectedMessage =
    location.state && typeof location.state === "object" && "message" in location.state
      ? String((location.state as { message?: unknown }).message ?? "").trim()
      : "";

  const penaltiesQuery = useMyPenaltiesQuery();
  const violationsQuery = useMyViolationsQuery();

  const locale = localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US";

  const penalties = Array.isArray(penaltiesQuery.data) ? penaltiesQuery.data : [];
  const active = useMemo(() => penalties.filter(isPenaltyActive), [penalties]);
  const history = useMemo(() => penalties.filter((p) => !isPenaltyActive(p)), [penalties]);
  const violations = Array.isArray(violationsQuery.data) ? violationsQuery.data : [];

  const loading = penaltiesQuery.isLoading || violationsQuery.isLoading;
  const error = penaltiesQuery.isError || violationsQuery.isError;

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <header className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("penalties.page.title")}
          </h1>
          <p className="text-sm text-on-surface-variant">{t("penalties.page.subtitle")}</p>
        </header>

        {redirectedMessage ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {redirectedMessage}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 rounded-2xl bg-surface-container-low p-2">
          {(["ACTIVE", "HISTORY", "VIOLATIONS"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-bold transition-colors",
                tab === k
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high",
              )}
            >
              {k === "ACTIVE"
                ? t("penalties.tabs.active")
                : k === "HISTORY"
                  ? t("penalties.tabs.history")
                  : t("penalties.tabs.violations")}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-8 text-sm text-on-surface-variant">
            {t("penalties.states.loading")}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-6 text-sm text-error">
            {t("penalties.states.loadFailed")}
          </div>
        ) : tab === "VIOLATIONS" ? (
          <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              {t("penalties.sections.violations")}
            </h2>
            {violations.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-variant">{t("penalties.empty.violations")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {violations.map((v) => (
                  <li key={String(v.id)} className="rounded-xl bg-surface-container-low p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-extrabold text-on-surface">
                            {t(`penalties.violationTypes.${String(v.type ?? "UNKNOWN")}` as "penalties.violationTypes.NO_SHOW")}
                          </p>
                          {typeof v.severityPoints === "number" ? (
                            <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[10px] font-bold text-on-surface-variant">
                              +{v.severityPoints} {t("penalties.labels.points")}
                            </span>
                          ) : null}
                          <span className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[10px] font-bold text-on-surface-variant">
                            {t(`penalties.violationSources.${String(v.source ?? "UNKNOWN")}` as "penalties.violationSources.SYSTEM")}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                          {v.bookingId != null ? (
                            <Link className="font-bold text-primary hover:underline" to={`/bookings/${v.bookingId}`}>
                              {t("penalties.labels.booking")} #{v.bookingId}
                            </Link>
                          ) : (
                            <span>{t("penalties.labels.booking")}: —</span>
                          )}
                          <span className="opacity-50">•</span>
                          <span>{v.createdAt ? formatInstant(v.createdAt, locale) : "—"}</span>
                        </div>

                        <p className="mt-2 text-xs text-on-surface-variant">
                          {v.reason
                            ? (t(v.reason as never) || v.reason)
                            : v.notes
                              ? v.notes
                              : t("penalties.labels.noReason")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              {tab === "ACTIVE" ? t("penalties.sections.active") : t("penalties.sections.history")}
            </h2>

            {(tab === "ACTIVE" ? active : history).length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-variant">
                {tab === "ACTIVE" ? t("penalties.empty.active") : t("penalties.empty.history")}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {(tab === "ACTIVE" ? active : history).map((p) => {
                  const title = penaltyTitle(p);
                  const endIso = penaltyEndIso(p);
                  const end = endIso ? formatInstant(endIso, locale) : null;
                  const startIso = (p.startDate ?? p.startTime) as string | undefined;
                  const start = startIso ? formatInstant(startIso, locale) : null;

                  return (
                    <li key={String(p.id)} className="rounded-xl bg-surface-container-low p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-on-surface">{title}</p>
                          <p className="mt-1 text-xs text-on-surface-variant">
                            {start ? t("penalties.labels.starts", { start }) : ""}
                            {end ? ` • ${t("penalties.labels.ends", { end })}` : ""}
                          </p>
                        </div>
                        <span className="rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold text-on-surface-variant">
                          {String((p.status ?? (isPenaltyActive(p) ? "ACTIVE" : "—")))}
                        </span>
                      </div>
                      {p.reason ? (
                        <p className="mt-2 text-xs text-on-surface-variant">{p.reason}</p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
    </AppLayout>
  );
}

