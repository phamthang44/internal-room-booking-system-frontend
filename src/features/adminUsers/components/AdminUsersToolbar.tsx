import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { CustomSelect, type CustomSelectOption } from "@shared/components/CustomSelect";
import type { AdminUserRoleApi, AdminUserStatusApi } from "../types/adminUsers.api.types";

export interface AdminUsersToolbarValue {
  readonly searchInput: string;
  readonly roleFilter: AdminUserRoleApi | "ALL";
  readonly statusFilter: AdminUserStatusApi | "ALL";
}

export interface AdminUsersToolbarProps {
  readonly value: AdminUsersToolbarValue;
  readonly onChange: (next: AdminUsersToolbarValue) => void;
  readonly onReset: () => void;
  readonly onCreate: () => void;
  readonly activeFilterCount: number;
  readonly className?: string;
}

const ROLE_OPTIONS: CustomSelectOption[] = [
  { value: "ALL", label: "adminUsers.filters.role.all" },
  { value: "ADMIN", label: "adminUsers.role.ADMIN" },
  { value: "STAFF", label: "adminUsers.role.STAFF" },
  { value: "STUDENT", label: "adminUsers.role.STUDENT" },
];

const STATUS_OPTIONS: CustomSelectOption[] = [
  { value: "ALL", label: "adminUsers.filters.status.all" },
  { value: "ACTIVE", label: "adminUsers.status.ACTIVE" },
  { value: "INACTIVE", label: "adminUsers.status.INACTIVE" },
  { value: "BANNED", label: "adminUsers.status.BANNED" },
];

export function AdminUsersToolbar({
  value,
  onChange,
  onReset,
  onCreate,
  activeFilterCount,
  className,
}: AdminUsersToolbarProps) {
  const { t } = useI18n();

  return (
    <section
      className={cn(
        "rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-3 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md",
        className,
      )}
      aria-label={t("adminUsers.filters.ariaLabel")}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="h-11 w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
            placeholder={t("adminUsers.filters.searchPlaceholder")}
            value={value.searchInput}
            onChange={(e) =>
              onChange({
                ...value,
                searchInput: e.target.value,
              })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
          <CustomSelect
            value={value.roleFilter}
            options={ROLE_OPTIONS}
            icon="badge"
            onChange={(val) =>
              onChange({
                ...value,
                roleFilter: val as AdminUserRoleApi | "ALL",
              })
            }
            className="w-full lg:w-[200px]"
          />
          <CustomSelect
            value={value.statusFilter}
            options={STATUS_OPTIONS}
            icon="verified_user"
            onChange={(val) =>
              onChange({
                ...value,
                statusFilter: val as AdminUserStatusApi | "ALL",
              })
            }
            className="w-full lg:w-[200px]"
          />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={onReset}
              disabled={activeFilterCount === 0 && !value.searchInput.trim()}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-4 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:cursor-not-allowed disabled:opacity-50 lg:flex-none"
            >
              <span className="material-symbols-outlined text-[18px]">
                restart_alt
              </span>
              {t("adminUsers.filters.reset")}
              {activeFilterCount > 0 ? (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            <button
              type="button"
              onClick={onCreate}
              className={cn(
                "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-on-primary lg:flex-none",
                "bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/10 hover:shadow-primary/20",
                "active:scale-[0.99] transition-all",
              )}
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              {t("adminUsers.actions.create")}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-2 px-1 text-[11px] text-on-surface-variant">
        {t("adminUsers.filters.pageScopeHint")}
      </p>
    </section>
  );
}

