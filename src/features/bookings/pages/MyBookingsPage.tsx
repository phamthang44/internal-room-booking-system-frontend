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

  return (
    <AppLayout>
      <div className={cn("mx-auto max-w-6xl", className)}>
        {/* Header Section */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
                {header.title}
              </h2>
              <p className="text-on-surface-variant max-w-lg">{header.subtitle}</p>
            </div>
            <BookingStatusTabs value={filter} onChange={setFilter} />
          </div>

          {/* Search / Filters */}
          <section className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.keyword")}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant/50">
                    search
                  </span>
                  <input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder={t("bookings.search.keywordPlaceholder")}
                    className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface pl-10 pr-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.bookingDate")}
                </label>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <div
                      role="button"
                      aria-expanded={isCalendarOpen}
                      className="relative flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm transition-all hover:border-outline-variant focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 data-[state=open]:border-primary/50 data-[state=open]:ring-2 data-[state=open]:ring-primary/10"
                    >
                      <span className="material-symbols-outlined pointer-events-none text-[18px] text-on-surface-variant/50">
                        calendar_today
                      </span>
                      <span
                        className={cn(
                          "flex-1 truncate",
                          bookingDate ? "text-on-surface" : "text-on-surface-variant/40",
                        )}
                      >
                        {bookingDate
                          ? new Date(bookingDate + "T00:00:00").toLocaleDateString(
                              localStorage.getItem("language") === "vi" ? "vi-VN" : "en-US",
                              { weekday: "short", month: "short", day: "numeric" },
                            )
                          : t("bookings.search.bookingDate")}
                      </span>
                      <span
                        className="material-symbols-outlined pointer-events-none text-[18px] text-on-surface-variant/40 transition-transform duration-200"
                        style={{
                          transform: isCalendarOpen ? "rotate(180deg)" : "none",
                        }}
                      >
                        expand_more
                      </span>
                    </div>
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
                    {bookingDate ? (
                      <div className="border-t border-outline-variant/20 p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingDate("");
                            setPage(1);
                            setIsCalendarOpen(false);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                          {t("bookings.search.reset")}
                        </button>
                      </div>
                    ) : null}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.status")}
                </label>
                <Select
                  value={status ? String(status) : "any"}
                  onValueChange={(val) => {
                    setStatus(val === "any" ? "" : (val as BookingStatusApi));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={t("bookings.search.anyStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">{t("bookings.search.anyStatus")}</SelectItem>
                    <SelectItem value="PENDING">PENDING</SelectItem>
                    <SelectItem value="APPROVED">APPROVED</SelectItem>
                    <SelectItem value="REJECTED">REJECTED</SelectItem>
                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    <SelectItem value="CHECKED_IN">CHECKED_IN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-1">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.timeSlotId")}
                </label>
                <input
                  inputMode="numeric"
                  value={timeSlotId}
                  onChange={(e) => {
                    setTimeSlotId(e.target.value.replace(/[^\d]/g, ""));
                    setPage(1);
                  }}
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="md:col-span-1">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.attendees")}
                </label>
                <input
                  inputMode="numeric"
                  value={attendees}
                  onChange={(e) => {
                    setAttendees(e.target.value.replace(/[^\d]/g, ""));
                    setPage(1);
                  }}
                  placeholder="0"
                  className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-widest text-on-surface-variant/60">
                  {t("bookings.search.sort")}
                </label>
                <Select
                  value={sort}
                  onValueChange={(val) => {
                    setSort(val as BookingSortApi);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-11">
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

              <div className="md:col-span-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => void query.refetch()}
                  className="h-11 flex-1 rounded-xl bg-primary text-on-primary text-sm font-bold transition-colors hover:opacity-95 disabled:opacity-60"
                  disabled={query.isFetching}
                >
                  {query.isFetching ? t("bookings.search.searching") : t("bookings.search.search")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setKeywordInput("");
                    setKeyword("");
                    setBookingDate("");
                    setStatus("");
                    setTimeSlotId("");
                    setAttendees("");
                    setSort("newest");
                    setPage(1);
                    setSize(DEFAULT_PAGE_SIZE);
                  }}
                  className="h-11 rounded-xl border border-outline-variant/40 bg-surface px-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                >
                  {t("bookings.search.reset")}
                </button>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-on-surface-variant">
                {t("bookings.search.pageInfo", { page })}
              </p>
              <div className="flex items-center gap-2">
                <div className="min-w-[140px]">
                  <Select
                    value={String(size)}
                    onValueChange={(val) => {
                      setSize(Number(val));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 text-xs">
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
                  className="h-9 rounded-xl border border-outline-variant/40 bg-surface px-3 text-xs font-bold text-on-surface-variant disabled:opacity-50"
                >
                  {t("bookings.search.prev")}
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={query.isFetching || (data?.history.items.length ?? 0) < size}
                  className="h-9 rounded-xl border border-outline-variant/40 bg-surface px-3 text-xs font-bold text-on-surface-variant disabled:opacity-50"
                >
                  {t("bookings.search.next")}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* States (API-ready) */}
        {isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            {t("bookings.loading")}
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            {t("bookings.error.loadFailed")}
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Summary Stats (Top Row Asymmetric) */}
            <ActiveReservoirCard
              className="col-span-12 lg:col-span-4"
              title={t("bookings.summary.title")}
              description={t("bookings.summary.description", {
                count: data.summary.reservedSlots,
              })}
              reservedSlots={data.summary.reservedSlots}
            />

            <RecentActivityCard
              className="col-span-12 lg:col-span-8"
              title={t("bookings.recentActivity.title")}
              downloadLabel={t("bookings.recentActivity.downloadReport")}
              emptyLabel={t("bookings.recentActivity.empty")}
              items={filteredRecentActivityItems}
              onOpenBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
              onCancelBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
              onDownloadReport={() => {
                // mock action: later can export CSV/pdf
              }}
            />

            {/* Booking History Grid (Bottom Row) */}
            <div className="col-span-12">
              <BookingHistoryGrid
                items={data.history.items}
                ctaLabel={t("bookings.history.bookNew")}
                onOpenBooking={(bookingId) => navigate(`/bookings/${bookingId}`)}
                onCreateNew={() => navigate("/rooms")}
              />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

