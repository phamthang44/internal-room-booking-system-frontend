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
  readonly onCreate?: () => void;
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

  const isQuickAll = value.roleFilter === "ALL" && value.statusFilter === "ALL";
  const isQuickStudent = value.roleFilter === "STUDENT" && value.statusFilter === "ALL";
  const isQuickPrivileged = (value.roleFilter === "ADMIN" || value.roleFilter === "STAFF") && value.statusFilter === "ALL";
  const isQuickBanned = value.statusFilter === "BANNED";

  return (
    <section
      className={cn(
        "relative z-[60] rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-4 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md transition-all",
        className,
      )}
      aria-label={t("adminUsers.filters.ariaLabel")}
    >
      {/* Quick Filter Chips */}
      <div className="mb-3.5 flex flex-wrap items-center gap-2 border-b border-outline-variant/10 pb-3">
        <span className="mr-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
          Lọc nhanh:
        </span>
        <button
          type="button"
          onClick={() => onChange({ ...value, roleFilter: "ALL", statusFilter: "ALL" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
            isQuickAll
              ? "bg-primary text-on-primary shadow-sm shadow-primary/20"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          <span className="material-symbols-outlined text-[16px]">groups</span>
          {t("adminUsers.filters.quickAll")}
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...value, roleFilter: "STUDENT", statusFilter: "ALL" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
            isQuickStudent
              ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          <span className="material-symbols-outlined text-[16px]">school</span>
          {t("adminUsers.filters.quickStudents")}
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...value, roleFilter: value.roleFilter === "ADMIN" ? "ADMIN" : "STAFF", statusFilter: "ALL" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
            isQuickPrivileged
              ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          <span className="material-symbols-outlined text-[16px]">shield_person</span>
          {t("adminUsers.filters.quickPrivileged")}
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...value, statusFilter: "BANNED" })}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all",
            isQuickBanned
              ? "bg-error text-on-error shadow-sm shadow-error/20"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
          )}
        >
          <span className="material-symbols-outlined text-[16px]">lock_person</span>
          {t("adminUsers.filters.quickBanned")}
        </button>
      </div>

      {/* Main Filter Row */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        {/* Search input with leading icon and clear button */}
        <div className="relative min-w-0 flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant/70">
            search
          </span>
          <input
            className="h-11 w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest py-2.5 pl-11 pr-10 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            placeholder={t("adminUsers.filters.searchPlaceholder")}
            value={value.searchInput}
            onChange={(e) =>
              onChange({
                ...value,
                searchInput: e.target.value,
              })
            }
          />
          {value.searchInput.trim() ? (
            <button
              type="button"
              onClick={() => onChange({ ...value, searchInput: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              aria-label={t("adminUsers.filters.clearSearch")}
              title={t("adminUsers.filters.clearSearch")}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : null}
        </div>

        {/* Dropdowns + Reset + CTA */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:flex lg:items-center">
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
            className="w-full lg:w-[190px]"
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
            className="w-full lg:w-[190px]"
          />

          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={onReset}
              disabled={activeFilterCount === 0 && !value.searchInput.trim()}
              className={cn(
                "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 text-sm font-semibold text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40 lg:flex-none",
                (activeFilterCount > 0 || value.searchInput.trim()) && "border-primary/40 text-primary font-bold bg-primary/5",
              )}
            >
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              <span>{t("adminUsers.filters.reset")}</span>
              {activeFilterCount > 0 ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-on-primary">
                  {activeFilterCount}
                </span>
              ) : null}
            </button>

            {onCreate ? (
              <button
                type="button"
                onClick={onCreate}
                className={cn(
                  "inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-on-primary lg:hidden",
                  "bg-gradient-to-r from-primary to-primary-container shadow-md shadow-primary/20",
                  "active:scale-[0.99] transition-all",
                )}
              >
                <span className="material-symbols-outlined text-[20px]">person_add</span>
                <span>{t("adminUsers.actions.create")}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
