import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { AdminPenaltyPanel } from "../components/AdminPenaltyPanel";
import { useAdminUserPenaltiesQuery } from "../hooks/usePenaltiesQueries";
import { isPenaltyActive, penaltyEndIso, penaltyTitle } from "../utils/penalties.utils";

type TabKey = "PENALTIES" | "VIOLATIONS";

function formatInstant(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function penaltyStatusMeta(statusRaw: string): { toneClass: string; i18nKey: "adminPenalties.status.active" | "adminPenalties.status.expired" | "adminPenalties.status.revoked" | "adminPenalties.status.unknown" } {
  const s = (statusRaw ?? "").toString().toUpperCase();
  switch (s) {
    case "ACTIVE":
      return {
        toneClass: "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant ring-1 ring-tertiary-fixed/25",
        i18nKey: "adminPenalties.status.active",
      };
    case "EXPIRED":
      return {
        toneClass: "bg-surface-container-high text-on-surface-variant ring-1 ring-outline-variant/30",
        i18nKey: "adminPenalties.status.expired",
      };
    case "REVOKED":
      return {
        toneClass: "bg-error-container/35 text-error ring-1 ring-error/20",
        i18nKey: "adminPenalties.status.revoked",
      };
    default:
      return {
        toneClass: "bg-surface-container-high text-on-surface-variant ring-1 ring-outline-variant/30",
        i18nKey: "adminPenalties.status.unknown",
      };
  }
}

export function AdminUserPenaltiesPage() {
  const { t } = useI18n();
  const { userId } = useParams();
  const parsed = Number(userId);
  const id = Number.isFinite(parsed) ? parsed : null;

  const [tab, setTab] = useState<TabKey>("PENALTIES");
  const q = useAdminUserPenaltiesQuery(id);

  const locale = localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US";

  const penalties = q.data?.penalties ?? [];
  const violations = q.data?.violations ?? [];

  const sortedPenalties = useMemo(() => {
    const score = (p: { endDate?: string | null; endTime?: string | null }) => {
      const iso = (p.endDate ?? p.endTime) as string | null | undefined;
      if (!iso) return Number.MAX_SAFE_INTEGER;
      const d = new Date(iso);
      return Number.isNaN(d.getTime()) ? 0 : d.getTime();
    };
    return [...penalties].sort((a, b) => score(b) - score(a));
  }, [penalties]);

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <header className="space-y-2">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("adminPenalties.page.title")}{" "}
            {id != null ? <span className="text-on-surface-variant">#{id}</span> : null}
          </h1>
          <p className="text-sm text-on-surface-variant">{t("adminPenalties.page.subtitle")}</p>
          <div className="text-xs">
            <Link to="/admin/users" className="font-bold text-primary hover:underline">
              {t("adminPenalties.page.backToUsers")}
            </Link>
          </div>
        </header>

        {id != null ? <AdminPenaltyPanel userId={id} /> : null}

        <div className="flex flex-wrap gap-2 rounded-2xl bg-surface-container-low p-2">
          {(["PENALTIES", "VIOLATIONS"] as const).map((k) => (
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
              {k === "PENALTIES"
                ? t("adminPenalties.page.tabs.penalties")
                : t("adminPenalties.page.tabs.violations")}
            </button>
          ))}
        </div>

        {q.isLoading ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-8 text-sm text-on-surface-variant">
            {t("adminPenalties.loading")}
          </div>
        ) : q.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-6 text-sm text-error">
            {t("adminPenalties.loadFailed")}
          </div>
        ) : tab === "VIOLATIONS" ? (
          <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              {t("adminPenalties.page.sections.violations")}
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
                            <Link className="font-bold text-primary hover:underline" to={`/admin/bookings/${v.bookingId}`}>
                              {t("penalties.labels.booking")} #{v.bookingId}
                            </Link>
                          ) : (
                            <span>{t("penalties.labels.booking")}: —</span>
                          )}
                          <span className="opacity-50">•</span>
                          <span>{v.createdAt ? formatInstant(v.createdAt, locale) : "—"}</span>
                        </div>

                        <p className="mt-2 text-xs text-on-surface-variant">
                          {v.reason ? (t(v.reason as never) || v.reason) : v.notes ? v.notes : t("penalties.labels.noReason")}
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
              {t("adminPenalties.page.sections.penalties")}
            </h2>

            {sortedPenalties.length === 0 ? (
              <p className="mt-4 text-sm text-on-surface-variant">{t("penalties.empty.history")}</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {sortedPenalties.map((p) => {
                  const title = penaltyTitle(p);
                  const endIso = penaltyEndIso(p);
                  const startIso = (p.startDate ?? p.startTime) as string | undefined;
                  const start = startIso ? formatInstant(startIso, locale) : null;
                  const end = endIso ? formatInstant(endIso, locale) : null;
                  const statusRaw = String(p.status ?? (isPenaltyActive(p) ? "ACTIVE" : "UNKNOWN"));
                  const status = penaltyStatusMeta(statusRaw);

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
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide",
                            status.toneClass,
                          )}
                        >
                          {t(status.i18nKey)}
                        </span>
                      </div>
                      {p.reason ? <p className="mt-2 text-xs text-on-surface-variant">{p.reason}</p> : null}
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

