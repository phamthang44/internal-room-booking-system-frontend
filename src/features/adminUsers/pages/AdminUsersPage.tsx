import { useMemo, useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { normalizeApiError } from "@shared/errors/normalizeApiError";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { ConfirmDialog } from "@shared/components/ConfirmDialog";
import type {
  AdminUserRoleApi,
  UserBasicResponse,
} from "../types/adminUsers.api.types";
import {
  useAdminUsersListQuery,
  useAdminUserCreateMutation,
  useAdminUserToggleBanMutation,
  useAdminUserUpdateRoleMutation,
} from "../hooks/useAdminUsersQueries";
import { AdminUsersToolbar, type AdminUsersToolbarValue } from "../components/AdminUsersToolbar";
import { AdminUsersTable } from "../components/AdminUsersTable";
import { CreateUserModal, type CreateUserFormValue } from "../components/CreateUserModal";
import { UserDetailDrawer } from "../components/UserDetailDrawer";

const DEFAULT_PAGE_SIZE = 20;

const matchesQuery = (u: UserBasicResponse, q: string): boolean => {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  const fields = [
    String(u.id ?? ""),
    u.username ?? "",
    u.email ?? "",
    u.studentCode ?? "",
    String(u.role ?? ""),
    String(u.status ?? ""),
  ];
  return fields.some((f) => String(f).toLowerCase().includes(query));
};

export const AdminUsersPage = () => {
  const { t } = useI18n();

  const [page, setPage] = useState(1);
  const [size] = useState(DEFAULT_PAGE_SIZE);
  const [sort] = useState("id,desc");

  const [filters, setFilters] = useState<AdminUsersToolbarValue>({
    searchInput: "",
    roleFilter: "ALL",
    statusFilter: "ALL",
  });

  const [showTip, setShowTip] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [drawerUser, setDrawerUser] = useState<UserBasicResponse | null>(null);
  const [confirmBanUser, setConfirmBanUser] = useState<UserBasicResponse | null>(null);
  const [confirmRole, setConfirmRole] = useState<{
    user: UserBasicResponse;
    nextRole: AdminUserRoleApi;
  } | null>(null);

  const listQuery = useAdminUsersListQuery({ page, size, sort });
  const createMutation = useAdminUserCreateMutation();
  const toggleBanMutation = useAdminUserToggleBanMutation();
  const updateRoleMutation = useAdminUserUpdateRoleMutation();

  const busyUserId =
    (toggleBanMutation.variables as number | undefined) ??
    (updateRoleMutation.variables as { userId: number } | undefined)?.userId ??
    null;

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.roleFilter !== "ALL") c += 1;
    if (filters.statusFilter !== "ALL") c += 1;
    return c;
  }, [filters.roleFilter, filters.statusFilter]);

  const rawRows = listQuery.data?.rows ?? [];

  const filteredRows = useMemo(() => {
    return rawRows
      .filter((u) => matchesQuery(u, filters.searchInput))
      .filter((u) =>
        filters.roleFilter === "ALL"
          ? true
          : String(u.role) === String(filters.roleFilter),
      )
      .filter((u) =>
        filters.statusFilter === "ALL"
          ? true
          : String(u.status) === String(filters.statusFilter),
      );
  }, [filters.roleFilter, filters.searchInput, filters.statusFilter, rawRows]);

  const stats = useMemo(() => {
    const total = listQuery.data?.totalElements ?? rawRows.length;
    const active = rawRows.filter((u) => String(u.status) === "ACTIVE").length;
    const privileged = rawRows.filter(
      (u) => String(u.role) === "ADMIN" || String(u.role) === "STAFF",
    ).length;
    const banned = rawRows.filter((u) => String(u.status) === "BANNED").length;

    return { total, active, privileged, banned };
  }, [listQuery.data?.totalElements, rawRows]);

  const showToastError = (err: unknown) => {
    const n = normalizeApiError(err);
    useAppToastStore.getState().push({
      tone: "error",
      titleI18nKey: n.titleI18nKey,
      message: n.message,
      traceId: n.traceId,
    });
  };

  const onToggleBanById = (userId: number) => {
    toggleBanMutation.mutate(userId, {
      onSuccess: (msg) => {
        presentAppSuccess(msg ?? t("adminUsers.toasts.updated"));
      },
      onError: showToastError,
    });
  };

  const onChangeRole = (userId: number, roleName: AdminUserRoleApi) => {
    updateRoleMutation.mutate(
      { userId, roleName },
      {
        onSuccess: () => {
          presentAppSuccess(t("adminUsers.toasts.roleUpdated"));
        },
        onError: showToastError,
      },
    );
  };

  const onCreateUser = (v: CreateUserFormValue) => {
    createMutation.mutate(v, {
      onSuccess: () => {
        presentAppSuccess(t("adminUsers.toasts.created"));
        setCreateOpen(false);
      },
      onError: showToastError,
    });
  };

  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);
  const totalElements = listQuery.data?.totalElements ?? rawRows.length;
  const canPrev = page > 1 && !listQuery.isFetching;
  const canNext = page < totalPages && !listQuery.isFetching;

  const fromIdx = totalElements === 0 ? 0 : (page - 1) * size + 1;
  const toIdx = Math.min(totalElements, fromIdx + filteredRows.length - 1);

  const resetFilters = () => {
    setFilters({ searchInput: "", roleFilter: "ALL", statusFilter: "ALL" });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Executive Page Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
                {t("adminUsers.title")}
              </h1>
              {totalElements > 0 ? (
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs font-bold text-primary border border-primary/20">
                  {totalElements}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm text-on-surface-variant max-w-2xl">
              {t("adminUsers.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-on-primary",
              "bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/20 hover:shadow-primary/30",
              "active:scale-[0.99] transition-all shrink-0",
            )}
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>{t("adminUsers.actions.create")}</span>
          </button>
        </header>

        {/* Executive Bento Metrics Strip */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total users */}
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-5 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.stats.totalUsers")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[20px]">groups</span>
              </div>
            </div>
            <p className="mt-2 font-headline text-3xl font-black text-on-surface">
              {listQuery.isFetching ? "…" : stats.total}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant/70">
              {t("adminUsers.stats.pageScopeNote")}
            </p>
          </div>

          {/* Active users */}
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-5 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.stats.activeUsers")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <span className="material-symbols-outlined text-[20px]">verified_user</span>
              </div>
            </div>
            <p className="mt-2 font-headline text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {listQuery.isFetching ? "…" : stats.active}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant/70">
              {t("adminUsers.stats.pageScopeNote")}
            </p>
          </div>

          {/* Privileged users */}
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-5 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.stats.privilegedUsers")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <span className="material-symbols-outlined text-[20px]">shield_person</span>
              </div>
            </div>
            <p className="mt-2 font-headline text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {listQuery.isFetching ? "…" : stats.privileged}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant/70">
              {t("adminUsers.stats.pageScopeNote")}
            </p>
          </div>

          {/* Banned users */}
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-5 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminUsers.stats.bannedUsers")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-error/10 text-error">
                <span className="material-symbols-outlined text-[20px]">lock_person</span>
              </div>
            </div>
            <p className="mt-2 font-headline text-3xl font-black text-error">
              {listQuery.isFetching ? "…" : stats.banned}
            </p>
            <p className="mt-1 text-[11px] text-on-surface-variant/70">
              {t("adminUsers.stats.pageScopeNote")}
            </p>
          </div>
        </div>

        {/* Informational Guidance Banner */}
        {showTip ? (
          <div className="relative flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-on-surface-variant shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
              <span className="material-symbols-outlined text-[18px]">lightbulb</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-on-surface">
                {t("adminUsers.penaltiesHint.title")}
              </p>
              <p className="mt-0.5 leading-relaxed">
                {t("adminUsers.penaltiesHint.body")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowTip(false)}
              className="rounded-lg p-1 text-on-surface-variant/70 hover:bg-surface-container-high hover:text-on-surface transition-colors"
              aria-label={t("adminUsers.actions.close")}
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ) : null}

        {/* Command & Filter Toolbar */}
        <AdminUsersToolbar
          value={filters}
          onChange={(next) => setFilters(next)}
          onReset={resetFilters}
          onCreate={() => setCreateOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        {/* Error notification */}
        {listQuery.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error flex items-center gap-3">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{t("adminUsers.errors.loadFailed")}</span>
          </div>
        ) : null}

        {/* Table / Loading State */}
        {listQuery.isLoading ? (
          <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 p-6 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined animate-spin text-primary text-[24px]">
                progress_activity
              </span>
              <span className="text-sm font-semibold text-on-surface-variant">
                {t("adminUsers.loading")}
              </span>
            </div>
            {/* Shimmering Skeletons */}
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-outline-variant/10">
                  <div className="h-11 w-11 rounded-xl bg-surface-container-high shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 rounded bg-surface-container-high" />
                    <div className="h-3 w-48 rounded bg-surface-container-low" />
                  </div>
                  <div className="h-6 w-24 rounded-full bg-surface-container-high shrink-0" />
                  <div className="h-6 w-20 rounded-full bg-surface-container-high shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AdminUsersTable
            rows={filteredRows}
            onOpenUser={(u) => setDrawerUser(u)}
            onRequestToggleBan={(u) => setConfirmBanUser(u)}
            busyUserId={busyUserId}
            onResetFilters={resetFilters}
          />
        )}

        {/* Pagination Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/80 px-6 py-4 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
          <p className="text-xs font-semibold text-on-surface-variant">
            {t("adminUsers.pagination.showingRange", {
              from: fromIdx,
              to: toIdx,
              total: totalElements,
            })}
          </p>

          <div className="flex items-center gap-2">
            <span className="mr-2 font-mono text-xs text-on-surface-variant">
              {t("adminUsers.pagination.pageOf", {
                page,
                total: totalPages,
              })}
            </span>

            <button
              type="button"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/30 text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30",
              )}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!canPrev}
              aria-label={t("adminUsers.pagination.prev")}
              title={t("adminUsers.pagination.prev")}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            <button
              type="button"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/30 text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30",
              )}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={!canNext}
              aria-label={t("adminUsers.pagination.next")}
              title={t("adminUsers.pagination.next")}
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        open={createOpen}
        busy={createMutation.isPending}
        onClose={() => !createMutation.isPending && setCreateOpen(false)}
        onSubmit={onCreateUser}
      />

      {/* User Detail Drawer */}
      <UserDetailDrawer
        open={drawerUser != null}
        user={drawerUser}
        busy={toggleBanMutation.isPending || updateRoleMutation.isPending}
        onClose={() => setDrawerUser(null)}
        onRequestChangeRole={(_id, role) => {
          if (!drawerUser) return;
          if (String(drawerUser.role) === String(role)) return;
          setConfirmRole({ user: drawerUser, nextRole: role });
        }}
        onRequestToggleBan={(id) => {
          const u = drawerUser;
          if (!u || u.id !== id) return;
          setConfirmBanUser(u);
        }}
      />

      {/* Confirm Ban / Unban Dialog */}
      <ConfirmDialog
        open={confirmBanUser != null}
        tone="danger"
        title={
          confirmBanUser && String(confirmBanUser.status) === "BANNED"
            ? t("adminUsers.confirm.unbanTitle")
            : t("adminUsers.confirm.banTitle")
        }
        description={
          confirmBanUser && String(confirmBanUser.status) === "BANNED"
            ? t("adminUsers.confirm.unban")
            : t("adminUsers.confirm.ban")
        }
        cancelLabel={t("adminUsers.actions.cancel")}
        confirmLabel={
          confirmBanUser && String(confirmBanUser.status) === "BANNED"
            ? t("adminUsers.actions.unban")
            : t("adminUsers.actions.ban")
        }
        busy={toggleBanMutation.isPending}
        onCancel={() => setConfirmBanUser(null)}
        onConfirm={() => {
          if (!confirmBanUser) return;
          const id = confirmBanUser.id;
          setConfirmBanUser(null);
          onToggleBanById(id);
        }}
      />

      {/* Confirm Role Change Dialog */}
      <ConfirmDialog
        open={confirmRole != null}
        title={t("adminUsers.confirm.roleTitle")}
        description={
          confirmRole
            ? t("adminUsers.confirm.role", {
                username: confirmRole.user.username,
                role: t(`adminUsers.role.${confirmRole.nextRole}` as "adminUsers.role.ADMIN"),
              })
            : undefined
        }
        cancelLabel={t("adminUsers.actions.cancel")}
        confirmLabel={t("adminUsers.actions.confirm")}
        busy={updateRoleMutation.isPending}
        onCancel={() => setConfirmRole(null)}
        onConfirm={() => {
          if (!confirmRole) return;
          const payload = confirmRole;
          setConfirmRole(null);
          onChangeRole(payload.user.id, payload.nextRole);
        }}
      />
    </AppLayout>
  );
};
