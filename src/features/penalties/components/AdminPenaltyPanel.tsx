import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
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

function toLocalDatetimeString(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${y}-${m}-${d}T${h}:${min}`;
}

function pickActive(rows: PenaltyRecordResponse[] | undefined | null): PenaltyRecordResponse | null {
  const list = rows ?? [];
  const active = list.filter(isPenaltyActive);
  if (active.length === 0) return null;
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
  const actionUpper = (activePenalty?.action ?? "").toString().toUpperCase();
  const isRevoked = statusUpper === "REVOKED" || actionUpper === "REVOKED";
  const actionsDisabled = busy || isRevoked;

  return (
    <section className={cn("rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            gavel
          </span>
          <p className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
            {t("adminPenalties.title")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={`/admin/users/${userId}/penalties`}
            className="text-xs font-bold text-primary hover:underline"
          >
            {t("adminPenalties.actions.viewAll")} →
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

      <div className="mt-3.5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/80 p-4">
        {activePenalty ? (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-error-container/40 px-2.5 py-0.5 text-xs font-bold text-error border border-error/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-error animate-pulse" />
                    {t("adminPenalties.active")}
                  </span>
                  {typeLabel ? (
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {typeLabel}
                    </span>
                  ) : null}
                </div>

                {endIso ? (
                  <p className="mt-2 text-xs font-bold text-on-surface">
                    {t("adminPenalties.activeUntil", { end: formatInstant(endIso, locale) })}
                  </p>
                ) : null}

                {activePenalty.reason ? (
                  <p className="mt-1.5 text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    <span className="font-semibold text-on-surface">Lý do: </span>
                    {activePenalty.reason}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setExtendOpen(true)}
                  disabled={actionsDisabled}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-xs font-bold text-on-surface transition-all hover:bg-surface-container-high hover:border-primary/40 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">calendar_add_on</span>
                  {t("adminPenalties.actions.extend")}
                </button>
                <button
                  type="button"
                  onClick={() => setRevokeOpen(true)}
                  disabled={actionsDisabled}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-error/20 bg-error-container/30 px-3 py-2 text-xs font-bold text-error transition-all hover:bg-error-container/60 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[16px]">undo</span>
                  {t("adminPenalties.actions.revoke")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px] text-emerald-500 shrink-0">
              verified
            </span>
            <span>{t("adminPenalties.noneActive")}</span>
          </div>
        )}
      </div>

      <RevokePenaltyModal
        open={revokeOpen}
        busy={revokeMutation.isPending}
        onClose={() => setRevokeOpen(false)}
        onConfirm={(reason) => {
          if (!activePenalty) return;
          revokeMutation.mutate(
            { penaltyId: activePenalty.id, payload: { reason } },
            { onSuccess: () => setRevokeOpen(false) },
          );
        }}
      />

      <ExtendPenaltyModal
        open={extendOpen}
        busy={extendMutation.isPending}
        currentEndIso={endIso}
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
  subtitle,
  icon,
  iconClass,
  children,
  onClose,
}: {
  readonly open: boolean;
  readonly busy: boolean;
  readonly title: string;
  readonly subtitle?: string;
  readonly icon?: string;
  readonly iconClass?: string;
  readonly children: React.ReactNode;
  readonly onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      {/* Full-screen backdrop overlay */}
      <div className="fixed inset-0 bg-on-surface/50 backdrop-blur-sm" />

      {/* Centered Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-outline-variant/20",
          "bg-surface-container-lowest/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl",
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {icon ? (
              <div
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl shrink-0 shadow-sm",
                  iconClass ?? "bg-primary/10 text-primary",
                )}
              >
                <span className="material-symbols-outlined text-[22px]">{icon}</span>
              </div>
            ) : null}
            <div>
              <h3 className="font-headline text-lg font-extrabold text-on-surface">
                {title}
              </h3>
              {subtitle ? (
                <p className="mt-0.5 text-xs text-on-surface-variant leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
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

  useEffect(() => {
    if (!open) return;
    setReason("");
  }, [open]);

  return (
    <ModalShell
      open={open}
      busy={busy}
      onClose={onClose}
      title={t("adminPenalties.revoke.title")}
      subtitle={t("adminPenalties.revoke.subtitle")}
      icon="history_toggle_off"
      iconClass="bg-error/10 text-error"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            {t("adminPenalties.fields.reason")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder={t("adminPenalties.revoke.reasonPlaceholder")}
            disabled={busy}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface px-3.5 py-2.5 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-error/50 focus:ring-2 focus:ring-error/10 disabled:opacity-50"
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50 transition-colors"
          >
            {t("adminPenalties.actions.cancel")}
          </button>
          <button
            type="button"
            disabled={busy || !reason.trim()}
            onClick={() => onConfirm(reason.trim())}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-error px-5 text-sm font-bold text-on-error shadow-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {busy ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>{t("adminPenalties.actions.saving")}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">undo</span>
                <span>{t("adminPenalties.revoke.confirm")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function ExtendPenaltyModal({
  open,
  busy,
  currentEndIso,
  onClose,
  onConfirm,
}: {
  readonly open: boolean;
  readonly busy: boolean;
  readonly currentEndIso?: string | null;
  readonly onClose: () => void;
  readonly onConfirm: (reason: string, newEndDateIso: string) => void;
}) {
  const { t } = useI18n();
  const locale = localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US";
  const [reason, setReason] = useState("");
  const [newEndLocal, setNewEndLocal] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");

    // Calculate initial suggestion: 7 days from current end (or from now)
    const base = currentEndIso && new Date(currentEndIso).getTime() > Date.now()
      ? new Date(currentEndIso)
      : new Date();
    const suggested = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000);
    setNewEndLocal(toLocalDatetimeString(suggested));
  }, [open, currentEndIso]);

  const canSubmit = Boolean(reason.trim() && newEndLocal.trim());

  const applyPresetDays = (days: number) => {
    const base = currentEndIso && new Date(currentEndIso).getTime() > Date.now()
      ? new Date(currentEndIso)
      : new Date();
    const next = new Date(base.getTime() + days * 24 * 60 * 60 * 1000);
    setNewEndLocal(toLocalDatetimeString(next));
  };

  return (
    <ModalShell
      open={open}
      busy={busy}
      onClose={onClose}
      title={t("adminPenalties.extend.title")}
      subtitle={t("adminPenalties.extend.subtitle")}
      icon="calendar_clock"
      iconClass="bg-primary/10 text-primary"
    >
      <div className="space-y-4">
        {/* Current expiration card */}
        {currentEndIso ? (
          <div className="flex items-center justify-between rounded-xl border border-outline-variant/20 bg-surface-container-low/50 px-3.5 py-2.5 text-xs">
            <span className="font-semibold text-on-surface-variant">
              {t("adminPenalties.extend.currentEnd")}
            </span>
            <span className="font-mono font-bold text-on-surface">
              {formatInstant(currentEndIso, locale)}
            </span>
          </div>
        ) : null}

        {/* Quick Presets */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            {t("adminPenalties.extend.quickPresets")}
          </label>
          <div className="flex flex-wrap gap-2">
            {[3, 7, 14, 30].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => applyPresetDays(days)}
                disabled={busy}
                className="inline-flex items-center gap-1 rounded-xl border border-outline-variant/30 bg-surface px-3 py-1.5 text-xs font-bold text-on-surface transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px] text-primary">add</span>
                +{days} ngày
              </button>
            ))}
          </div>
        </div>

        {/* Date Time Local Input */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            {t("adminPenalties.fields.newEndDate")}
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={newEndLocal}
              onChange={(e) => setNewEndLocal(e.target.value)}
              disabled={busy}
              className="h-11 w-full rounded-xl border border-outline-variant/30 bg-surface px-3.5 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
            />
          </div>
          <p className="mt-1 text-[11px] text-on-surface-variant/70">
            {t("adminPenalties.extend.dateHint")}
          </p>
        </div>

        {/* Reason Textarea */}
        <div>
          <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
            {t("adminPenalties.fields.reason")}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder={t("adminPenalties.extend.reasonPlaceholder")}
            disabled={busy}
            className="w-full rounded-xl border border-outline-variant/30 bg-surface px-3.5 py-2.5 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
          <button
            type="button"
            disabled={busy}
            onClick={onClose}
            className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50 transition-colors"
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
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-on-primary transition-all disabled:opacity-40",
              "bg-gradient-to-r from-primary to-primary-container shadow-md shadow-primary/20 hover:shadow-primary/30",
            )}
          >
            {busy ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>{t("adminPenalties.actions.saving")}</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
                <span>{t("adminPenalties.extend.confirm")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
