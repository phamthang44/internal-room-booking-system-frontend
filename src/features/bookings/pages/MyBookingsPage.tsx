import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { type MyBookingsFilter } from "../hooks/useMyBookings";
import { BookingStatusTabs } from "../components/BookingStatusTabs"; // still used as a visual "view" filter
import { ActiveReservoirCard } from "../components/ActiveReservoirCard";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { BookingHistoryGrid } from "../components/BookingHistoryGrid";
import { bookingsApiService, type MyBookingsUiData } from "../api/bookings.api.service";
import type { BookingSearchParams, BookingSortApi, BookingStatusApi } from "../types/bookings.api.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/components/ui/popover";
import { Calendar } from "@shared/components/ui/calendar";
import { format, parseISO } from "date-fns";

export interface MyBookingsPageProps {
  readonly className?: string;
}

const DEFAULT_PAGE_SIZE = 20;

export function MyBookingsPage({ className }: Readonly<MyBookingsPageProps>) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [filter, setFilter] = useState<MyBookingsFilter>("all");

  // Search inputs (mapped to backend BookingSearchRequest fields)
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [bookingDate, setBookingDate] = useState<string>("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [status, setStatus] = useState<BookingStatusApi | "">("");
  const [timeSlotId, setTimeSlotId] = useState<string>("");
  const [attendees, setAttendees] = useState<string>("");
  const [sort, setSort] = useState<BookingSortApi>("newest");
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(DEFAULT_PAGE_SIZE);

  // Debounce keyword so we don't hammer the API while typing
  useEffect(() => {
    const tmr = window.setTimeout(() => {
      setKeyword(keywordInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(tmr);
  }, [keywordInput]);

  const params: BookingSearchParams = useMemo(() => {
    const parsedTimeSlotId = timeSlotId.trim() ? Number(timeSlotId) : null;
    const parsedAttendees = attendees.trim() ? Number(attendees) : null;

    return {
      keyword: keyword || null,
      bookingDate: bookingDate || null,
      status: status || null,
      timeSlotId: Number.isFinite(parsedTimeSlotId as number) ? (parsedTimeSlotId as number) : null,
      attendees: Number.isFinite(parsedAttendees as number) ? (parsedAttendees as number) : undefined,
      page,
      size,
      sort,
    };
  }, [keyword, bookingDate, status, timeSlotId, attendees, page, size, sort]);

  const query = useQuery({
    queryKey: ["bookings", "my", "search", params],
    queryFn: (): Promise<MyBookingsUiData> => bookingsApiService.searchMyBookings(params),
    staleTime: 1000 * 15,
  });

  const data = query.data ?? null;
  const isLoading = query.isLoading;
  const isError = query.isError;

  const filteredRecentActivityItems = useMemo(() => {
    if (!data) return [];
    const items = data.recentActivity.items ?? [];
    if (filter === "all") return items;
    if (filter === "pending") return items.filter((i) => i.status === "pending");
    // “Completed” is a UI view mode; recent activity is only pending/confirmed in our adapter
    return [];
  }, [data, filter]);

  const header = useMemo(() => {
    return {
      title: t("bookings.pageTitle"),
      subtitle: t("bookings.pageSubtitle"),
    };
  }, [t]);

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const activeAdvancedFilterCount = useMemo(() => {
    return (timeSlotId.trim() ? 1 : 0) + (attendees.trim() ? 1 : 0) + (sort !== "newest" ? 1 : 0);
  }, [timeSlotId, attendees, sort]);

  const hasAnyFilter = Boolean(
    keywordInput.trim() || bookingDate || status || timeSlotId.trim() || attendees.trim() || sort !== "newest"
  );

  const resetAllFilters = () => {
    setKeywordInput("");
    setKeyword("");
    setBookingDate("");
    setStatus("");
    setTimeSlotId("");
    setAttendees("");
    setSort("newest");
    setPage(1);
    setSize(DEFAULT_PAGE_SIZE);
  };

  return (
    <AppLayout>
      <div className={cn("page-frame max-w-7xl mx-auto", className)}>
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 mb-3">
                <span className="material-symbols-outlined text-[15px]">event_available</span>
                <span>QUẢN LÝ LỊCH ĐẶT CHỖ</span>
              </div>
              <h1 className="page-title text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
                {header.title}
              </h1>
              <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">{header.subtitle}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BookingStatusTabs value={filter} onChange={setFilter} />
              <button
                type="button"
                onClick={() => navigate("/rooms")}
                className="action-primary text-xs"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                {t("bookings.history.bookNew")}
                <span className="action-arrow">→</span>
              </button>
            </div>
          </div>

          {/* KPI Bento Strip */}
          {data && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                    Lịch hoạt động
                  </span>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface">
                  {data.summary.reservedSlots}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">Đang giữ chỗ hợp lệ</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                    Yêu cầu gần đây
                  </span>
                  <span className="material-symbols-outlined text-amber-500 text-[18px]">hourglass_top</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface">
                  {data.recentActivity.items.length}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">Đang xử lý / cập nhật</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                    Tổng lịch sử
                  </span>
                  <span className="material-symbols-outlined text-primary text-[18px]">history</span>
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-headline text-on-surface">
                  {data.history.items.length}
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">Phòng đã sử dụng</p>
              </div>

              <div className="p-4 sm:p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-wider">
                    Tài khoản
                  </span>
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-headline text-emerald-700">
                  Hoạt động
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1">Không có vi phạm</p>
              </div>
            </div>
          )}

          {/* Unified High-End Filter Command Bar */}
          <section className="rounded-3xl bg-surface-container-lowest p-5 sm:p-6 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
              {/* Search input */}
              <div className="md:col-span-5">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  {t("bookings.search.keyword")}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/50">
                    search
                  </span>
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder={t("bookings.search.keywordPlaceholder")}
                    className="h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface pl-10 pr-9 text-xs sm:text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                  />
                  {keywordInput && (
                    <button
                      type="button"
                      onClick={() => setKeywordInput("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Date popover */}
              <div className="md:col-span-3">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  {t("bookings.search.bookingDate")}
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-expanded={isCalendarOpen}
                      className="relative flex h-11 w-full cursor-pointer items-center gap-2 rounded-2xl border border-outline-variant/40 bg-surface px-3.5 text-xs sm:text-sm transition-all hover:border-outline-variant focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 shadow-2xs"
                    >
                      <span className="material-symbols-outlined pointer-events-none text-[18px] text-on-surface-variant/50">
                        calendar_today
                      </span>
                      <span
                        className={cn(
                          "flex-1 truncate text-left",
                          bookingDate ? "text-on-surface font-semibold" : "text-on-surface-variant/50",
                        )}
                      >
                        {bookingDate
                          ? new Date(bookingDate + "T00:00:00").toLocaleDateString(
                              localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US",
                              { weekday: "short", month: "short", day: "numeric" },
                            )
                          : t("bookings.search.bookingDate")}
                      </span>
                      {bookingDate ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBookingDate("");
                            setPage(1);
                          }}
                          className="text-on-surface-variant/50 hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      ) : (
                        <span className="material-symbols-outlined pointer-events-none text-[18px] text-on-surface-variant/40">
                          expand_more
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingDate ? parseISO(bookingDate) : undefined}
                      onSelect={(d) => {
                        if (d) {
                          setBookingDate(format(d, "yyyy-MM-dd"));
                          setPage(1);
                          setIsCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Status Select */}
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                  {t("bookings.search.status")}
                </label>
                <Select
                  value={status ? String(status) : "any"}
                  onValueChange={(val) => {
                    setStatus(val === "any" ? "" : (val as BookingStatusApi));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-2xl border-outline-variant/40 text-xs sm:text-sm shadow-2xs">
                    <SelectValue placeholder={t("bookings.search.anyStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t("bookings.search.anyStatus")}</SelectItem>
                    <SelectItem value="PENDING">{t("bookings.search.statusOptions.pending")}</SelectItem>
                    <SelectItem value="APPROVED">{t("bookings.search.statusOptions.approved")}</SelectItem>
                    <SelectItem value="REJECTED">{t("bookings.search.statusOptions.rejected")}</SelectItem>
                    <SelectItem value="CANCELLED">{t("bookings.search.statusOptions.cancelled")}</SelectItem>
                    <SelectItem value="CHECKED_IN">{t("bookings.search.statusOptions.checkedIn")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Advanced toggle & Actions */}
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters((v) => !v)}
                  className={cn(
                    "h-11 flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl border text-xs font-bold transition-all shadow-2xs",
                    showAdvancedFilters || activeAdvancedFilterCount > 0
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container-low"
                  )}
                  title={t("bookings.search.moreFilters")}
                >
                  <span className="material-symbols-outlined text-[18px]">tune</span>
                  <span className="hidden sm:inline">Bộ lọc</span>
                  {activeAdvancedFilterCount > 0 && (
                    <span className="h-5 w-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">
                      {activeAdvancedFilterCount}
                    </span>
                  )}
                </button>

                {hasAnyFilter && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="h-11 px-3.5 rounded-2xl border border-outline-variant/40 bg-surface text-on-surface-variant hover:bg-surface-container-low text-xs font-bold transition-colors shadow-2xs"
                    title={t("bookings.search.reset")}
                  >
                    <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                  </button>
                )}
              </div>
            </div>

            {/* Smooth collapsible advanced filter bar */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-outline-variant/15 grid grid-cols-1 gap-4 md:grid-cols-12 animate-fadeIn">
                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    {t("bookings.search.timeSlotId")}
                  </label>
                  <input
                    inputMode="numeric"
                    value={timeSlotId}
                    onChange={(e) => {
                      setTimeSlotId(e.target.value.replace(/[^\d]/g, ""));
                      setPage(1);
                    }}
                    placeholder="Mã ca học (vd: 1, 2)"
                    className="h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface px-3.5 text-xs sm:text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    {t("bookings.search.attendees")}
                  </label>
                  <input
                    inputMode="numeric"
                    value={attendees}
                    onChange={(e) => {
                      setAttendees(e.target.value.replace(/[^\d]/g, ""));
                      setPage(1);
                    }}
                    placeholder="Số lượng người (vd: 10)"
                    className="h-11 w-full rounded-2xl border border-outline-variant/40 bg-surface px-3.5 text-xs sm:text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 shadow-2xs"
                  />
                </div>

                <div className="md:col-span-6">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                    {t("bookings.search.sort")}
                  </label>
                  <Select
                    value={sort}
                    onValueChange={(val) => {
                      setSort(val as BookingSortApi);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-11 rounded-2xl border-outline-variant/40 text-xs sm:text-sm shadow-2xs">
                      <SelectValue placeholder={t("bookings.search.sortNewest")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">{t("bookings.search.sortNewest")}</SelectItem>
                      <SelectItem value="booking_date_asc">{t("bookings.search.sortDateAsc")}</SelectItem>
                      <SelectItem value="booking_date_desc">{t("bookings.search.sortDateDesc")}</SelectItem>
                      <SelectItem value="status_asc">{t("bookings.search.sortStatusAsc")}</SelectItem>
                      <SelectItem value="status_desc">{t("bookings.search.sortStatusDesc")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="grid grid-cols-12 gap-6 animate-pulse">
            <div className="col-span-12 lg:col-span-8 h-80 rounded-3xl bg-surface-container-low" />
            <div className="col-span-12 lg:col-span-4 h-80 rounded-3xl bg-surface-container-low" />
            <div className="col-span-12 h-64 rounded-3xl bg-surface-container-low" />
          </div>
        ) : isError || !data ? (
          <div className="rounded-3xl border border-error-container bg-error-container/20 p-8 text-error text-center">
            <span className="material-symbols-outlined text-4xl mb-2">error</span>
            <p className="font-bold text-base">{t("bookings.error.loadFailed")}</p>
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-on-primary hover:opacity-90"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Recent Activity (Active & Pending Bookings) */}
            <RecentActivityCard
              className="col-span-12 lg:col-span-8 order-1"
              title={t("bookings.recentActivity.title")}
              downloadLabel={t("bookings.recentActivity.downloadReport")}
              emptyLabel={t("bookings.recentActivity.empty")}
              items={filteredRecentActivityItems}
              onOpenBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
              onCancelBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
            />

            {/* Active Reservoir Summary Card */}
            <ActiveReservoirCard
              className="col-span-12 lg:col-span-4 order-2"
              title={t("bookings.summary.title")}
              description={t("bookings.summary.description", {
                count: data.summary.reservedSlots,
              })}
              reservedSlots={data.summary.reservedSlots}
            />

            {/* History Grid (All Bookings) */}
            <div className="col-span-12 order-3 space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[18px]">history</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold font-headline text-on-surface">
                    Lịch sử & Đặt phòng đã hoàn tất
                  </h3>
                </div>
                <span className="text-xs font-semibold text-on-surface-variant">
                  {t("bookings.search.pageInfo", { page })}
                </span>
              </div>

              <BookingHistoryGrid
                items={data.history.items}
                ctaLabel={t("bookings.history.bookNew")}
                onOpenBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
                onCreateNew={() => navigate("/rooms")}
              />

              {/* Refined Modern Pagination */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-3xl bg-surface-container-lowest border border-outline-variant/15 shadow-2xs">
                <p className="text-xs text-on-surface-variant font-medium">
                  Hiển thị <span className="font-bold text-on-surface">{data.history.items.length}</span> kết quả (Trang {page})
                </p>
                <div className="flex items-center gap-2">
                  <div className="min-w-[130px]">
                    <Select
                      value={String(size)}
                      onValueChange={(val) => {
                        setSize(Number(val));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs rounded-xl border-outline-variant/40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50, 100].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {t("bookings.search.pageSize", { size: n })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || query.isFetching}
                    className="h-9 px-3 rounded-xl border border-outline-variant/40 bg-surface text-xs font-bold text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-low transition-colors inline-flex items-center gap-1 shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    <span>{t("bookings.search.prev")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={query.isFetching || (data?.history.items.length ?? 0) < size}
                    className="h-9 px-3 rounded-xl border border-outline-variant/40 bg-surface text-xs font-bold text-on-surface-variant disabled:opacity-40 hover:bg-surface-container-low transition-colors inline-flex items-center gap-1 shadow-2xs"
                  >
                    <span>{t("bookings.search.next")}</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

