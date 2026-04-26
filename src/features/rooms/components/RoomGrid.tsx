import { useMemo } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { SkeletonBlock } from "@shared/components/SkeletonBlock";
import { RoomCard, RoomCardList } from "./RoomCard";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";
import type { RoomUI, RoomSortApi } from "../types/classroom.api.types";
import { cn } from "@shared/utils/cn";
import { CustomSelect } from "@shared/components/CustomSelect";

// ── Sort options ──────────────────────────────────────────────────────────────
const SORT_OPTIONS: { value: RoomSortApi | ""; label: string }[] = [
  { value: "", label: "rooms.sort.default" },
  { value: "newest", label: "rooms.sort.newest" },
  { value: "room_name_asc", label: "rooms.sort.nameAsc" },
  { value: "room_name_desc", label: "rooms.sort.nameDesc" },
  { value: "capacity_asc", label: "rooms.sort.capacityAsc" },
  { value: "capacity_desc", label: "rooms.sort.capacityDesc" },
];

// ── Skeleton cards ─────────────────────────────────────────────────────────────

const GridSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
    <SkeletonBlock className="h-44 w-full rounded-none" />
    <div className="flex flex-col gap-3 p-4">
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
      <div className="flex gap-1.5 py-1">
        <SkeletonBlock className="h-7 w-7 rounded-full" />
        <SkeletonBlock className="h-7 w-7 rounded-full" />
        <SkeletonBlock className="h-7 w-7 rounded-full" />
      </div>
      <SkeletonBlock className="h-9 w-full rounded-xl" />
    </div>
  </div>
);

const ListSkeleton = () => (
  <div className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4">
    <SkeletonBlock className="h-20 w-28 shrink-0 rounded-xl" />
    <div className="flex-1 space-y-2">
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-3 w-1/3" />
      <SkeletonBlock className="h-3 w-2/3" />
    </div>
    <div className="flex shrink-0 flex-col gap-2">
      <SkeletonBlock className="h-8 w-32 rounded-xl" />
      <SkeletonBlock className="h-8 w-32 rounded-xl" />
    </div>
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState = ({
  hasFilters,
  slotFilterNoMatches,
}: {
  hasFilters: boolean;
  slotFilterNoMatches?: boolean;
}) => {
  const { clearAll } = useRoomFilterStore();
  const { t } = useI18n();
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-20 text-center">
      <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">search_off</span>
      <p className="font-headline text-base font-semibold text-on-surface">
        {slotFilterNoMatches ? t("rooms.empty.slotTitle") : t("rooms.empty.title")}
      </p>
      <p className="text-sm text-on-surface-variant">
        {slotFilterNoMatches
          ? t("rooms.empty.slotUnavailable")
          : hasFilters
            ? t("rooms.empty.withFilters")
            : t("rooms.empty.noRooms")}
      </p>
      {hasFilters && (
        <button
          onClick={clearAll}
          className="mt-2 rounded-xl border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          {t("rooms.empty.clearFilters")}
        </button>
      )}
    </div>
  );
};

// ── Error state ───────────────────────────────────────────────────────────────

const ErrorState = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useI18n();
  return (
    <div className="col-span-full flex flex-col items-center gap-3 py-16 text-center">
      <span className="material-symbols-outlined text-4xl text-error">error_outline</span>
      <p className="text-sm text-on-surface-variant">{t("rooms.error.loadFailed")}</p>
      <button
        onClick={onRetry}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 transition-opacity"
      >
        {t("rooms.error.retry")}
      </button>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

interface RoomGridProps {
  rooms?: RoomUI[];
  total?: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const RoomGrid = ({ rooms, total, isLoading, isError, onRetry }: RoomGridProps) => {
  const {
    activeFilterCount,
    search,
    viewMode,
    setViewMode,
    sort,
    setSort,
    timeSlotIds,
  } = useRoomFilterStore();
  const { t } = useI18n();
  const hasFilters = activeFilterCount() > 0 || search.length > 0;
  const isGrid = viewMode === "grid";

  const rawRooms = rooms ?? [];
  const slotFilterActive = timeSlotIds.length > 0;

  /**
   * With a time slot selected, omit rows where `availableForQuery` is false.
   * Pagination totals from the API still reflect the unfiltered query; the count line uses copy that refers to this page only.
   */
  const displayRooms = useMemo(() => {
    if (!slotFilterActive) return rawRooms;
    return rawRooms.filter((r) => r.availableForQuery !== false);
  }, [rawRooms, slotFilterActive]);

  const slotFilterNoMatches =
    !isLoading &&
    !isError &&
    slotFilterActive &&
    rawRooms.length > 0 &&
    displayRooms.length === 0;

  // ── Result label (slot filter: count on this page only; API total is not narrowed server-side) ──
  const countLabel = (() => {
    if (isLoading || isError || total === undefined) return "";
    if (total === 0) return t("rooms.grid.noResults");
    if (slotFilterActive) {
      return t("rooms.grid.showingSlotPage", { count: displayRooms.length });
    }
    const shown = rawRooms.length;
    if (total === 1) return t("rooms.grid.showingOne", { shown, total });
    return t("rooms.grid.showing", { shown, total });
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar: result count + sort + view toggle ─────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Result count */}
        <p className="text-sm text-on-surface-variant">{countLabel}</p>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="flex items-center gap-2 text-sm text-on-surface-variant z-10">
            <span className="font-medium text-on-surface">{t("rooms.sort.title")}</span>
            <CustomSelect
              value={sort}
              onChange={(val) => setSort(val as typeof sort)}
              options={SORT_OPTIONS}
              className="w-40"
              menuClassName="w-44 right-0 left-auto"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-xl border border-outline-variant overflow-hidden">
            <button
              id="view-toggle-grid"
              onClick={() => setViewMode("grid")}
              title={t("rooms.view.grid")}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                isGrid
                  ? "bg-primary text-on-primary"
                  : "bg-surface text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              id="view-toggle-list"
              onClick={() => setViewMode("list")}
              title={t("rooms.view.list")}
              className={cn(
                "flex h-8 w-8 items-center justify-center transition-colors",
                !isGrid
                  ? "bg-primary text-on-primary"
                  : "bg-surface text-on-surface-variant hover:bg-surface-container"
              )}
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Room list ── */}
      {isGrid ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <GridSkeleton key={i} />)
          ) : isError ? (
            <ErrorState onRetry={onRetry} />
          ) : slotFilterNoMatches ? (
            <EmptyState hasFilters={hasFilters} slotFilterNoMatches />
          ) : !rawRooms.length ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            displayRooms.map((room) => <RoomCard key={room.id} room={room} />)
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <ListSkeleton key={i} />)
          ) : isError ? (
            <ErrorState onRetry={onRetry} />
          ) : slotFilterNoMatches ? (
            <EmptyState hasFilters={hasFilters} slotFilterNoMatches />
          ) : !rawRooms.length ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            displayRooms.map((room) => <RoomCardList key={room.id} room={room} />)
          )}
        </div>
      )}
    </div>
  );
};
