import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { CustomSelect, type CustomSelectOption } from "@shared/components/CustomSelect";
import type { AdminUserRoleApi, UserBasicResponse } from "../types/adminUsers.api.types";

export interface UserDetailDrawerProps {
  readonly open: boolean;
  readonly user: UserBasicResponse | null;
  readonly busy?: boolean;
  readonly onClose: () => void;
  readonly onRequestChangeRole: (userId: number, roleName: AdminUserRoleApi) => void;
  readonly onRequestToggleBan: (userId: number) => void;
}

const ROLE_OPTIONS: CustomSelectOption[] = [
  { value: "ADMIN", label: "adminUsers.role.ADMIN" },
  { value: "STAFF", label: "adminUsers.role.STAFF" },
  { value: "STUDENT", label: "adminUsers.role.STUDENT" },
];

function initials(username: string): string {
  const parts = username
    .split(/[._\s-]+/g)
    .map((p) => p.trim())
    .filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (a + b).toUpperCase();
}

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

  const roleValue = useMemo(() => {
    if (!user) return "STUDENT";
    const r = String(user.role) as AdminUserRoleApi;
    return (ROLE_OPTIONS.some((o) => o.value === r) ? r : "STUDENT") as AdminUserRoleApi;
  }, [user]);

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
    const tmr = window.setTimeout(() => setCopiedKey(null), 1200);
    return () => window.clearTimeout(tmr);
  }, [copiedKey]);

  if (!open || !user) return null;

  const isBanned = String(user.status) === "BANNED";
  const statusTone =
    String(user.status) === "ACTIVE"
      ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
      : String(user.status) === "BANNED"
        ? "bg-error-container text-error"
        : "bg-surface-container-high text-on-surface-variant";

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
      className="fixed inset-0 z-[85]"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      <div className="absolute inset-0 bg-on-surface/35 backdrop-blur-sm" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("adminUsers.drawer.ariaLabel")}
        className={cn(
          "absolute inset-y-0 right-0 w-full max-w-[440px] overflow-y-auto",
          "border-l border-outline-variant/20 bg-surface-container-lowest/75 shadow-2xl backdrop-blur-md",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.drawer.title")}
              </p>
              <h2 className="mt-1 truncate font-headline text-xl font-extrabold text-on-surface">
                {user.username}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant truncate">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
              aria-label={t("adminUsers.actions.close")}
              title={t("adminUsers.actions.close")}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-2xl bg-surface-container-low/60 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/10 text-primary">
              <span className="text-base font-extrabold">
                {initials(user.username)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                    statusTone,
                  )}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  {t(
                    `adminUsers.status.${String(user.status)}` as "adminUsers.status.ACTIVE",
                  )}
                </span>
                <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface-variant">
                  {t(`adminUsers.role.${String(user.role)}` as "adminUsers.role.ADMIN")}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-on-surface-variant">
                {t("adminUsers.drawer.idLabel")}{" "}
                <span className="font-bold text-on-surface">#{user.id}</span>
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
                {t("adminUsers.drawer.fields.role")}
              </label>
              <CustomSelect
                value={roleValue}
                options={ROLE_OPTIONS}
                onChange={(val) => onRequestChangeRole(user.id, val as AdminUserRoleApi)}
                className="w-full"
                menuClassName="z-[90]"
                disabled={busy}
              />
            </div>

            <div className="rounded-2xl bg-surface-container-low/60 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.drawer.fields.identifiers")}
              </p>

              <div className="mt-3 space-y-2">
                <Row
                  label={t("adminUsers.drawer.fields.userId")}
                  value={String(user.id)}
                  onCopy={() => void copy("id", String(user.id))}
                  copied={copiedKey === "id"}
                  copyLabel={t("adminUsers.actions.copy")}
                  copiedLabel={t("adminUsers.actions.copied")}
                />
                <Row
                  label={t("adminUsers.drawer.fields.email")}
                  value={user.email}
                  onCopy={() => void copy("email", user.email)}
                  copied={copiedKey === "email"}
                  copyLabel={t("adminUsers.actions.copy")}
                  copiedLabel={t("adminUsers.actions.copied")}
                />
                <Row
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

            <div className="rounded-2xl bg-surface-container-low/60 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.drawer.fields.actions")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    onRequestToggleBan(user.id);
                  }}
                  className={cn(
                    "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-colors disabled:opacity-50",
                    isBanned
                      ? "bg-tertiary-fixed/20 text-on-tertiary-fixed-variant hover:bg-tertiary-fixed/30"
                      : "bg-error-container/40 text-error hover:bg-error-container/60",
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isBanned ? "lock_open" : "block"}
                  </span>
                  {isBanned ? t("adminUsers.actions.unban") : t("adminUsers.actions.ban")}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-on-surface-variant">
                {t("adminUsers.drawer.actionsHint")}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  value,
  onCopy,
  copied,
  copyLabel,
  copiedLabel,
  disabled = false,
}: {
  readonly label: string;
  readonly value: string;
  readonly onCopy: () => void;
  readonly copied: boolean;
  readonly copyLabel: string;
  readonly copiedLabel: string;
  readonly disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-lowest/60 px-3 py-2">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-on-surface">{value}</p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        disabled={disabled}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={copied ? copiedLabel : copyLabel}
        title={copied ? copiedLabel : copyLabel}
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    </div>
  );
}

