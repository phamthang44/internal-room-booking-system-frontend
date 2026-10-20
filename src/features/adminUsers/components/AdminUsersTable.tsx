import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { UserBasicResponse } from "../types/adminUsers.api.types";

export interface AdminUsersTableProps {
  readonly rows: readonly UserBasicResponse[];
  readonly onOpenUser: (user: UserBasicResponse) => void;
  readonly onRequestToggleBan: (user: UserBasicResponse) => void;
  readonly busyUserId?: number | null;
  readonly onResetFilters?: () => void;
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

function RoleBadge({ role }: { readonly role: string | undefined }) {
  const { t } = useI18n();
  switch (role) {
    case "ADMIN":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 whitespace-nowrap shrink-0">
          <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
          {t("adminUsers.role.ADMIN")}
        </span>
      );
    case "STAFF":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-700 dark:text-sky-300 border border-sky-500/20 whitespace-nowrap shrink-0">
          <span className="material-symbols-outlined text-[14px]">badge</span>
          {t("adminUsers.role.STAFF")}
        </span>
      );
    case "STUDENT":
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 whitespace-nowrap shrink-0">
          <span className="material-symbols-outlined text-[14px]">school</span>
          {t("adminUsers.role.STUDENT")}
        </span>
      );
  }
}

function StatusBadge({ status }: { readonly status: string | undefined }) {
  const { t } = useI18n();
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold text-on-tertiary-fixed-variant whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/10">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          {t("adminUsers.status.ACTIVE")}
        </span>
      );
    case "BANNED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-3 py-1 text-xs font-bold text-error whitespace-nowrap shrink-0 border border-error/20">
          <span className="material-symbols-outlined text-[14px] shrink-0">lock</span>
          {t("adminUsers.status.BANNED")}
        </span>
      );
    case "INACTIVE":
    default:
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface-variant whitespace-nowrap shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 shrink-0" />
          {t("adminUsers.status.INACTIVE")}
        </span>
      );
  }
}

export function AdminUsersTable({
  rows,
  onOpenUser,
  onRequestToggleBan,
  busyUserId,
  onResetFilters,
}: AdminUsersTableProps) {
  const { t } = useI18n();

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-12 text-center shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-high text-on-surface-variant/80">
          <span className="material-symbols-outlined text-[36px]">person_search</span>
        </div>
        <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">
          {t("adminUsers.table.noData")}
        </h3>
        <p className="mt-1.5 max-w-md text-sm text-on-surface-variant">
          {t("adminUsers.table.noDataDesc")}
        </p>
        {onResetFilters ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-on-primary shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            {t("adminUsers.table.resetFilters")}
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[960px] text-left">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container-low/70">
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.user")}
              </th>
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.email")}
              </th>
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.studentCode")}
              </th>
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.role")}
              </th>
              <th className="px-6 py-4 text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.status")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((u) => {
              const isBusy = busyUserId != null && busyUserId === u.id;
              const isBanned = String(u.status) === "BANNED";

              return (
                <tr
                  key={u.id}
                  className={cn(
                    "group transition-all hover:bg-surface-container-low/50",
                    isBusy ? "opacity-50 pointer-events-none" : "",
                  )}
                >
                  {/* User name & avatar */}
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onOpenUser(u)}
                      className="group/btn flex items-center gap-3.5 text-left focus:outline-none"
                    >
                      <div className="relative shrink-0">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-transform group-hover/btn:scale-105",
                            getAvatarStyle(String(u.role)),
                          )}
                        >
                          <span className="text-xs font-extrabold">
                            {initials(u.username)}
                          </span>
                        </div>
                        {/* Status micro-dot at avatar corner */}
                        <span
                          className={cn(
                            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface",
                            isBanned
                              ? "bg-error"
                              : String(u.status) === "ACTIVE"
                                ? "bg-emerald-500"
                                : "bg-slate-400",
                          )}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-on-surface transition-colors group-hover/btn:text-primary">
                          {u.username}
                        </p>
                        <p className="font-mono text-xs text-on-surface-variant/70">
                          #{u.id}
                        </p>
                      </div>
                    </button>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant/60">
                        mail
                      </span>
                      <span className="text-sm font-medium text-on-surface select-all">
                        {u.email}
                      </span>
                    </div>
                  </td>

                  {/* Student Code */}
                  <td className="px-6 py-4">
                    {u.studentCode ? (
                      <span className="font-mono text-xs font-semibold rounded-lg bg-surface-container-high/60 px-2.5 py-1 text-on-surface-variant border border-outline-variant/20">
                        {u.studentCode}
                      </span>
                    ) : (
                      <span className="text-sm text-on-surface-variant/40">—</span>
                    )}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <RoleBadge role={String(u.role)} />
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <StatusBadge status={String(u.status)} />
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenUser(u)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-on-surface-variant transition-all hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
                        aria-label={t("adminUsers.actions.openDetails")}
                        title={t("adminUsers.actions.openDetails")}
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          visibility
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestToggleBan(u)}
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-transparent transition-all",
                          isBanned
                            ? "text-on-surface-variant hover:border-tertiary-fixed/40 hover:bg-tertiary-fixed/20 hover:text-on-tertiary-fixed-variant"
                            : "text-on-surface-variant hover:border-error/30 hover:bg-error-container/40 hover:text-error",
                        )}
                        aria-label={
                          isBanned
                            ? t("adminUsers.actions.unban")
                            : t("adminUsers.actions.ban")
                        }
                        title={
                          isBanned
                            ? t("adminUsers.actions.unban")
                            : t("adminUsers.actions.ban")
                        }
                      >
                        <span className="material-symbols-outlined text-[19px]">
                          {isBanned ? "lock_open" : "lock"}
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
