import { Link } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type { RoomUI } from "../types/classroom.api.types";
import { RoomStatusChip, roomStatusCardClasses } from "./RoomStatusChip";

// ── Grid card (3-col default) ─────────────────────────────────────────────────

interface RoomCardProps {
  room: RoomUI;
  onCheckAvailability?: (roomId: string) => void;
}

const formatClock = (t: string) => (t.length >= 5 ? t.slice(0, 5) : t);

export const RoomCard = ({ room, onCheckAvailability }: RoomCardProps) => {
  const { t } = useI18n();
  const hasQueriedSlots = (room.totalQueriedSlots ?? 0) > 0;
  const slotsToRender =
    hasQueriedSlots && room.queriedSlotsStatus && room.queriedSlotsStatus.length > 0
      ? room.queriedSlotsStatus
      : room.dailySchedule?.slots;

  return (
    <div
      id={`room-card-${room.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(24,28,30,0.06)] transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(24,28,30,0.10)]",
        roomStatusCardClasses[room.availability],
      )}
    >
      {/* ── Image / gradient ─────────────────────────────────────────── */}
      <div
        className="relative h-44 w-full overflow-hidden"
        style={{ background: room.imageGradient }}
      >
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : null}
        {/* Building badge — top-left */}
        {room.building && (
          <span className="absolute left-3 top-3 rounded-full bg-surface-container-lowest/85 px-2.5 py-0.5 font-headline text-[10px] font-bold uppercase tracking-wider text-on-surface backdrop-blur-sm">
            {room.building}
          </span>
        )}
        {/* Status badge — top-right */}
        <div className="absolute right-3 top-3">
          <RoomStatusChip status={room.availability} />
        </div>
        {/* Decorative room-type overlay (bottom strip) */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent px-3 pb-2 pt-6">
          {room.roomType && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/80">
              {room.roomType}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Room code + name */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
              {room.name}
            </h3>
            <span className="shrink-0 text-xs font-semibold text-on-surface-variant">
              {room.capacity}
              <span className="ml-0.5 text-[10px] font-normal">
                {t("rooms.card.seats")}
              </span>
            </span>
          </div>
          {room.building && (
            <p className="mt-0.5 text-xs text-on-surface-variant truncate">
              {room.building}
            </p>
          )}
        </div>

        {/* Equipment icons row */}
        {room.equipmentNames.length > 0 && (
          <div className="flex flex-wrap gap-1.5 py-1">
            {room.equipmentNames.slice(0, 4).map((name) => (
              <span
                key={name}
                title={name}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {getEquipmentIcon(name)}
                </span>
              </span>
            ))}
            {room.equipmentNames.length > 4 && (
              <span className="flex h-7 items-center rounded-full bg-surface-container px-2 text-[10px] font-medium text-on-surface-variant">
                +{room.equipmentNames.length - 4}
              </span>
            )}
          </div>
        )}

        {hasQueriedSlots && room.totalQueriedSlots != null && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-low px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.queriedSlots")}
            </span>
            <span className="text-[10px] font-black tracking-wide text-on-surface">
              {(room.availableSlotCount ?? 0)}/{room.totalQueriedSlots} {t("rooms.card.free")}
            </span>
          </div>
        )}

        {slotsToRender && slotsToRender.length > 0 && (
          <div className="space-y-1.5 border-t border-outline-variant/40 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.schedule")}
            </p>
            <div className="flex flex-wrap gap-1">
              {slotsToRender.map((slot) => (
                <span
                  key={slot.slotId}
                  title={`${formatClock(slot.startTime)}–${formatClock(slot.endTime)}`}
                  className={cn(
                    "max-w-full truncate rounded-lg px-2 py-0.5 text-[10px] font-medium",
                    slot.isAvailable
                      ? "bg-primary/12 text-primary"
                      : "bg-error-container/70 text-error border border-error/20"
                  )}
                >
                  {slot.slotName}
                </span>
              ))}
            </div>
          </div>
        )}

        {room.availableForQuery === false && (
          <p className="flex items-start gap-1 text-[10px] leading-snug text-amber-700 dark:text-amber-400">
            <span className="material-symbols-outlined shrink-0 text-[14px]">info</span>
            {t("rooms.card.notMatchingFilters")}
          </p>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          {onCheckAvailability ? (
            <button
              type="button"
              onClick={() => onCheckAvailability(room.id)}
              className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary-container py-2 text-center text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {t("rooms.card.checkAvailability")}
            </button>
          ) : (
            <Link
              to={`/rooms/${room.id}`}
              className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary-container py-2 text-center text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
            >
              {t("rooms.card.checkAvailability")}
            </Link>
          )}
          <Link
            to={`/rooms/${room.id}`}
            className="rounded-xl border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface-variant transition-colors hover:border-primary/40 hover:text-on-surface"
          >
            {t("rooms.card.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── List row (used in list view) ──────────────────────────────────────────────

export const RoomCardList = ({ room, onCheckAvailability }: RoomCardProps) => {
  const { t } = useI18n();
  const hasQueriedSlots = (room.totalQueriedSlots ?? 0) > 0;
  const slotsToRender =
    hasQueriedSlots && room.queriedSlotsStatus && room.queriedSlotsStatus.length > 0
      ? room.queriedSlotsStatus
      : room.dailySchedule?.slots;

  return (
    <div
      id={`room-list-${room.id}`}
      className={cn(
        "group flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-[0_1px_6px_rgba(24,28,30,0.05)] transition-all hover:shadow-[0_4px_20px_rgba(24,28,30,0.08)]",
        roomStatusCardClasses[room.availability],
      )}
    >
      {/* Thumbnail */}
      <div
        className="h-20 w-28 shrink-0 rounded-xl overflow-hidden"
        style={{ background: room.imageGradient }}
      >
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-headline text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
              {room.name}
            </h3>
            {room.building && (
              <p className="mt-0.5 text-xs text-on-surface-variant">
                {room.building}
              </p>
            )}
          </div>
          <RoomStatusChip status={room.availability} className="shrink-0" />
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">
              people
            </span>
            {room.capacity} {t("rooms.card.seats")}
          </span>
          {room.roomType && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">
                category
              </span>
              {room.roomType}
            </span>
          )}
          {room.equipmentNames.slice(0, 3).map((name) => (
            <span key={name} className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[12px]">
                {getEquipmentIcon(name)}
              </span>
              {name}
            </span>
          ))}
          {room.equipmentNames.length > 3 && (
            <span>
              +{room.equipmentNames.length - 3} {t("rooms.card.more")}
            </span>
          )}
        </div>

        {hasQueriedSlots && room.totalQueriedSlots != null && (
          <div className="mt-2 flex items-center justify-between gap-2 rounded-xl bg-surface-container-low px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.queriedSlots")}
            </span>
            <span className="text-[10px] font-black tracking-wide text-on-surface">
              {(room.availableSlotCount ?? 0)}/{room.totalQueriedSlots} {t("rooms.card.free")}
            </span>
          </div>
        )}

        {slotsToRender && slotsToRender.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-outline-variant/30 pt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.schedule")}
            </span>
            {slotsToRender.map((slot) => (
              <span
                key={slot.slotId}
                title={`${formatClock(slot.startTime)}–${formatClock(slot.endTime)}`}
                className={cn(
                  "truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                  slot.isAvailable
                    ? "bg-primary/12 text-primary"
                    : "bg-error-container/70 text-error border border-error/20"
                )}
              >
                {slot.slotName}
              </span>
            ))}
          </div>
        )}

        {room.availableForQuery === false && (
          <p className="mt-1 flex items-start gap-1 text-[10px] text-amber-700 dark:text-amber-400">
            <span className="material-symbols-outlined shrink-0 text-[14px]">info</span>
            {t("rooms.card.notMatchingFilters")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-col gap-2">
        {onCheckAvailability ? (
          <button
            type="button"
            onClick={() => onCheckAvailability(room.id)}
            className="rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            {t("rooms.card.checkAvailability")}
          </button>
        ) : (
          <Link
            to={`/rooms/${room.id}`}
            className="rounded-xl bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-xs font-semibold text-on-primary transition-opacity hover:opacity-90"
          >
            {t("rooms.card.checkAvailability")}
          </Link>
        )}
        <Link
          to={`/rooms/${room.id}`}
          className="rounded-xl border border-outline-variant px-4 py-2 text-center text-xs font-semibold text-on-surface-variant transition-colors hover:border-primary/40 hover:text-on-surface"
        >
          {t("rooms.card.viewDetails")}
        </Link>
      </div>
    </div>
  );
};

// ── Utility: map equipment names → Material Symbols icons ─────────────────────

const ICON_BY_KEYWORD: [string, string][] = [
  ["projector", "videocam"],
  ["whiteboard", "edit_square"],
  ["video", "video_call"],
  ["air", "ac_unit"],
  ["computer", "computer"],
  ["smart", "smart_display"],
  ["audio", "speaker"],
  ["speaker", "speaker"],
];

function getEquipmentIcon(name: string): string {
  const lower = name.toLowerCase();
  const match = ICON_BY_KEYWORD.find(([kw]) => lower.includes(kw));
  return match ? match[1] : "check_circle";
}
