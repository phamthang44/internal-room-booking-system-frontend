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

  const filteredRows = useMemo(() => {
    const rows = listQuery.data?.rows ?? [];
    return rows
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
  }, [filters.roleFilter, filters.searchInput, filters.statusFilter, listQuery.data?.rows]);

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
  const canPrev = page > 1 && !listQuery.isFetching;
  const canNext = page < totalPages && !listQuery.isFetching;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              {t("adminUsers.title")}
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {t("adminUsers.subtitle")}
            </p>
          </div>
        </header>

        <AdminUsersToolbar
          value={filters}
          onChange={(next) => {
            setFilters(next);
          }}
          onReset={() => {
            setFilters({ searchInput: "", roleFilter: "ALL", statusFilter: "ALL" });
          }}
          onCreate={() => setCreateOpen(true)}
          activeFilterCount={activeFilterCount}
        />

        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-4 text-sm text-on-surface-variant">
          <p className="font-bold text-on-surface">{t("adminUsers.penaltiesHint.title")}</p>
          <p className="mt-1 text-xs">
            {t("adminUsers.penaltiesHint.body")}
          </p>
        </div>

        {listQuery.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("adminUsers.errors.loadFailed")}
          </div>
        ) : null}

        {listQuery.isLoading ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-8 text-sm text-on-surface-variant shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            {t("adminUsers.loading")}
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-8 text-sm text-on-surface-variant shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
            {t("adminUsers.empty")}
          </div>
        ) : (
          <AdminUsersTable
            rows={filteredRows}
            onOpenUser={(u) => setDrawerUser(u)}
            onRequestToggleBan={(u) => setConfirmBanUser(u)}
            busyUserId={busyUserId}
          />
        )}

        <div className="flex items-center justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 px-6 py-4 shadow-[0_8px_32px_rgba(24,28,30,0.06)] backdrop-blur-md">
          <p className="text-xs font-medium text-on-surface-variant">
            {t("adminUsers.pagination.pageOf", {
              page,
              total: totalPages,
            })}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40",
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
                "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40",
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

      <CreateUserModal
        open={createOpen}
        busy={createMutation.isPending}
        onClose={() => !createMutation.isPending && setCreateOpen(false)}
        onSubmit={onCreateUser}
      />

      <UserDetailDrawer
        open={drawerUser != null}
        user={drawerUser}
        busy={toggleBanMutation.isPending || updateRoleMutation.isPending}
        onClose={() => setDrawerUser(null)}
        onRequestChangeRole={(_id, role) => {
          if (!drawerUser) return;
          // Only ask confirmation when actually changing
          if (String(drawerUser.role) === String(role)) return;
          setConfirmRole({ user: drawerUser, nextRole: role });
        }}
        onRequestToggleBan={(id) => {
          const u = drawerUser;
          if (!u || u.id !== id) return;
          setConfirmBanUser(u);
        }}
      />

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

