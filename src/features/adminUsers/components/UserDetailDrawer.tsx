import { useEffect, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { AdminUserRoleApi, UserBasicResponse } from "../types/adminUsers.api.types";
import { AdminPenaltyPanel } from "@features/penalties/components/AdminPenaltyPanel";

export interface UserDetailDrawerProps {
  readonly open: boolean;
  readonly user: UserBasicResponse | null;
  readonly busy?: boolean;
  readonly onClose: () => void;
  readonly onRequestChangeRole: (userId: number, roleName: AdminUserRoleApi) => void;
  readonly onRequestToggleBan: (userId: number) => void;
}

function initials(username: string): string {
  const parts = username
    .split(/[._\s-]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

function getAvatarStyle(role: string | undefined) {
  switch (role) {
    case "ADMIN":
      return "bg-gradient-to-br from-indigo-500/20 to-purple-500/30 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30";
    case "STAFF":
      return "bg-gradient-to-br from-sky-500/20 to-teal-500/30 text-sky-700 dark:text-sky-300 border border-sky-500/30";
    case "STUDENT":
    default:
      return "bg-gradient-to-br from-emerald-500/20 to-teal-500/30 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30";
  }
}

const ROLES_INFO: Array<{
  role: AdminUserRoleApi;
  icon: string;
  scopeKey: "drawer.adminScope" | "drawer.staffScope" | "drawer.studentScope";
}> = [
  { role: "ADMIN", icon: "admin_panel_settings", scopeKey: "drawer.adminScope" },
  { role: "STAFF", icon: "badge", scopeKey: "drawer.staffScope" },
  { role: "STUDENT", icon: "school", scopeKey: "drawer.studentScope" },
];

export function UserDetailDrawer({
  open,
  user,
  busy = false,
  onClose,
  onRequestChangeRole,
  onRequestToggleBan,
}: UserDetailDrawerProps) {
  const { t } = useI18n();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!copiedKey) return;
    const tmr = window.setTimeout(() => setCopiedKey(null), 1500);
    return () => window.clearTimeout(tmr);
  }, [copiedKey]);

  if (!open || !user) return null;

  const isBanned = String(user.status) === "BANNED";
  const userRole = String(user.role) as AdminUserRoleApi;

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex justify-end"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("adminUsers.drawer.ariaLabel")}
        className={cn(
          "relative z-10 flex h-full w-full max-w-[480px] flex-col",
          "border-l border-outline-variant/20 bg-surface-container-lowest/95 shadow-2xl backdrop-blur-xl",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              manage_accounts
            </span>
            <h2 className="font-headline text-base font-bold text-on-surface">
              {t("adminUsers.drawer.title")}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            aria-label={t("adminUsers.actions.close")}
            title={t("adminUsers.actions.close")}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* User Profile Hero */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-5">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-2xl shadow-md",
                    getAvatarStyle(userRole),
                  )}
                >
                  <span className="font-headline text-xl font-black">
                    {initials(user.username)}
                  </span>
                </div>
                <span
                  className={cn(
                    "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-surface",
                    isBanned
                      ? "bg-error"
                      : String(user.status) === "ACTIVE"
                        ? "bg-emerald-500"
                        : "bg-slate-400",
                  )}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-headline text-lg font-extrabold text-on-surface">
                    {user.username}
                  </h3>
                  <span className="font-mono text-xs font-semibold text-on-surface-variant/70">
                    #{user.id}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-on-surface-variant">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  {String(user.status) === "ACTIVE" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-0.5 text-xs font-bold text-on-tertiary-fixed-variant whitespace-nowrap shrink-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      {t("adminUsers.status.ACTIVE")}
                    </span>
                  ) : isBanned ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-3 py-0.5 text-xs font-bold text-error whitespace-nowrap shrink-0 border border-error/20">
                      <span className="material-symbols-outlined text-[13px] shrink-0">lock</span>
                      {t("adminUsers.status.BANNED")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-0.5 text-xs font-bold text-on-surface-variant whitespace-nowrap shrink-0">
                      {t("adminUsers.status.INACTIVE")}
                    </span>
                  )}

                  {/* Role Badge */}
                  <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-2.5 py-0.5 text-xs font-bold text-on-surface-variant">
                    {t(`adminUsers.role.${userRole}` as "adminUsers.role.ADMIN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Ban/Unban Action */}
            <div className="mt-5 pt-4 border-t border-outline-variant/20">
              <button
                type="button"
                disabled={busy}
                onClick={() => onRequestToggleBan(user.id)}
                className={cn(
                  "inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all disabled:opacity-50",
                  isBanned
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                    : "bg-error/10 text-error hover:bg-error hover:text-on-error border border-error/30 shadow-sm",
                )}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isBanned ? "lock_open" : "lock"}
                </span>
                <span>{isBanned ? t("adminUsers.actions.unban") : t("adminUsers.actions.ban")}</span>
              </button>
              <p className="mt-2 text-center text-[11px] text-on-surface-variant/70">
                {t("adminUsers.drawer.actionsHint")}
              </p>
            </div>
          </div>

          {/* Identifiers Grid */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
              {t("adminUsers.drawer.fields.identifiers")}
            </p>
            <div className="mt-3 space-y-2.5">
              <Row
                icon="badge"
                label={t("adminUsers.drawer.fields.userId")}
                value={`#${user.id}`}
                onCopy={() => void copy("id", String(user.id))}
                copied={copiedKey === "id"}
                copyLabel={t("adminUsers.actions.copy")}
                copiedLabel={t("adminUsers.actions.copied")}
              />
              <Row
                icon="mail"
                label={t("adminUsers.drawer.fields.email")}
                value={user.email}
                onCopy={() => void copy("email", user.email)}
                copied={copiedKey === "email"}
                copyLabel={t("adminUsers.actions.copy")}
                copiedLabel={t("adminUsers.actions.copied")}
              />
              <Row
                icon="school"
                label={t("adminUsers.drawer.fields.studentCode")}
                value={user.studentCode ?? "—"}
                onCopy={() =>
                  user.studentCode ? void copy("studentCode", user.studentCode) : undefined
                }
                copied={copiedKey === "studentCode"}
                disabled={!user.studentCode}
                copyLabel={t("adminUsers.actions.copy")}
                copiedLabel={t("adminUsers.actions.copied")}
              />
            </div>
          </div>

          {/* Role Assignment Card with interactive role options */}
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.drawer.roleChangeTitle")}
              </p>
            </div>
            <p className="mt-1 text-xs text-on-surface-variant">
              {t("adminUsers.drawer.roleChangeDesc")}
            </p>

            <div className="mt-3.5 space-y-2">
              {ROLES_INFO.map((r) => {
                const isCurrent = userRole === r.role;
                return (
                  <button
                    key={r.role}
                    type="button"
                    disabled={busy || isCurrent}
                    onClick={() => onRequestChangeRole(user.id, r.role)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
                      isCurrent
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-outline-variant/30 bg-surface-container-lowest/80 hover:border-primary/40 hover:bg-surface-container-low disabled:cursor-default",
                    )}
                  >
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg text-sm shrink-0",
                        isCurrent
                          ? "bg-primary text-on-primary"
                          : "bg-surface-container-high text-on-surface-variant group-hover:text-primary",
                      )}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {r.icon}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-on-surface">
                          {t(`adminUsers.role.${r.role}` as "adminUsers.role.ADMIN")}
                        </span>
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                            <span className="material-symbols-outlined text-[14px]">
                              check_circle
                            </span>
                            {t("adminUsers.drawer.currentRole")}
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                            {t("adminUsers.drawer.changeToThisRole")} →
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-on-surface-variant/80">
                        {t(`adminUsers.${r.scopeKey}` as "adminUsers.drawer.adminScope")}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Penalties Panel */}
          <AdminPenaltyPanel userId={user.id} />
        </div>
      </aside>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
  disabled = false,
}: {
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly onCopy: () => void;
  readonly copied: boolean;
  readonly copyLabel: string;
  readonly copiedLabel: string;
  readonly disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest/80 px-3.5 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant/60">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
            {label}
          </p>
          <p className="truncate text-sm font-semibold text-on-surface select-all">{value}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30",
          copied
            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
            : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        )}
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
      >
        <span className="material-symbols-outlined text-[16px]">
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    </div>
  );
}
