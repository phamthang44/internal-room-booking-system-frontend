import { useDeferredValue, useMemo, useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { useNavigate } from "react-router-dom";
import type { RoomStatusApi } from "@features/rooms/types/classroom.api.types";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import {
  useAdminRoomsListQuery,
  useAdminRoomStatusMutation,
} from "../hooks/useAdminRoomsQueries";
import type { AdminRoomListRow } from "../api/adminRoomsList.api";
import type { AdminRoomStatus } from "../types/adminRooms.api.types";
import { messageForAdminRoomsError } from "../utils/adminRoomsErrors";
import {
  CustomSelect,
  type CustomSelectOption,
} from "@shared/components/CustomSelect";

const PAGE_SIZE = 10;

const STATUS_ORDER: AdminRoomStatus[] = [
  "AVAILABLE",
  "INACTIVE",
  "MAINTENANCE",
  "DELETED",
];

const STATUS_SELECT_OPTIONS: CustomSelectOption[] = STATUS_ORDER.map((s) => ({
  value: s,
  label: `adminRooms.list.status.${s}`,
}));

function statusBadgeClass(status: RoomStatusApi | undefined) {
  switch (status) {
    case "AVAILABLE":
      return "bg-tertiary-fixed text-on-tertiary-fixed-variant";
    case "MAINTENANCE":
      return "bg-amber-100 text-amber-800";
    case "INACTIVE":
      return "bg-surface-container-high text-on-surface-variant";
    case "DELETED":
      return "bg-error-container text-error";
    default:
      return "bg-surface-container-high text-on-surface-variant";
  }
}

export const AdminRoomsListPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const deferredSearch = useDeferredValue(searchInput);

  const listQuery = useAdminRoomsListQuery({
    keyword: deferredSearch,
    page,
    pageSize: PAGE_SIZE,
  });

  const rows = listQuery.data?.rows ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = Math.max(1, listQuery.data?.totalPages ?? 1);

  const stats = useMemo(() => {
    const availableOnPage = rows.filter((r) => r.status === "AVAILABLE").length;
    const maintenanceOnPage = rows.filter(
      (r) => r.status === "MAINTENANCE",
    ).length;
    const avgCap =
      rows.length > 0
        ? Math.round(
            rows.reduce((acc, r) => acc + r.capacity, 0) / rows.length,
          )
        : 0;
    return { availableOnPage, maintenanceOnPage, avgCap };
  }, [rows]);

  const [statusRow, setStatusRow] = useState<AdminRoomListRow | null>(null);
  const [nextStatus, setNextStatus] = useState<AdminRoomStatus>("AVAILABLE");

  const statusMutation = useAdminRoomStatusMutation();

  const fromIdx = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const toIdx = total === 0 ? 0 : fromIdx + rows.length - 1;

  const openStatusModal = (row: AdminRoomListRow) => {
    setStatusRow(row);
    setNextStatus((row.status as AdminRoomStatus) ?? "AVAILABLE");
  };

  const confirmStatusChange = () => {
    if (!statusRow) return;
    statusMutation.mutate(
      {
        classroomId: statusRow.classroomId,
        status: nextStatus,
      },
      {
        onSuccess: () => {
          presentAppSuccess(t("adminRooms.list.toasts.statusUpdated"));
          setStatusRow(null);
        },
        onError: (err) => {
          useAppToastStore.getState().push({
            titleI18nKey: "common.errors.toast.genericTitle",
            message: messageForAdminRoomsError(err, t),
          });
        },
      },
    );
  };

  const confirmDelete = (row: AdminRoomListRow) => {
    statusMutation.mutate(
      {
        classroomId: row.classroomId,
        status: "DELETED",
      },
      {
        onSuccess: () => {
          presentAppSuccess(t("adminRooms.list.toasts.markedDeleted"));
        },
        onError: (err) => {
          useAppToastStore.getState().push({
            titleI18nKey: "common.errors.toast.genericTitle",
            message: messageForAdminRoomsError(err, t),
          });
        },
      },
    );
  };

  const showStatusWarning =
    nextStatus === "INACTIVE" || nextStatus === "MAINTENANCE";

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              {t("adminRooms.list.title")}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              {t("adminRooms.list.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/rooms/new")}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-on-primary",
              "bg-gradient-to-r from-primary to-primary-container shadow-lg shadow-primary/10 hover:shadow-primary/20",
              "active:scale-[0.99] transition-all",
            )}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t("adminRooms.list.addNew")}
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">
              {t("adminRooms.list.stats.totalRooms")}
            </p>
            <p className="mt-2 font-headline text-3xl font-extrabold text-primary">
              {listQuery.isFetching ? "…" : total}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">
              {t("adminRooms.list.stats.activeNow")}
            </p>
            <p className="mt-2 font-headline text-3xl font-extrabold text-on-tertiary-container">
              {listQuery.isFetching ? "…" : stats.availableOnPage}
            </p>
            <p className="mt-1 text-[10px] text-on-surface-variant">
              {t("adminRooms.list.stats.pageScopeNote")}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">
              {t("adminRooms.list.stats.underRepair")}
            </p>
            <p className="mt-2 font-headline text-3xl font-extrabold text-error">
              {listQuery.isFetching ? "…" : stats.maintenanceOnPage}
            </p>
            <p className="mt-1 text-[10px] text-on-surface-variant">
              {t("adminRooms.list.stats.pageScopeNote")}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-secondary-container">
              {t("adminRooms.list.stats.avgCapacity")}
            </p>
            <p className="mt-2 font-headline text-3xl font-extrabold text-primary">
              {listQuery.isFetching ? "…" : stats.avgCap}{" "}
              <span className="text-sm font-medium text-on-surface-variant">
                {t("adminRooms.list.stats.seats")}
              </span>
            </p>
            <p className="mt-1 text-[10px] text-on-surface-variant">
              {t("adminRooms.list.stats.pageScopeNote")}
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl bg-surface-container-low p-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
              placeholder={t("adminRooms.list.searchPlaceholder")}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              {t("adminRooms.list.filters.building")}
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">
                groups
              </span>
              {t("adminRooms.list.filters.capacity")}
            </button>
          </div>
        </div>

        {listQuery.isError ? (
          <div className="mb-6 rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("adminRooms.list.loadError")}
          </div>
        ) : null}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-outline-variant/10 bg-surface-container-lowest shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.classroom")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.location")}
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.capacity")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.amenities")}
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.status")}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminRooms.list.table.actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {listQuery.isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                      {t("adminRooms.list.loading")}
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                      {t("adminRooms.list.empty")}
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr
                      key={row.classroomId}
                      className="group hover:bg-surface-container-low transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-container/10 text-primary">
                            <span className="material-symbols-outlined">
                              meeting_room
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">
                              {row.roomName}
                            </p>
                            <p className="text-xs text-on-surface-variant">
                              {row.roomType}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-on-surface">
                          {row.buildingName}
                        </p>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-bold text-on-secondary-fixed-variant">
                          {row.capacity}{" "}
                          {t("adminRooms.list.stats.seats")}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex max-w-[200px] flex-wrap gap-1">
                          {row.equipmentNames.slice(0, 4).map((n) => (
                            <span
                              key={n}
                              className="truncate rounded-lg bg-surface-container-low px-2 py-0.5 text-[10px] font-semibold text-on-surface-variant"
                              title={n}
                            >
                              {n}
                            </span>
                          ))}
                          {row.equipmentNames.length > 4 ? (
                            <span className="text-[10px] text-on-surface-variant">
                              +
                              {row.equipmentNames.length - 4}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                            statusBadgeClass(row.status),
                          )}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                          {row.status
                            ? t(`adminRooms.list.status.${row.status}` as "adminRooms.list.status.AVAILABLE")
                            : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 sm:gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/rooms/${row.classroomId}/edit`)
                            }
                            className="rounded-xl p-2 text-on-surface-variant hover:bg-primary-container/10 hover:text-primary transition-colors"
                            title={t("adminRooms.list.actions.edit")}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              edit
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/rooms/${row.classroomId}/audit`)
                            }
                            className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
                            aria-label={t("adminRooms.list.actions.audit")}
                            title={t("adminRooms.list.actions.audit")}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              history_edu
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openStatusModal(row)}
                            className="rounded-xl p-2 text-on-surface-variant hover:bg-amber-50 hover:text-amber-800 transition-colors"
                            title={t("adminRooms.list.actions.changeStatus")}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              swap_horiz
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  t("adminRooms.list.confirmDelete.message", {
                                    name: row.roomName,
                                  }),
                                )
                              ) {
                                confirmDelete(row);
                              }
                            }}
                            disabled={statusMutation.isPending}
                            className="rounded-xl p-2 text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-colors disabled:opacity-50"
                            title={t("adminRooms.list.actions.delete")}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low/30 px-6 py-4">
            <p className="text-xs font-medium text-on-surface-variant">
              {t("adminRooms.list.pagination.showing", {
                from: fromIdx,
                to: toIdx,
                total,
              })}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-on-surface-variant">
                {t("adminRooms.list.pagination.pageOf", { page, totalPages })}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
                  disabled={page <= 1 || listQuery.isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_left
                  </span>
                </button>
                <button
                  type="button"
                  className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-high disabled:opacity-40"
                  disabled={page >= totalPages || listQuery.isFetching}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {statusRow ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => !statusMutation.isPending && setStatusRow(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white/90 p-6 shadow-2xl backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-headline text-lg font-bold text-on-surface">
              {t("adminRooms.list.statusDialog.title")}
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {statusRow.roomName}
            </p>

            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminRooms.list.statusDialog.selectLabel")}
              </label>
              <CustomSelect
                value={nextStatus}
                options={STATUS_SELECT_OPTIONS}
                onChange={(val) => setNextStatus(val as AdminRoomStatus)}
                className="w-full"
                menuClassName="z-[60]"
                disabled={statusMutation.isPending}
              />
            </div>

            {showStatusWarning ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {t("adminRooms.list.statusDialog.bookingWarning")}
              </p>
            ) : null}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
                onClick={() => setStatusRow(null)}
                disabled={statusMutation.isPending}
              >
                {t("adminRooms.list.statusDialog.cancel")}
              </button>
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-95 disabled:opacity-50"
                disabled={
                  statusMutation.isPending ||
                  nextStatus === (statusRow.status as AdminRoomStatus)
                }
                onClick={confirmStatusChange}
              >
                {statusMutation.isPending
                  ? t("adminRooms.list.statusDialog.saving")
                  : t("adminRooms.list.statusDialog.confirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
};
