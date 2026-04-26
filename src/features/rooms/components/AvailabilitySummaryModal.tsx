import { useEffect } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { RoomUI } from "../types/classroom.api.types";

export interface AvailabilitySummaryModalProps {
  open: boolean;
  room: RoomUI | null;
  onClose: () => void;
}

const formatClock = (t: string) => (t.length >= 5 ? t.slice(0, 5) : t);

export function AvailabilitySummaryModal({
  open,
  room,
  onClose,
}: AvailabilitySummaryModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !room) return null;

  const hasQueriedSlots = (room.totalQueriedSlots ?? 0) > 0;
  const slots =
    hasQueriedSlots && room.queriedSlotsStatus && room.queriedSlotsStatus.length > 0
      ? room.queriedSlotsStatus
      : room.dailySchedule?.slots ?? [];

  const summaryText = hasQueriedSlots && room.totalQueriedSlots != null
    ? `${room.availableSlotCount ?? 0}/${room.totalQueriedSlots}`
    : "";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("rooms.availabilitySummary.title")}
        className={cn(
          "relative w-full max-w-lg rounded-2xl border border-outline-variant/20",
          "bg-surface-container-lowest/85 shadow-2xl backdrop-blur-md"
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/20 p-5 sm:p-6">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
              {t("rooms.availabilitySummary.title")}
            </p>
            <h2 className="mt-1 truncate font-headline text-lg font-extrabold text-on-surface">
              {room.name}
            </h2>
            {room.building ? (
              <p className="mt-1 text-sm text-on-surface-variant">{room.building}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          {/* Summary */}
          {hasQueriedSlots && room.totalQueriedSlots != null ? (
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 border border-outline-variant/20">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                  {t("rooms.availabilitySummary.selectedSlots")}
                </p>
                <p className="text-sm font-semibold text-on-surface">
                  {t("rooms.availabilitySummary.freeCount", {
                    available: room.availableSlotCount ?? 0,
                    total: room.totalQueriedSlots,
                  })}
                </p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-3 py-1 text-xs font-black tracking-wide",
                  (room.availableSlotCount ?? 0) === room.totalQueriedSlots
                    ? "bg-tertiary-fixed/30 text-on-tertiary-fixed-variant"
                    : (room.availableSlotCount ?? 0) === 0
                      ? "bg-error-container/70 text-error"
                      : "bg-secondary-container text-on-secondary-container"
                )}
                title={summaryText}
              >
                {summaryText}
              </span>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface px-4 py-3 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">
                {t("rooms.availabilitySummary.noSlotFilterHint")}
              </p>
            </div>
          )}

          {/* Slots */}
          {slots.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant">
                {hasQueriedSlots
                  ? t("rooms.availabilitySummary.slotBreakdown")
                  : t("rooms.availabilitySummary.daySchedule")}
              </p>

              <div className="space-y-2">
                {slots.map((s) => (
                  <div
                    key={s.slotId}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-4 py-3",
                      s.isAvailable
                        ? "border-tertiary-fixed/25 bg-tertiary-fixed/10"
                        : "border-error/20 bg-error-container/35"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-on-surface">
                        {s.slotName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {formatClock(s.startTime)}–{formatClock(s.endTime)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
                        s.isAvailable
                          ? "bg-tertiary-fixed/25 text-on-tertiary-fixed-variant"
                          : "bg-error-container/70 text-error"
                      )}
                    >
                      {s.isAvailable
                        ? t("rooms.availabilitySummary.free")
                        : t("rooms.availabilitySummary.occupied")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface px-4 py-3 border border-outline-variant/20">
              <p className="text-sm text-on-surface-variant">
                {t("rooms.availabilitySummary.noSchedule")}
              </p>
            </div>
          )}

          {/* Note */}
          {room.availableForQuery === false ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                {t("rooms.card.notMatchingFilters")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

