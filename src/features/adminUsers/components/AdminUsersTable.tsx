import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { UserBasicResponse } from "../types/adminUsers.api.types";

export interface AdminUsersTableProps {
  readonly rows: readonly UserBasicResponse[];
  readonly onOpenUser: (user: UserBasicResponse) => void;
  readonly onRequestToggleBan: (user: UserBasicResponse) => void;
  readonly busyUserId?: number | null;
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

function statusPillClass(status: string | undefined) {
  switch (status) {
    case "ACTIVE":
      return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
    case "BANNED":
      return "bg-error-container text-error";
    case "INACTIVE":
      return "bg-surface-container-high text-on-surface-variant";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

export function AdminUsersTable({
  rows,
  onOpenUser,
  onRequestToggleBan,
  busyUserId,
}: AdminUsersTableProps) {
  const { t } = useI18n();

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="bg-surface-container-low/40">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.user")}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.email")}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.studentCode")}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.role")}
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.status")}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminUsers.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-outline-variant/10">
            {rows.map((u, idx) => {
              const zebra =
                idx % 2 === 0 ? "bg-background/40" : "bg-surface-container-low/30";
              const isBusy = busyUserId != null && busyUserId === u.id;
              const isBanned = String(u.status) === "BANNED";

              return (
                <tr
                  key={u.id}
                  className={cn(
                    "group transition-colors",
                    zebra,
                    "hover:bg-surface-container-low/60",
                    isBusy ? "opacity-60 pointer-events-none" : "",
                  )}
                >
                  <td className="px-6 py-5">
                    <button
                      type="button"
                      onClick={() => onOpenUser(u)}
                      className="flex w-full items-center gap-4 text-left"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-container/10 text-primary">
                        <span className="text-sm font-extrabold">
                          {initials(u.username)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-on-surface">
                          {u.username}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          #{u.id}
                        </p>
                      </div>
                    </button>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-on-surface">
                      {u.email}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="text-sm text-on-surface-variant">
                      {u.studentCode ?? "—"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full bg-surface-container-high px-3 py-1 text-xs font-bold text-on-surface-variant">
                      {t(`adminUsers.role.${String(u.role)}` as "adminUsers.role.ADMIN")}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                        statusPillClass(String(u.status)),
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      {t(
                        `adminUsers.status.${String(u.status)}` as "adminUsers.status.ACTIVE",
                      )}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenUser(u)}
                        className="rounded-xl p-2 text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors"
                        aria-label={t("adminUsers.actions.openDetails")}
                        title={t("adminUsers.actions.openDetails")}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          open_in_new
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRequestToggleBan(u)}
                        className={cn(
                          "rounded-xl p-2 transition-colors",
                          isBanned
                            ? "text-on-surface-variant hover:bg-tertiary-fixed/20 hover:text-on-tertiary-fixed-variant"
                            : "text-on-surface-variant hover:bg-error-container/30 hover:text-error",
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
                        <span className="material-symbols-outlined text-[20px]">
                          {isBanned ? "lock_open" : "block"}
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

