import { useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { SearchBar } from "../components/SearchBar";
import { FilterSidebar } from "../components/FilterSidebar";
import { RoomGrid } from "../components/RoomGrid";
import { useClassrooms } from "../hooks/useClassrooms";
import { useRoomFilterStore } from "../hooks/useRoomFilterStore";
import { cn } from "@shared/utils/cn";

export const RoomListPage = () => {
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const { t } = useI18n();

  const { data, isLoading, isError, refetch } = useClassrooms(page);
  const { activeFilterCount } = useRoomFilterStore();
  const filterCount = activeFilterCount();

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">
        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            {t("rooms.pageTitle")}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t("rooms.pageSubtitle")}
          </p>
        </div>

        {/* ── Search bar ── */}
        <SearchBar className="mb-6" />

        {/* ── Layout: filter sidebar + room grid ── */}
        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl bg-surface-container-lowest p-5 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
              <FilterSidebar />
            </div>
          </div>

          {/* Mobile filter button */}
          <div className="lg:hidden">
            <button
              id="mobile-filter-toggle"
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
                className="fixed inset-0 z-40 bg-on-surface/30 backdrop-blur-sm lg:hidden"
                onClick={() => setFilterDrawerOpen(false)}
              />
              <div className="fixed inset-y-0 right-0 z-50 w-80 overflow-y-auto bg-surface p-6 shadow-xl lg:hidden">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="font-headline text-base font-semibold text-on-surface">
                    {t("rooms.filters.mobileToggle")}
                  </h2>
                  <button
                    onClick={() => setFilterDrawerOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
                <FilterSidebar />
              </div>
            </>
          )}

          {/* Room grid + toolbar */}
          <div className="min-w-0 flex-1">
            <RoomGrid
              rooms={data?.rooms}
              total={data?.total}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => void refetch()}
            />

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant text-sm transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                  )}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="text-sm text-on-surface-variant">
                  {t("rooms.pagination.pageOf")
                    .replace("{{page}}", String(data.page))
                    .replace("{{total}}", String(data.totalPages))}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
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
    </AppLayout>
  );
};
