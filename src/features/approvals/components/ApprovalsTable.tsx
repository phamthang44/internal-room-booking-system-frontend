import { cn } from "@shared/utils/cn";
import type { ApprovalRowUI } from "../types/approvals.ui.types";
import { useI18n } from "@shared/i18n/useI18n";

export interface ApprovalsTableProps {
  readonly rows: readonly ApprovalRowUI[];
  readonly selectedIds: ReadonlySet<number>;
  readonly onToggleSelected: (bookingId: number) => void;
  readonly onToggleAll: (bookingIds: number[], selected: boolean) => void;
  readonly onApprove: (bookingId: number) => void;
  readonly onReject: (bookingId: number) => void;
  readonly onHoverBooking?: (bookingId: number | null, anchorRect: DOMRect | null) => void;
  readonly onOpenDetail?: (bookingId: number) => void;
}

function ReliabilityIcon({ flag }: { readonly flag: ApprovalRowUI["student"]["reliability"] }) {
  if (flag === "reliable") {
    return (
      <span
        className="material-symbols-outlined text-[14px] text-emerald-500"
        style={{ fontVariationSettings: "'FILL' 1" }}
        title="Reliable Student"
      >
        verified
      </span>
    );
  }
  if (flag === "highNoShow") {
    return (
      <span
        className="material-symbols-outlined text-[14px] text-rose-600"
        style={{ fontVariationSettings: "'FILL' 1" }}
        title="High No-Show Risk"
      >
        report
      </span>
    );
  }
  return null;
}

function LoadBar({ pct, tone }: { readonly pct: number; readonly tone: "primary" | "warning" | "neutral" }) {
  const w = `${Math.round(Math.min(1, Math.max(0, pct)) * 100)}%`;
  const barClass =
    tone === "warning" ? "bg-amber-500" : tone === "neutral" ? "bg-surface-container-high" : "bg-primary";
  return (
    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-container-high">
      <div className={cn("h-full", barClass)} style={{ width: w }} />
    </div>
  );
}

function StatusBadge({ status }: { readonly status: ApprovalRowUI["status"] }) {
  const { t } = useI18n();
  if (status.badgeTone === "conflict") {
    return (
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-error-container/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-error">
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
          {t(status.badgeLabelKey)}
        </div>
        {status.hint ? (
          <p className="mt-1 text-[10px] italic text-error">{status.hint}</p>
        ) : null}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
      <span className="material-symbols-outlined text-sm">event_available</span>
      {t(status.badgeLabelKey)}
    </div>
  );
}

export function ApprovalsTable({
  rows,
  selectedIds,
  onToggleSelected,
  onToggleAll,
  onApprove,
  onReject,
  onHoverBooking,
  onOpenDetail,
}: ApprovalsTableProps) {
  const { t } = useI18n();
  const allIds = rows.map((r) => r.bookingId).filter((id) => id > 0);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));
  const someSelected = allIds.some((id) => selectedIds.has(id));

  return (
    <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-surface-container-low text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
              <th className="w-10 px-4 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                  checked={allSelected}
                  ref={(el) => {
                    if (!el) return;
                    el.indeterminate = !allSelected && someSelected;
                  }}
                  onChange={(e) => onToggleAll(allIds, e.target.checked)}
                />
              </th>
              <th className="px-6 py-4">{t("approvals.table.student")}</th>
              <th className="px-6 py-4">{t("approvals.table.request")}</th>
              <th className="px-6 py-4">{t("approvals.table.venue")}</th>
              <th className="px-6 py-4">{t("approvals.table.date")}</th>
              <th className="px-6 py-4">{t("approvals.table.status")}</th>
              <th className="px-6 py-4 text-right">{t("approvals.table.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container">
            {rows.map((row, idx) => {
              const zebra = idx % 2 === 0 ? "bg-background" : "bg-surface-container-low";
              return (
                <tr
                  key={row.bookingId}
                  className={cn(
                    "group",
                    zebra,
                    onOpenDetail
                      ? "cursor-pointer hover:bg-surface-container-high/40 transition-colors"
                      : "",
                  )}
                  onMouseEnter={(e) => {
                    const rect =
                      (e.currentTarget as HTMLElement | null)?.getBoundingClientRect?.() ?? null;
                    onHoverBooking?.(row.bookingId, rect);
                  }}
                  onMouseLeave={() => onHoverBooking?.(null, null)}
                  onClick={() => onOpenDetail?.(row.bookingId)}
                >
                  <td className="px-4 py-5">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                      checked={selectedIds.has(row.bookingId)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => onToggleSelected(row.bookingId)}
                    />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-primary">
                        {row.student.initials}
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-bold text-on-surface">
                          {row.student.fullName}
                          <ReliabilityIcon flag={row.student.reliability} />
                        </p>
                        <p className="text-[10px] text-on-surface-variant">
                          {t("approvals.table.bookingIdLabel")} {row.bookingId}
                        </p>
                        {row.student.reliability === "highNoShow" ? (
                          <span className="mt-1 inline-block rounded bg-rose-100 px-1.5 py-0.5 text-[8px] font-black uppercase text-rose-700">
                            High No-Show
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {row.purposeTitle}
                    </p>
                    {row.purposeSubtitle ? (
                      <p className="text-[10px] italic text-on-surface-variant">
                        {row.purposeSubtitle}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-on-surface">
                      {row.venue.roomName}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <LoadBar pct={row.venue.loadPct} tone={row.venue.loadTone} />
                      <p
                        className={cn(
                          "text-[10px] font-bold",
                          row.venue.loadTone === "warning"
                            ? "text-amber-600"
                            : "text-on-surface-variant",
                        )}
                      >
                        {row.venue.loadLabel}
                      </p>
                    </div>
                    {row.venue.loadTone === "primary" && row.venue.loadPct <= 0.35 ? (
                      <p className="mt-1 text-[10px] font-medium text-amber-600">
                        Low utilization
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-on-surface">
                      {row.date.dateLabel}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {row.date.timeLabel}
                    </p>
                    {row.date.slotName ? (
                      <p className="mt-1 text-[10px] italic text-on-surface-variant">
                        {row.date.slotName}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition-colors hover:bg-emerald-200"
                        title={t("approvals.actions.approve")}
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(row.bookingId);
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          check
                        </span>
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-100 text-rose-700 transition-colors hover:bg-rose-200"
                        title={t("approvals.actions.reject")}
                        onClick={(e) => {
                          e.stopPropagation();
                          onReject(row.bookingId);
                        }}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          close
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

