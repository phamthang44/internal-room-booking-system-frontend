import { Link } from "react-router-dom";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";
import { buildRoomBookingUrl } from "../utils/roomBookingIntent";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type { RoomUI } from "../types/classroom.api.types";
import { RoomStatusChip } from "./RoomStatusChip";

// ── Grid card (3-col default) ─────────────────────────────────────────────────

interface RoomCardProps {
  room: RoomUI;
  onCheckAvailability?: (room: RoomUI) => void;
}

const formatClock = (t: string) => (t.length >= 5 ? t.slice(0, 5) : t);

export const RoomCard = ({ room, onCheckAvailability }: RoomCardProps) => {
  const { t } = useI18n();
  const filters = useRoomFilterStore();
  const detailUrl = buildRoomBookingUrl(room.id, filters);
  const isActionable = room.availability === "available";
  const hasQueriedSlots = (room.totalQueriedSlots ?? 0) > 0;
  const slotsToRender =
    hasQueriedSlots && room.queriedSlotsStatus && room.queriedSlotsStatus.length > 0
      ? room.queriedSlotsStatus
      : room.dailySchedule?.slots;

  return (
    <div
      id={`room-card-${room.id}`}
      className={cn(
        "room-card group",
      )}
    >
      <div className="room-card-core">
      {/* Room photography, with a text fallback when no image exists. */}
      <div
        className="room-card-media"
      >
        {room.imageUrl ? (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : <div className="room-card-placeholder" aria-hidden="true">{room.name}</div>}
        {/* Building badge — top-left */}
        {room.building && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-on-surface">
            {room.building}
          </span>
        )}
        {/* Status badge — top-right */}
        <div className="absolute right-3 top-3">
          <RoomStatusChip status={room.availability} />
        </div>
        {/* Decorative room-type overlay (bottom strip) */}
        <div className="room-type-label">
          {room.roomType && (
            <span className="text-xs font-medium">
              {room.roomType}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div className="room-card-body">
        {/* Room code + name */}
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-headline text-base font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
              {room.name}
            </h3>
            <span className="shrink-0 text-xs font-semibold text-on-surface-variant">
              {room.capacity}
              <span className="ml-0.5 text-xs font-normal">
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
                className="flex items-center gap-1 text-on-surface-variant text-xs"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {getEquipmentIcon(name)}
                </span>
                <span>{name}</span>
              </span>
            ))}
            {room.equipmentNames.length > 4 && (
              <span className="flex h-7 items-center rounded-full bg-surface-container px-2 text-xs font-medium text-on-surface-variant">
                +{room.equipmentNames.length - 4}
              </span>
            )}
          </div>
        )}

        {hasQueriedSlots && room.totalQueriedSlots != null && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-container-low px-3 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.queriedSlots")}
            </span>
            <span className="text-xs font-black tracking-wide text-on-surface">
              {(room.availableSlotCount ?? 0)}/{room.totalQueriedSlots} {t("rooms.card.free")}
            </span>
          </div>
        )}

        {slotsToRender && slotsToRender.length > 0 && (
          <div className="space-y-1.5 border-t border-outline-variant/40 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.schedule")}
            </p>
            <div className="flex flex-wrap gap-1">
              {slotsToRender.map((slot) => {
                const isPast = slot.isPast;
                return (
                  <span
                    key={slot.slotId}
                    title={`${formatClock(slot.startTime)}–${formatClock(slot.endTime)}${isPast ? ` (${t("roomDetail.slots.past")})` : ""}`}
                    className={cn(
                      "max-w-full truncate rounded-lg px-2 py-0.5 text-xs font-medium",
                      isPast
                        ? "bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/30"
                        : slot.isAvailable
                          ? "bg-primary/12 text-primary"
                          : "bg-error-container/70 text-error border border-error/20"
                    )}
                  >
                    {slot.slotName}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {room.availableForQuery === false && (
          <p className="flex items-start gap-1 text-xs leading-snug text-amber-700 dark:text-amber-400">
            <span className="material-symbols-outlined shrink-0 text-[14px]">info</span>
            {t("rooms.card.notMatchingFilters")}
          </p>
        )}

        {/* Actions */}
        <div className="room-card-actions">
          {onCheckAvailability ? (
            <button
              type="button"
              onClick={() => onCheckAvailability(room)}
              disabled={!isActionable}
              className="room-action-availability"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 4-4" />
              </svg>
              <span>{t("rooms.card.checkAvailability")}</span>
            </button>
          ) : (
            <Link
              to={detailUrl}
              className="room-action-availability"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 4-4" />
              </svg>
              <span>{t("rooms.card.checkAvailability")}</span>
            </Link>
          )}
          {isActionable ? (
            <Link
              to={detailUrl}
              className="room-action-details"
            >
              <span>{t("rooms.card.viewDetails")}</span>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="room-action-details"
              title={t("rooms.availabilitySummary.roomUnavailableTitle")}
            >
              <span>{t("rooms.card.viewDetails")}</span>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

// ── List row (used in list view) ──────────────────────────────────────────────

export const RoomCardList = ({ room, onCheckAvailability }: RoomCardProps) => {
  const { t } = useI18n();
  const filters = useRoomFilterStore();
  const detailUrl = buildRoomBookingUrl(room.id, filters);
  const isActionable = room.availability === "available";
  const hasQueriedSlots = (room.totalQueriedSlots ?? 0) > 0;
  const slotsToRender =
    hasQueriedSlots && room.queriedSlotsStatus && room.queriedSlotsStatus.length > 0
      ? room.queriedSlotsStatus
      : room.dailySchedule?.slots;

  return (
    <div
      id={`room-list-${room.id}`}
      className={cn(
        "group flex flex-wrap items-center gap-4 rounded-2xl bg-surface-container-lowest p-5 ring-1 ring-primary/5",
      )}
    >
      {/* Thumbnail */}
      <div
        className="hidden sm:block h-20 w-24 shrink-0 rounded-xl overflow-hidden bg-surface-container-low"
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
            <h3 className="font-headline text-base font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.queriedSlots")}
            </span>
            <span className="text-xs font-black tracking-wide text-on-surface">
              {(room.availableSlotCount ?? 0)}/{room.totalQueriedSlots} {t("rooms.card.free")}
            </span>
          </div>
        )}

        {slotsToRender && slotsToRender.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-outline-variant/30 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              {t("rooms.card.schedule")}
            </span>
            {slotsToRender.map((slot) => {
              const isPast = slot.isPast;
              return (
                <span
                  key={slot.slotId}
                  title={`${formatClock(slot.startTime)}–${formatClock(slot.endTime)}${isPast ? ` (${t("roomDetail.slots.past")})` : ""}`}
                  className={cn(
                    "truncate rounded-md px-1.5 py-0.5 text-xs font-medium",
                    isPast
                      ? "bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/30"
                      : slot.isAvailable
                        ? "bg-primary/12 text-primary"
                        : "bg-error-container/70 text-error border border-error/20"
                  )}
                >
                  {slot.slotName}
                </span>
              );
            })}
          </div>
        )}

        {room.availableForQuery === false && (
          <p className="mt-1 flex items-start gap-1 text-xs text-amber-700 dark:text-amber-400">
            <span className="material-symbols-outlined shrink-0 text-[14px]">info</span>
            {t("rooms.card.notMatchingFilters")}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="room-card-actions room-card-actions-list">
        {onCheckAvailability ? (
          <button
            type="button"
            onClick={() => onCheckAvailability(room)}
            disabled={!isActionable}
            className="room-action-availability"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 4-4" />
              </svg>
              <span>{t("rooms.card.checkAvailability")}</span>
          </button>
        ) : (
          <Link
            to={detailUrl}
            className="room-action-availability"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M16 3v4M8 3v4M3 11h18m-13 5 2 2 4-4" />
              </svg>
              <span>{t("rooms.card.checkAvailability")}</span>
          </Link>
        )}
        {isActionable ? (
          <Link
            to={detailUrl}
            className="room-action-details"
          >
            <span>{t("rooms.card.viewDetails")}</span>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="room-action-details"
            title={t("rooms.availabilitySummary.roomUnavailableTitle")}
          >
            <span>{t("rooms.card.viewDetails")}</span>
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-5-5 5 5-5 5" />
              </svg>
          </button>
        )}
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
