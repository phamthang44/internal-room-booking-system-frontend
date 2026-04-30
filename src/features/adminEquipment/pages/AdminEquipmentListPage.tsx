import { useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { ConfirmDialog } from "@shared/components/ConfirmDialog";
import {
  useAdminEquipmentListQuery,
  useAdminEquipmentCreateMutation,
  useAdminEquipmentUpdateMutation,
  useAdminEquipmentDeactivateMutation,
  useAdminEquipmentReactivateMutation,
} from "../hooks/useAdminEquipmentQueries";
import {
  AdminEquipmentUpsertModal,
  type AdminEquipmentUpsertValue,
} from "../components/AdminEquipmentUpsertModal";
import type { EquipmentListItem } from "../types/adminEquipment.api.types";

const PAGE_SIZE = 10;

type ConfirmAction =
  | { type: "deactivate"; item: EquipmentListItem }
  | { type: "reactivate"; item: EquipmentListItem };

export const AdminEquipmentListPage = () => {
  const { t, language } = useI18n();

  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [upsertOpen, setUpsertOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EquipmentListItem | null>(null);

  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const listQuery = useAdminEquipmentListQuery({
    keyword,
    page,
    size: PAGE_SIZE,
    sort: "id,asc",
  });

  const createMutation = useAdminEquipmentCreateMutation();
  const updateMutation = useAdminEquipmentUpdateMutation();
  const deactivateMutation = useAdminEquipmentDeactivateMutation();
  const reactivateMutation = useAdminEquipmentReactivateMutation();

  const rows = listQuery.data?.rows ?? [];
  const totalPages = listQuery.data?.totalPages ?? 1;
  const totalElements = listQuery.data?.totalElements ?? 0;
  const from = totalElements === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalElements);

  function openCreate() {
    setEditTarget(null);
    setUpsertOpen(true);
  }

  function openEdit(item: EquipmentListItem) {
    setEditTarget(item);
    setUpsertOpen(true);
  }

  function handleUpsertSubmit(value: AdminEquipmentUpsertValue) {
    if (editTarget) {
      updateMutation.mutate(
        { id: editTarget.id, body: value },
        { onSuccess: () => setUpsertOpen(false) },
      );
    } else {
      createMutation.mutate(value, { onSuccess: () => setUpsertOpen(false) });
    }
  }

  function handleConfirm() {
    if (!confirm) return;
    if (confirm.type === "deactivate") {
      deactivateMutation.mutate(confirm.item.id, { onSuccess: () => setConfirm(null) });
    } else {
      reactivateMutation.mutate(confirm.item.id, { onSuccess: () => setConfirm(null) });
    }
  }

  const upsertBusy = createMutation.isPending || updateMutation.isPending;
  const confirmBusy = deactivateMutation.isPending || reactivateMutation.isPending;

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              {t("adminEquipment.list.title")}
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              {t("adminEquipment.list.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary",
              "shadow-lg hover:shadow-xl active:scale-[0.99] transition-all",
            )}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t("adminEquipment.list.addType")}
          </button>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/30 p-6">
            <input
              type="search"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              placeholder={t("adminEquipment.list.advancedFilters")}
              className="rounded-xl border border-outline-variant/30 bg-surface px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-surface-container-low text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-4">{t("adminEquipment.list.table.name")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.assignedTo")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.health")}</th>
                  <th className="px-6 py-4 text-right">{t("adminEquipment.list.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {listQuery.isPending && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                      {t("adminEquipment.loading")}
                    </td>
                  </tr>
                )}
                {listQuery.isError && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-error">
                      {t("adminEquipment.loadError")}
                    </td>
                  </tr>
                )}
                {listQuery.isSuccess && rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                      {t("adminEquipment.empty")}
                    </td>
                  </tr>
                )}
                {rows.map((row) => {
                  const name = language === "vi" ? row.nameVi : row.nameEn;
                  return (
                    <tr key={row.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-5">
                        <div>
                          <p className="font-bold text-on-surface">{name}</p>
                          <p className="text-xs text-on-surface-variant">{row.nameKey}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant">
                        {row.classroomCount} {row.classroomCount === 1 ? "Room" : "Rooms"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", row.isActive ? "bg-tertiary-fixed-dim" : "bg-outline")} />
                          <span className="text-sm font-medium text-on-surface-variant">
                            {row.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(row)}
                            className="rounded-xl px-3 py-1.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                          >
                            {t("adminEquipment.actions.edit")}
                          </button>
                          {row.isActive ? (
                            <button
                              onClick={() => setConfirm({ type: "deactivate", item: row })}
                              className="rounded-xl bg-error-container px-3 py-1.5 text-xs font-bold text-error hover:bg-error/20 transition-colors"
                            >
                              {t("adminEquipment.confirm.deactivate.confirm")}
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirm({ type: "reactivate", item: row })}
                              className="rounded-xl bg-secondary-container px-3 py-1.5 text-xs font-bold text-on-secondary-container hover:bg-secondary/20 transition-colors"
                            >
                              {t("adminEquipment.confirm.reactivate.confirm")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low/30 px-6 py-4">
            <p className="text-xs font-medium text-on-surface-variant">
              {t("adminEquipment.list.pagination.showing", { from, to, total: totalElements })}
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-outline-variant/20 p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "rounded-xl px-3 py-1 text-xs font-medium transition-colors",
                    p === page
                      ? "bg-primary text-on-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-high",
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-outline-variant/20 p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit modal */}
      <AdminEquipmentUpsertModal
        open={upsertOpen}
        mode={editTarget ? "edit" : "create"}
        busy={upsertBusy}
        initialValue={
          editTarget
            ? {
                nameVi: editTarget.nameVi,
                nameEn: editTarget.nameEn,
              }
            : undefined
        }
        onClose={() => !upsertBusy && setUpsertOpen(false)}
        onSubmit={handleUpsertSubmit}
      />

      {/* Deactivate confirmation */}
      <ConfirmDialog
        open={confirm?.type === "deactivate"}
        title={t("adminEquipment.confirm.deactivate.title")}
        description={t("adminEquipment.confirm.deactivate.description")}
        confirmLabel={t("adminEquipment.confirm.deactivate.confirm")}
        cancelLabel={t("adminEquipment.confirm.deactivate.cancel")}
        tone="danger"
        busy={confirmBusy}
        onConfirm={handleConfirm}
        onCancel={() => !confirmBusy && setConfirm(null)}
      />

      {/* Reactivate confirmation */}
      <ConfirmDialog
        open={confirm?.type === "reactivate"}
        title={t("adminEquipment.confirm.reactivate.title")}
        description={t("adminEquipment.confirm.reactivate.description")}
        confirmLabel={t("adminEquipment.confirm.reactivate.confirm")}
        cancelLabel={t("adminEquipment.confirm.reactivate.cancel")}
        tone="neutral"
        busy={confirmBusy}
        onConfirm={handleConfirm}
        onCancel={() => !confirmBusy && setConfirm(null)}
      />
    </AppLayout>
  );
};
