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
import { AdminRoomAuditStatusModal } from "../components/AdminRoomAuditStatusModal";
import { AdminRoomAuditImageCarousel } from "../components/AdminRoomAuditImageCarousel";
import { AdminRoomAuditScheduleSection } from "../components/AdminRoomAuditScheduleSection";
import { AdminRoomAuditEquipmentSection } from "../components/AdminRoomAuditEquipmentSection";
import { AdminRoomAuditSidebar } from "../components/AdminRoomAuditSidebar";

const STATUS_OPTIONS: AdminRoomStatus[] = [
  "AVAILABLE",
  "INACTIVE",
  "MAINTENANCE",
  "DELETED",
];

const STATUS_SELECT_OPTIONS = STATUS_OPTIONS.map((s) => ({
  value: s,
  label: `adminRooms.list.status.${s}`,
}));

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
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();
  const roomId = routeId ? Number.parseInt(routeId, 10) : NaN;
  const validId = Number.isFinite(roomId) && roomId > 0;

  const locale = language === "vi" ? "vi-VN" : "en-US";

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

  const availabilities = d?.schedule?.availabilities ?? [];
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const selectedAvailability = useMemo(() => {
    if (availabilities.length === 0) return null;
    const fallback = availabilities[0] ?? null;
    if (!selectedDay) return fallback;
    return availabilities.find((a) => a.date === selectedDay) ?? fallback;
  }, [availabilities, selectedDay]);

  const formatIsoDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleString(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return iso;
    }
  };

  const formatIsoDay = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(locale, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const formatIsoDayShort = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(locale, {
        month: "short",
        day: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (time: string) => {
    // Contract uses HH:mm:ss. Show a shorter HH:mm to reduce visual noise.
    const m = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(time);
    return m ? `${m[1]}:${m[2]}` : time;
  };

  const slotStatusLabel = (slot: {
    status: "AVAILABLE" | "PENDING";
    isAvailable: boolean;
    currentBookingId?: number;
  }) => {
    if (slot.status === "PENDING") {
      return t("adminRooms.audit.timeSlots.pendingAudit");
    }
    if (!slot.isAvailable) {
      return t("adminRooms.audit.timeSlots.booked", {
        label:
          slot.currentBookingId != null ? `#${slot.currentBookingId}` : "—",
      });
    }
    return t("adminRooms.audit.timeSlots.available");
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
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-32 top-40 h-[28rem] w-[28rem] rounded-full bg-tertiary-fixed/20 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-secondary-container/30 blur-3xl" />
          </div>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-error shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            {t("adminRooms.audit.invalidId")}
          </div>
        </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative">
        {/* Strong glass backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -right-48 top-24 h-[36rem] w-[36rem] rounded-full bg-tertiary-fixed/25 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-1/2 h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-secondary-container/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {err ? (
          <div className="mb-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm text-error shadow-[0_12px_36px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            {t("adminRooms.audit.loadError")}
          </div>
        ) : null}

        {loading ? (
          <div className="mb-6 rounded-2xl border border-white/15 bg-white/10 p-6 text-sm text-on-surface-variant shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl">
            {t("adminRooms.audit.loading")}
          </div>
        ) : null}

        {!loading && !err && d ? (
          <>
            <div className="mb-8 rounded-2xl border border-white/20 bg-white/10 p-8 shadow-[0_16px_48px_rgba(0,0,0,0.12)] backdrop-blur-xl">
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
                    <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                      <span className="material-symbols-outlined text-primary">
                        groups
                      </span>
                      <span className="text-sm font-semibold text-on-surface-variant">
                        {t("adminRooms.audit.capacityLabel", {
                          value: d.capacity,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
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
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-on-surface shadow-[0_8px_20px_rgba(0,0,0,0.10)] backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
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
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-on-surface shadow-[0_8px_20px_rgba(0,0,0,0.10)] backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-50"
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
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-error-container/80 px-4 py-2 text-sm font-semibold text-error shadow-[0_8px_20px_rgba(0,0,0,0.10)] backdrop-blur-md transition-colors hover:bg-error-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/30 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    {t("adminRooms.audit.actions.delete")}
                  </button>
                </div>
              </div>

              {/* Image carousel */}
              <AdminRoomAuditImageCarousel
                images={images}
                idx={carouselIdx}
                setIdx={setCarouselIdx}
                t={t}
              />
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_24rem]">
              <div className="space-y-8">
                <AdminRoomAuditScheduleSection
                  availabilities={availabilities as any}
                  selectedAvailability={selectedAvailability as any}
                  onSelectDay={setSelectedDay}
                  t={t}
                  formatIsoDay={formatIsoDay}
                  formatIsoDayShort={formatIsoDayShort}
                  formatTime={formatTime}
                  slotStatusLabel={slotStatusLabel as any}
                  scheduleDateLabel={
                    d.schedule?.date ? formatIsoDay(d.schedule.date) : "—"
                  }
                />

                <AdminRoomAuditEquipmentSection
                  equipments={d.equipments ?? []}
                  t={t}
                />
              </div>

              <AdminRoomAuditSidebar
                createdAt={d.auditResponse.createdAt}
                createdBy={d.auditResponse.createdBy}
                updatedAt={d.auditResponse.updatedAt}
                updatedBy={d.auditResponse.updatedBy}
                formatIsoDateTime={formatIsoDate}
                t={t}
              />
            </div>
          </>
        ) : null}
      </div>

      {d ? (
        <AdminRoomAuditStatusModal
          open={statusOpen}
          roomName={d.roomName}
          nextStatus={nextStatus}
          statusOptions={STATUS_SELECT_OPTIONS}
          isPending={statusMutation.isPending}
          t={t}
          onClose={() => setStatusOpen(false)}
          onChangeStatus={(s) => setNextStatus(s)}
          onConfirm={confirmStatus}
          confirmDisabled={nextStatus === (d.status as AdminRoomStatus)}
        />
      ) : null}
      </div>
    </AppLayout>
  );
};
