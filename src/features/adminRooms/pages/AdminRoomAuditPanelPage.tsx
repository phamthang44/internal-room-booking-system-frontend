import { useMemo, useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminRoomDetailQuery,
  useAdminRoomStatusMutation,
} from "../hooks/useAdminRoomsQueries";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { messageForAdminRoomsError } from "../utils/adminRoomsErrors";
import type { AdminRoomStatus } from "../types/adminRooms.api.types";

const STATUS_OPTIONS: AdminRoomStatus[] = [
  "AVAILABLE",
  "INACTIVE",
  "MAINTENANCE",
  "DELETED",
];

function statusBadgeClass(status: AdminRoomStatus | undefined) {
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

export const AdminRoomAuditPanelPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const roomId = routeId ? Number.parseInt(routeId, 10) : NaN;
  const validId = Number.isFinite(roomId) && roomId > 0;

  const detailQuery = useAdminRoomDetailQuery(validId ? roomId : undefined);
  const d = detailQuery.data;
  const statusMutation = useAdminRoomStatusMutation();

  const [carouselIdx, setCarouselIdx] = useState(0);
  const [statusOpen, setStatusOpen] = useState(false);
  const [nextStatus, setNextStatus] = useState<AdminRoomStatus>("AVAILABLE");

  const images = useMemo(
    () =>
      d?.imageUrls && d.imageUrls.length > 0
        ? d.imageUrls
        : ["https://picsum.photos/seed/audit-fallback/1200/800"],
    [d?.imageUrls],
  );

  const formatIsoDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  const openStatusModal = () => {
    if (!d) return;
    setNextStatus((d.status as AdminRoomStatus) ?? "AVAILABLE");
    setStatusOpen(true);
  };

  const confirmStatus = () => {
    if (!d) return;
    const cid = d.classroomId ?? roomId;
    statusMutation.mutate(
      { classroomId: cid, status: nextStatus },
      {
        onSuccess: () => {
          presentAppSuccess(t("adminRooms.list.toasts.statusUpdated"));
          setStatusOpen(false);
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

  const loading = detailQuery.isLoading;
  const err = detailQuery.isError;

  if (!validId) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("adminRooms.audit.invalidId")}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {err ? (
          <div className="mb-6 rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("adminRooms.audit.loadError")}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-6 rounded-2xl bg-surface-container-low p-6 text-sm text-on-surface-variant">
            {t("adminRooms.audit.loading")}
          </div>
        ) : null}

        {!loading && !err && d ? (
          <>
            <div className="mb-8 rounded-2xl bg-white/70 p-8 shadow-[0_2px_12px_rgba(24,28,30,0.06)] backdrop-blur-md">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
                      {d.roomName}
                    </h1>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                        statusBadgeClass(d.status),
                      )}
                    >
                      {d.status
                        ? t(`adminRooms.list.status.${d.status}` as "adminRooms.list.status.AVAILABLE")
                        : t("adminRooms.upsert.status.active")}
                    </span>
                  </div>
                  <p className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary">
                      location_on
                    </span>
                    {d.building.name}
                    {d.addressBuildingLocation
                      ? `, ${d.addressBuildingLocation}`
                      : ""}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2">
                      <span className="material-symbols-outlined text-primary">
                        groups
                      </span>
                      <span className="text-sm font-semibold text-on-surface-variant">
                        {t("adminRooms.audit.capacityLabel", {
                          value: d.capacity,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-surface-container-low px-4 py-2">
                      <span className="material-symbols-outlined text-primary">
                        category
                      </span>
                      <span className="text-sm font-semibold text-on-surface-variant">
                        {t("adminRooms.audit.typeLabel", {
                          value: d.roomType.name,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/rooms/${roomId}/edit`)}
                    className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                    {t("adminRooms.audit.actions.edit")}
                  </button>
                  <button
                    type="button"
                    onClick={openStatusModal}
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      swap_horiz
                    </span>
                    {t("adminRooms.audit.actions.changeStatus")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          t("adminRooms.list.confirmDelete.message", {
                            name: d.roomName,
                          }),
                        )
                      ) {
                        statusMutation.mutate(
                          {
                            classroomId: d.classroomId ?? roomId,
                            status: "DELETED",
                          },
                          {
                            onSuccess: () => {
                              presentAppSuccess(
                                t("adminRooms.list.toasts.markedDeleted"),
                              );
                              navigate("/admin/rooms");
                            },
                            onError: (e) => {
                              useAppToastStore.getState().push({
                                titleI18nKey:
                                  "common.errors.toast.genericTitle",
                                message: messageForAdminRoomsError(e, t),
                              });
                            },
                          },
                        );
                      }
                    }}
                    disabled={statusMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-error-container px-4 py-2 text-sm font-semibold text-error hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    {t("adminRooms.audit.actions.delete")}
                  </button>
                </div>
              </div>

              {/* Image carousel */}
              <div className="mt-8 overflow-hidden rounded-2xl border border-outline-variant/10">
                <div className="relative aspect-[21/9] w-full bg-surface-container-low">
                  <img
                    src={images[carouselIdx % images.length]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                    {images.map((_, i) => (
                      <button
                        key={String(i)}
                        type="button"
                        onClick={() => setCarouselIdx(i)}
                        className={cn(
                          "h-2 w-2 rounded-full transition-colors",
                          i === carouselIdx % images.length
                            ? "bg-white"
                            : "bg-white/40 hover:bg-white/70",
                        )}
                        aria-label={t("adminRooms.audit.carousel.dotLabel", {
                          index: i + 1,
                        })}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                    onClick={() =>
                      setCarouselIdx(
                        (carouselIdx - 1 + images.length) % images.length,
                      )
                    }
                    aria-label={t("adminRooms.audit.carousel.prev")}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chevron_left
                    </span>
                  </button>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
                    onClick={() =>
                      setCarouselIdx((carouselIdx + 1) % images.length)
                    }
                    aria-label={t("adminRooms.audit.carousel.next")}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem]">
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)] lg:col-span-5">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
                        <span className="material-symbols-outlined text-primary">
                          calendar_month
                        </span>
                        {t("adminRooms.audit.availability.title")}
                      </h2>
                    </div>
                    <p className="mb-3 text-xs font-medium text-on-surface-variant">
                      {d.month}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(d.availableDates ?? []).slice(0, 12).map((iso) => (
                        <span
                          key={iso}
                          className="rounded-lg bg-surface-container-low px-2 py-1 text-[10px] font-semibold text-on-surface-variant"
                        >
                          {formatIsoDate(iso)}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)] lg:col-span-7">
                    <h2 className="mb-6 flex items-center gap-2 font-headline text-lg font-bold text-on-surface">
                      <span className="material-symbols-outlined text-primary">
                        schedule
                      </span>
                      {t("adminRooms.audit.timeSlots.title", {
                        dateLabel: d.month || "—",
                      })}
                    </h2>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(d.timeSlots ?? []).map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between rounded-xl bg-surface-container-low p-4"
                        >
                          <div>
                            <p className="text-sm font-bold">
                              {slot.startTime} – {slot.endTime}
                            </p>
                            <p className="text-xs font-medium text-on-surface-variant">
                              {slot.slotName}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="flex items-center gap-3 font-headline text-xl font-bold text-on-surface">
                      <span className="material-symbols-outlined text-primary">
                        inventory_2
                      </span>
                      {t("adminRooms.audit.equipmentInventory.title")}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {(d.equipments ?? []).map((it) => (
                      <div
                        key={it.id}
                        className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-5 text-center transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-container/20">
                          {it.iconUrl ? (
                            <img
                              src={it.iconUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-2xl text-primary">
                              precision_manufacturing
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{it.name}</p>
                          <p className="text-xs font-medium text-on-surface-variant">
                            {t("adminRooms.audit.equipmentInventory.quantity", {
                              value: String(it.quantity).padStart(2, "0"),
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                <section className="overflow-hidden rounded-2xl bg-surface-container-low shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
                  <div className="border-b border-outline-variant/10 bg-surface-container-lowest p-6">
                    <h2 className="font-headline text-lg font-bold text-on-surface">
                      {t("adminRooms.audit.sidebar.auditAndMetadata")}
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {t("adminRooms.audit.sidebar.createdAt")}
                        </p>
                        <p className="text-xs font-semibold">
                          {formatIsoDate(d.auditResponse.createdAt)}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {t("adminRooms.audit.sidebar.createdBy")}
                        </p>
                        <p className="text-xs font-semibold">
                          {d.auditResponse.createdBy}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {t("adminRooms.audit.sidebar.lastUpdate")}
                        </p>
                        <p className="text-xs font-semibold">
                          {formatIsoDate(d.auditResponse.updatedAt)}
                        </p>
                      </div>
                      <div className="space-y-1 text-right">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {t("adminRooms.audit.sidebar.updatedBy")}
                        </p>
                        <p className="text-xs font-semibold">
                          {d.auditResponse.updatedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </>
        ) : null}
      </div>

      {statusOpen && d ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => !statusMutation.isPending && setStatusOpen(false)}
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
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                {t("adminRooms.list.statusDialog.selectLabel")}
              </label>
              <select
                className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-3 py-2 text-sm"
                value={nextStatus}
                onChange={(e) =>
                  setNextStatus(e.target.value as AdminRoomStatus)
                }
                disabled={statusMutation.isPending}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {t(`adminRooms.list.status.${s}` as "adminRooms.list.status.AVAILABLE")}
                  </option>
                ))}
              </select>
            </div>
            {(nextStatus === "INACTIVE" || nextStatus === "MAINTENANCE") ? (
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
                {t("adminRooms.list.statusDialog.bookingWarning")}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high"
                onClick={() => setStatusOpen(false)}
                disabled={statusMutation.isPending}
              >
                {t("adminRooms.list.statusDialog.cancel")}
              </button>
              <button
                type="button"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-on-primary hover:opacity-95 disabled:opacity-50"
                disabled={
                  statusMutation.isPending ||
                  nextStatus === (d.status as AdminRoomStatus)
                }
                onClick={confirmStatus}
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
