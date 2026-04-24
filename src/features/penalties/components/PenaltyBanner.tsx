import { Link } from "react-router-dom";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useMyPenaltiesQuery } from "../hooks/usePenaltiesQueries";
import type { PenaltyRecordResponse } from "../types/penalties.api.types";
import { isPenaltyActive, penaltyEndIso, pickPenaltyType } from "../utils/penalties.utils";

function formatInstant(iso: string, locale: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, { year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function pickActivePenalty(rows: PenaltyRecordResponse[]): PenaltyRecordResponse | null {
  const active = rows.filter(isPenaltyActive);
  if (active.length === 0) return null;

  // Prefer the most restrictive penalty type.
  const rank = (p: PenaltyRecordResponse) => {
    const t = pickPenaltyType(p);
    if (t === "PERMANENT_BAN") return 4;
    if (t === "TEMPORARY_BAN") return 3;
    if (t === "APPROVAL_REQUIRED") return 2;
    if (t === "WARNING") return 1;
    return 0;
  };
  return [...active].sort((a, b) => rank(b) - rank(a))[0] ?? null;
}

export function PenaltyBanner({ className }: { readonly className?: string }) {
  const { t } = useI18n();
  const q = useMyPenaltiesQuery();

  const rows = Array.isArray(q.data) ? q.data : [];
  const active = rows.length > 0 ? pickActivePenalty(rows) : null;
  if (!active) return null;

  const type = pickPenaltyType(active);
  const endIso = penaltyEndIso(active);
  const locale = localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US";
  const endLabel = endIso ? formatInstant(endIso, locale) : null;

  const isBlocking = type === "TEMPORARY_BAN" || type === "PERMANENT_BAN";
  const toneClass = isBlocking
    ? "border-error/30 bg-error-container/25 text-error"
    : "border-tertiary-fixed/30 bg-tertiary-fixed/10 text-on-tertiary-fixed-variant";

  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm shadow-sm backdrop-blur",
        toneClass,
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="font-bold">
            {type === "PERMANENT_BAN"
              ? t("penalties.banner.permanentBanTitle")
              : type === "TEMPORARY_BAN"
                ? t("penalties.banner.temporaryBanTitle")
                : type === "APPROVAL_REQUIRED"
                  ? t("penalties.banner.approvalRequiredTitle")
                  : t("penalties.banner.warningTitle")}
          </p>
          <p className={cn("mt-0.5 text-xs opacity-90", isBlocking ? "text-error/90" : "text-on-tertiary-fixed-variant/80")}>
            {type === "TEMPORARY_BAN" && endLabel
              ? t("penalties.banner.bannedUntil", { end: endLabel })
              : type === "APPROVAL_REQUIRED" && endLabel
                ? t("penalties.banner.approvalRequiredUntil", { end: endLabel })
                : type === "PERMANENT_BAN"
                  ? t("penalties.banner.permanentBanHint")
                  : t("penalties.banner.warningHint")}
            {active.reason ? ` • ${active.reason}` : ""}
          </p>
        </div>

        <div className="shrink-0">
          <Link
            to="/penalties"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
              isBlocking
                ? "bg-error text-on-error hover:opacity-95"
                : "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant hover:bg-tertiary-fixed/30",
            )}
          >
            <span className="material-symbols-outlined text-[18px]">policy</span>
            {t("penalties.banner.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}

