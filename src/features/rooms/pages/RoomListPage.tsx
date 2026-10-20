import { useLayoutEffect, useRef, useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { RoomActiveFilters } from "../components/RoomActiveFilters";
import { SearchBar } from "../components/SearchBar";
import { BookingSearchControls } from "../components/BookingSearchControls";
import { FilterSidebar } from "../components/FilterSidebar";
import { RoomGrid } from "../components/RoomGrid";
import { AvailabilitySummaryModal } from "../components/AvailabilitySummaryModal";
import { useClassrooms } from "../hooks/useClassrooms";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";
import { cn } from "@shared/utils/cn";
import type { RoomUI } from "../types/classroom.api.types";

export const RoomListPage = () => {
  const [pagination, setPagination] = useState({ filterKey: "", page: 1 });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const filterDrawerRef = useRef<HTMLDivElement>(null);
  const [availabilityRoom, setAvailabilityRoom] = useState<RoomUI | null>(null);
  const { t } = useI18n();

  const filters = useRoomFilterStore();
  const filterKey = JSON.stringify([filters.search, filters.bookingDate, filters.timeSlotIds, filters.minCapacity, filters.equipmentId, filters.roomStatus, filters.sort]);
  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const { data, isLoading, isFetching, isPlaceholderData, isError, refetch } = useClassrooms(page);
  const filterCount = Number(filters.equipmentId > 0) + Number(Boolean(filters.roomStatus));

  useLayoutEffect(() => {
    if (!filterDrawerOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () => Array.from(filterDrawerRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]') ?? []).filter(el => el.getClientRects().length > 0);
    const focusTimer = window.setTimeout(() => focusables()[0]?.focus(), 0);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setFilterDrawerOpen(false); }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items[items.length - 1]?.focus(); }
      else if (!event.shiftKey && document.activeElement === items[items.length - 1]) { event.preventDefault(); items[0]?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      previousFocus?.focus();
    };
  }, [filterDrawerOpen]);

  return (
    <AppLayout>
      <div className="page-frame">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="page-title">
            {t("rooms.pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t("rooms.pageSubtitle")}
          </p>
        </div>

        {/* ── Search bar ── */}
        <SearchBar className="mb-6" />
        <BookingSearchControls />
        <RoomActiveFilters />

        {/* ── Layout: filter sidebar + room grid ── */}
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Desktop sidebar */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="filter-panel">
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden">
            <button
              id="mobile-filter-toggle"
              aria-controls="room-filter-drawer"
              aria-expanded={filterDrawerOpen}
              onClick={() => setFilterDrawerOpen(true)}
              className="mb-4 flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
              {t("rooms.filters.mobileToggle")}
              {filterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                  {filterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile drawer */}
          {filterDrawerOpen && (
            <>
              <div
                className="fixed inset-0 z-[65] bg-on-surface/25 lg:hidden"
                onClick={() => setFilterDrawerOpen(false)}
              />
              <div ref={filterDrawerRef} id="room-filter-drawer" role="dialog" aria-modal="true" aria-label={t("rooms.filters.mobileToggle")} className="fixed inset-y-0 right-0 z-[70] w-80 max-w-[calc(100vw-24px)] overflow-y-auto bg-surface p-6 shadow-xl lg:hidden">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-headline text-base font-semibold text-on-surface">
                    {t("rooms.filters.mobileToggle")}
                  </h2>
                  <button
                    aria-label={t("common.errors.http.dismiss")}
                    onClick={() => setFilterDrawerOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <FilterSidebar />
                <button type="button" className="action-primary mt-6 w-full" onClick={() => setFilterDrawerOpen(false)}>{t("rooms.filters.showResults")}</button>
              </div>
            </>
          )}

          {/* Room grid + toolbar */}
          <div aria-busy={isFetching} className="min-w-0 flex-1">
            <RoomGrid
              rooms={data?.rooms}
              total={data?.total}
              isLoading={isLoading || isPlaceholderData}
              isError={isError}
              onRetry={() => void refetch()}
              onCheckAvailability={(room) => setAvailabilityRoom(room)}
            />

            {/* Pagination */}
            {data && !isPlaceholderData && data.totalPages > 1 && (
              <div aria-label={t("rooms.pagination.label")} className="mt-8 flex items-center justify-center gap-2">
                <button
                  aria-label={t("rooms.pagination.previous")}
                  onClick={() => setPagination({ filterKey, page: Math.max(1, page - 1) })}
                  disabled={page === 1 || isFetching}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-sm text-on-surface-variant">
                  {t("rooms.pagination.pageOf", {
                    page: data.page,
                    total: data.totalPages,
                  })}
                </span>
                <button
                  aria-label={t("rooms.pagination.next")}
                  onClick={() => setPagination({ filterKey, page: Math.min(data.totalPages, page + 1) })}
                  disabled={page === data.totalPages || isFetching}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AvailabilitySummaryModal
        open={availabilityRoom != null}
        room={availabilityRoom}
        onClose={() => setAvailabilityRoom(null)}
      />
    </AppLayout>
  );
};
