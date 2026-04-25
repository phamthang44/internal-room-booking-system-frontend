import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { PenaltyRecordResponse } from "../types/penalties.api.types";
import { isPenaltyActive, penaltyEndIso, penaltyTitle } from "../utils/penalties.utils";
import {
  useAdminUserPenaltiesQuery,
  useExtendPenaltyMutation,
  useRevokePenaltyMutation,
} from "../hooks/usePenaltiesQueries";

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

function pickActive(rows: PenaltyRecordResponse[] | undefined | null): PenaltyRecordResponse | null {
  const list = rows ?? [];
  const active = list.filter(isPenaltyActive);
  if (active.length === 0) return null;
  // latest by end date (best effort)
  const endMs = (p: PenaltyRecordResponse) => {
    const endIso = penaltyEndIso(p);
    if (!endIso) return Number.MAX_SAFE_INTEGER;
    const d = new Date(endIso);
    return Number.isNaN(d.getTime()) ? 0 : d.getTime();
  };
  return [...active].sort((a, b) => endMs(b) - endMs(a))[0] ?? null;
}

export function AdminPenaltyPanel({ userId, className }: { readonly userId: number; readonly className?: string }) {
  const { t } = useI18n();
  const locale = localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US";

  const q = useAdminUserPenaltiesQuery(userId);
  const revokeMutation = useRevokePenaltyMutation({ userId });
  const extendMutation = useExtendPenaltyMutation({ userId });

  const [revokeOpen, setRevokeOpen] = useState(false);
  const [extendOpen, setExtendOpen] = useState(false);

  const activePenalty = useMemo(() => {
    const fromActive = pickActive(q.data?.penalties);
    return fromActive ?? (q.data?.activePenalty ?? null);
  }, [q.data?.activePenalty, q.data?.penalties]);

  const busy = q.isFetching || revokeMutation.isPending || extendMutation.isPending;

  const typeLabel = activePenalty ? penaltyTitle(activePenalty) : null;
  const endIso = activePenalty ? penaltyEndIso(activePenalty) : null;
  const statusUpper = (activePenalty?.status ?? "").toString().toUpperCase();
  const isRevoked = statusUpper === "REVOKED";
  const actionsDisabled = busy || isRevoked;

  return (
    <section className={cn("rounded-2xl bg-surface-container-low/60 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
          {t("adminPenalties.title")}
        </p>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/users/${userId}/penalties`}
            className="text-[11px] font-bold text-primary hover:underline"
          >
            {t("adminPenalties.actions.viewAll")}
          </Link>
          {busy ? (
            <span className="text-[10px] font-bold text-on-surface-variant/60">
              {t("adminPenalties.loading")}
            </span>
          ) : null}
        </div>
      </div>

      {q.isError ? (
        <div className="mt-3 rounded-xl border border-error/30 bg-error-container/20 p-3 text-xs text-error">
          {t("adminPenalties.loadFailed")}
        </div>
      ) : null}

      <div className="mt-3 rounded-xl bg-surface-container-lowest/70 p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-on-surface">
              {activePenalty ? t("adminPenalties.active") : t("adminPenalties.noneActive")}
            </p>
            {activePenalty ? (
              <p className="mt-1 text-xs text-on-surface-variant">
                {t("adminPenalties.activeType", { type: String(typeLabel) })}
                {endIso ? ` • ${t("adminPenalties.activeUntil", { end: formatInstant(endIso, locale) })}` : ""}
              </p>
            ) : null}
            {activePenalty?.reason ? (
              <p className="mt-2 text-xs text-on-surface-variant line-clamp-3">{activePenalty.reason}</p>
            ) : null}
          </div>

          {activePenalty ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExtendOpen(true)}
                disabled={actionsDisabled}
                className="inline-flex items-center gap-2 rounded-xl bg-surface px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                {t("adminPenalties.actions.extend")}
              </button>
              <button
                type="button"
                onClick={() => setRevokeOpen(true)}
                disabled={actionsDisabled}
                className="inline-flex items-center gap-2 rounded-xl bg-error-container/40 px-3 py-2 text-xs font-bold text-error hover:bg-error-container/60 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">undo</span>
                {t("adminPenalties.actions.revoke")}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <RevokePenaltyModal
        open={revokeOpen}
        busy={revokeMutation.isPending}
        onClose={() => setRevokeOpen(false)}
        onConfirm={(reason) => {
          if (!activePenalty) return;
          revokeMutation.mutate({ penaltyId: activePenalty.id, payload: { reason } }, { onSuccess: () => setRevokeOpen(false) });
        }}
      />

      <ExtendPenaltyModal
        open={extendOpen}
        busy={extendMutation.isPending}
        onClose={() => setExtendOpen(false)}
        onConfirm={(reason, newEndDateIso) => {
          if (!activePenalty) return;
          extendMutation.mutate(
            { penaltyId: activePenalty.id, payload: { reason, newEndDate: newEndDateIso } },
            { onSuccess: () => setExtendOpen(false) },
          );
        }}
      />
    </section>
  );
}

function ModalShell({
  open,
  busy,
  title,
  children,
  onClose,
}: {
  readonly open: boolean;
  readonly busy: boolean;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95]" role="presentation" onMouseDown={() => !busy && onClose()}>
      <div className="absolute inset-0 bg-on-surface/35 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className="absolute left-1/2 top-1/2 w-[min(560px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-on-surface">{title}</p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function RevokePenaltyModal({
  open,
  busy,
  onClose,
  onConfirm,
}: {
  readonly open: boolean;
  readonly busy: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (reason: string) => void;
}) {
  const { t } = useI18n();
  const [reason, setReason] = useState("");

  return (
    <ModalShell open={open} busy={busy} onClose={onClose} title={t("adminPenalties.revoke.title")}>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {t("adminPenalties.fields.reason")}
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={4}
        placeholder={t("adminPenalties.revoke.reasonPlaceholder")}
        className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
      />

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="h-10 rounded-xl border border-outline-variant/40 bg-surface px-4 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
        >
          {t("adminPenalties.actions.cancel")}
        </button>
        <button
          type="button"
          disabled={busy || !reason.trim()}
          onClick={() => onConfirm(reason.trim())}
          className="h-10 rounded-xl bg-error px-4 text-xs font-bold text-on-error disabled:opacity-50"
        >
          {busy ? t("adminPenalties.actions.saving") : t("adminPenalties.revoke.confirm")}
        </button>
      </div>
    </ModalShell>
  );
}

function ExtendPenaltyModal({
  open,
  busy,
  onClose,
  onConfirm,
}: {
  readonly open: boolean;
  readonly busy: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (reason: string, newEndDateIso: string) => void;
}) {
  const { t } = useI18n();
  const [reason, setReason] = useState("");
  const [newEndLocal, setNewEndLocal] = useState("");

  const canSubmit = reason.trim() && newEndLocal.trim();

  return (
    <ModalShell open={open} busy={busy} onClose={onClose} title={t("adminPenalties.extend.title")}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
            {t("adminPenalties.fields.reason")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={t("adminPenalties.extend.reasonPlaceholder")}
            className="w-full rounded-xl border border-outline-variant/40 bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
            {t("adminPenalties.fields.newEndDate")}
          </label>
          <input
            type="datetime-local"
            value={newEndLocal}
            onChange={(e) => setNewEndLocal(e.target.value)}
            className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
          />
          <p className="mt-1 text-[11px] text-on-surface-variant">
            {t("adminPenalties.extend.dateHint")}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={onClose}
          className="h-10 rounded-xl border border-outline-variant/40 bg-surface px-4 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
        >
          {t("adminPenalties.actions.cancel")}
        </button>
        <button
          type="button"
          disabled={busy || !canSubmit}
          onClick={() => {
            const iso = new Date(newEndLocal).toISOString();
            onConfirm(reason.trim(), iso);
          }}
          className="h-10 rounded-xl bg-primary px-4 text-xs font-bold text-on-primary disabled:opacity-50"
        >
          {busy ? t("adminPenalties.actions.saving") : t("adminPenalties.extend.confirm")}
        </button>
      </div>
    </ModalShell>
  );
}

