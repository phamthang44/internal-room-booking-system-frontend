import { useEffect, useMemo, useRef, useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useApprovalsUi } from "@/hooks/useApprovalsUi";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApprovalsTabs } from "../components/ApprovalsTabs";
import { ApprovalsTable } from "../components/ApprovalsTable";
import { BulkActionBar } from "../components/BulkActionBar";
import { RejectReasonDialog } from "../components/RejectReasonDialog";
import { useAdminApprovalsListQuery, useApproveBookingMutation, useRejectBookingMutation } from "../hooks/useAdminApprovalsQueries";
import { adaptApprovalsRow } from "../utils/adaptApprovalsRow";
import { useAdminBookingDetailDisclosure } from "../hooks/useAdminBookingDetailDisclosure";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@shared/i18n/useI18n";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/components/ui/popover";
import { Calendar } from "@shared/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { format, parseISO } from "date-fns";

export const AdminApprovalsPage = () => {
  const ui = useApprovalsUi();
  const disclosure = useAdminBookingDetailDisclosure(140);
  const [hoverAnchor, setHoverAnchor] = useState<DOMRect | null>(null);
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useI18n();
  const closeTimerRef = useRef<number | null>(null);

  const [bookingIdInput, setBookingIdInput] = useState("");
  const [studentCodeInput, setStudentCodeInput] = useState("");
  const [classroomIdInput, setClassroomIdInput] = useState("");
  const [bookingDateInput, setBookingDateInput] = useState("");

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (bookingIdInput.trim()) count += 1;
    if (studentCodeInput.trim()) count += 1;
    if (classroomIdInput.trim()) count += 1;
    if (bookingDateInput.trim()) count += 1;
    return count;
  }, [bookingDateInput, bookingIdInput, classroomIdInput, studentCodeInput]);

  const debouncedBookingId = useDebouncedValue(bookingIdInput, 250);
  const debouncedStudentCode = useDebouncedValue(studentCodeInput, 250);
  const debouncedClassroomId = useDebouncedValue(classroomIdInput, 250);
  const debouncedBookingDate = useDebouncedValue(bookingDateInput, 250);

  const parsedBookingId = Number(debouncedBookingId);
  const bookingId = Number.isFinite(parsedBookingId) && parsedBookingId > 0 ? parsedBookingId : undefined;
  const parsedClassroomId = Number(debouncedClassroomId);
  const classroomId = Number.isFinite(parsedClassroomId) && parsedClassroomId > 0 ? parsedClassroomId : undefined;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current != null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, []);

  const statusParam = ui.tab === "HISTORY" ? undefined : ui.tab;

  const listQuery = useAdminApprovalsListQuery({
    status: statusParam,
    bookingId,
    studentCode: debouncedStudentCode.trim() || undefined,
    classroomId,
    bookingDate: debouncedBookingDate.trim() || undefined,
    page: ui.page,
    size: ui.size,
    sort: "NEWEST",
  });

  const approveMutation = useApproveBookingMutation();
  const rejectMutation = useRejectBookingMutation();

  const rows = useMemo(
    () => (listQuery.data?.rows ?? []).map(adaptApprovalsRow),
    [listQuery.data?.rows],
  );

  const counts = listQuery.data?.counts;
  const meta = listQuery.data?.meta;

  const isBusy = approveMutation.isPending || rejectMutation.isPending;

  const currentIds = rows.map((r) => r.bookingId).filter((id) => id > 0);

  const bookingStatusById = useMemo(() => {
    const map = new Map<number, string>();
    for (const r of rows) {
      map.set(r.bookingId, r.bookingStatus?.toString?.().toUpperCase?.() ?? "PENDING");
    }
    return map;
  }, [rows]);

  const isPendingBooking = (id: number) => bookingStatusById.get(id) === "PENDING";

  const approveOne = (bookingId: number) => {
    if (!isPendingBooking(bookingId)) return;
    approveMutation.mutate({ bookingId });
  };

  const openReject = (bookingId: number) => {
    if (!isPendingBooking(bookingId)) return;
    ui.openRejectDialog(bookingId);
  };

  const approveSelected = () => {
    const ids = Array.from(ui.selectedIds).filter(isPendingBooking);
    if (ids.length === 0) return;
    approveMutation.mutate({ bulkIds: ids });
  };

  const rejectSelected = () => {
    const ids = Array.from(ui.selectedIds).filter(isPendingBooking);
    if (ids.length === 0) return;
    ui.openBulkRejectDialog(ids);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              {t("approvals.title")}
            </h1>
            <p className="mt-1 text-on-surface-variant">
              {t("approvals.subtitle")}
            </p>
          </div>
          <ApprovalsTabs active={ui.tab} onChange={ui.setTab} counts={counts} />
        </header>

        {/* Search + Filters */}
        <div className="rounded-2xl bg-surface-container-low p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                search
              </span>
              <input
                className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
                placeholder={t("approvals.filters.studentCodePlaceholder")}
                value={studentCodeInput}
                onChange={(e) => {
                  setStudentCodeInput(e.target.value);
                  ui.setPage(1);
                }}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                onClick={() => setFiltersOpen((v) => !v)}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                {t("approvals.filters.more")}
                {activeFilterCount > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                onClick={() => {
                  setBookingIdInput("");
                  setStudentCodeInput("");
                  setClassroomIdInput("");
                  setBookingDateInput("");
                  ui.setPage(1);
                }}
                disabled={activeFilterCount === 0}
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                {t("approvals.filters.reset")}
              </button>
            </div>
          </div>

          {filtersOpen ? (
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  tag
                </span>
                <input
                  className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
                  placeholder={t("approvals.filters.bookingIdPlaceholder")}
                  value={bookingIdInput}
                  inputMode="numeric"
                  onChange={(e) => {
                    setBookingIdInput(e.target.value);
                    ui.setPage(1);
                  }}
                />
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  meeting_room
                </span>
                <input
                  className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-4 text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
                  placeholder={t("approvals.filters.classroomIdPlaceholder")}
                  value={classroomIdInput}
                  inputMode="numeric"
                  onChange={(e) => {
                    setClassroomIdInput(e.target.value);
                    ui.setPage(1);
                  }}
                />
              </div>

              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                  event
                </span>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full rounded-xl bg-surface-container-lowest py-3 pl-12 pr-10 text-left text-sm outline-none ring-0 placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/20"
                    >
                      <span
                        className={cn(
                          bookingDateInput.trim()
                            ? "text-on-surface"
                            : "text-on-surface-variant/50",
                        )}
                      >
                        {bookingDateInput.trim()
                          ? bookingDateInput.trim()
                          : t("approvals.filters.bookingDatePlaceholder")}
                      </span>
                    </button>
                  </PopoverTrigger>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60">
                    <span className="material-symbols-outlined text-[18px]">
                      calendar_today
                    </span>
                  </span>

                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 border-b border-outline-variant/20 bg-surface">
                      <input
                        value={bookingDateInput}
                        onChange={(e) => {
                          setBookingDateInput(e.target.value);
                          ui.setPage(1);
                        }}
                        placeholder="YYYY-MM-DD"
                        className="h-10 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                      />
                    </div>
                    <Calendar
                      mode="single"
                      selected={
                        bookingDateInput.trim()
                          ? parseISO(bookingDateInput.trim())
                          : undefined
                      }
                      onSelect={(d) => {
                        if (d) {
                          setBookingDateInput(format(d, "yyyy-MM-dd"));
                          ui.setPage(1);
                          setIsCalendarOpen(false);
                        }
                      }}
                      initialFocus
                    />
                    {bookingDateInput.trim() ? (
                      <div className="border-t border-outline-variant/20 p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingDateInput("");
                            ui.setPage(1);
                            setIsCalendarOpen(false);
                          }}
                          className="w-full rounded-lg px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
                        >
                          {t("approvals.filters.reset")}
                        </button>
                      </div>
                    ) : null}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ) : null}
        </div>

        {listQuery.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("approvals.errors.loadFailed")}
          </div>
        ) : null}

        <div className={cn(isBusy && "opacity-70 pointer-events-none")}>
          <ApprovalsTable
            rows={rows}
            selectedIds={ui.selectedIds}
            onToggleSelected={ui.toggleSelected}
            onToggleAll={(ids, selected) => ui.setAllSelected(ids, selected)}
            onApprove={approveOne}
            onReject={openReject}
            onHoverBooking={(id, rect) => {
              // If the user moves from row -> preview, keep preview open.
              if (closeTimerRef.current != null) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
              }

              if (id == null) {
                if (isPreviewHovered) return;
                // Small delay to tolerate tiny cursor gaps row -> preview.
                closeTimerRef.current = window.setTimeout(() => {
                  disclosure.setHoveredId(null);
                  setHoverAnchor(null);
                  closeTimerRef.current = null;
                }, 140);
                return;
              }

              disclosure.setHoveredId(id);
              setHoverAnchor(rect);
            }}
            onOpenDetail={(id) => navigate(`/admin/bookings/${id}`)}
          />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl bg-surface-container-low px-6 py-4">
          <div className="flex items-center gap-4">
            <p className="text-xs font-medium text-on-surface-variant">
              {t("approvals.pagination.showing")} <span className="font-bold text-on-surface">{currentIds.length}</span> {t("approvals.pagination.results")}
              {meta?.totalElements != null ? (
                <> {t("approvals.pagination.of")} <span className="font-bold text-on-surface">{meta.totalElements}</span></>
              ) : null}
            </p>
            <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />
            <div className="flex items-center gap-2 text-xs text-on-surface-variant">
              <span>{t("approvals.pagination.perPage")}</span>
              <Select
                value={ui.size.toString()}
                onValueChange={(val) => {
                  ui.setSize(Number(val));
                  ui.setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-20 rounded-lg border-outline-variant/30 bg-surface-container-lowest px-2 py-1 text-xs text-on-surface focus:border-primary/50 focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[12, 24, 48, 96].map((s) => (
                    <SelectItem key={s} value={s.toString()} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => ui.setPage(ui.page - 1)}
              disabled={ui.page <= 1}
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="min-w-[40px] text-center text-xs font-bold text-on-surface">
              {ui.page} {meta?.totalPages ? `/ ${meta.totalPages}` : ""}
            </span>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container-lowest text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50 disabled:pointer-events-none"
              onClick={() => ui.setPage(ui.page + 1)}
              disabled={meta?.hasNextPage === false || (meta?.totalPages != null && ui.page >= meta.totalPages) || currentIds.length === 0}
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <BulkActionBar
        selectedCount={ui.selectedCount}
        onApprove={approveSelected}
        onReject={rejectSelected}
        onClear={ui.clearSelection}
        disabled={isBusy}
      />

      <RejectReasonDialog
        open={ui.rejectDialog.open}
        disabled={isBusy}
        onClose={ui.closeRejectDialog}
        onConfirm={async (reason) => {
          const singleId = ui.rejectDialog.bookingId;
          const bulkIds = ui.rejectDialog.bulkIds;
          ui.closeRejectDialog();
          if (singleId != null) {
            if (!isPendingBooking(singleId)) return;
            rejectMutation.mutate({ bookingId: singleId, reason });
            return;
          }
          if (bulkIds && bulkIds.length > 0) {
            const pendingIds = bulkIds.filter(isPendingBooking);
            if (pendingIds.length === 0) return;
            rejectMutation.mutate({ bulkIds: pendingIds, reason });
          }
        }}
      />

      {/* Progressive disclosure preview layer (rendered outside the table) */}
      <AnimatePresence>
        {disclosure.debouncedHoveredId && hoverAnchor ? (
          <motion.div
            key={disclosure.debouncedHoveredId}
            className="fixed z-[70]"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.6 }}
            style={{
              left: Math.min(
                window.innerWidth - 340,
                Math.max(16, hoverAnchor.left),
              ),
              top: Math.min(
                window.innerHeight - 220,
                Math.max(16, hoverAnchor.top - 12),
              ),
            }}
            onMouseEnter={() => {
              if (closeTimerRef.current != null) {
                window.clearTimeout(closeTimerRef.current);
                closeTimerRef.current = null;
              }
              setIsPreviewHovered(true);
            }}
            onMouseLeave={() => {
              setIsPreviewHovered(false);
              disclosure.setHoveredId(null);
              setHoverAnchor(null);
            }}
          >
            <div className="w-[320px] rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-4 shadow-xl">
              {disclosure.previewQuery.isFetching ? (
                <p className="text-xs font-semibold text-on-surface-variant">
                  {t("approvals.preview.loading")}
                </p>
              ) : disclosure.previewQuery.isError ? (
                <p className="text-xs font-semibold text-error">{t("approvals.preview.loadFailed")}</p>
              ) : disclosure.previewQuery.data ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate">
                        {disclosure.previewQuery.data.adminClassroom.roomName}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {disclosure.previewQuery.data.bookingDate} •{" "}
                        {disclosure.previewQuery.data.timeSlots?.[0]?.startTime?.slice(0, 5)} -{" "}
                        {disclosure.previewQuery.data.timeSlots?.[0]?.endTime?.slice(0, 5)}
                      </p>
                    </div>
                    <span className="rounded-full bg-secondary-container px-2.5 py-0.5 text-[10px] font-bold text-on-secondary-fixed-variant">
                      {disclosure.previewQuery.data.adminClassroom.requestedAttendees}/
                      {disclosure.previewQuery.data.adminClassroom.capacity}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-3">
                    {disclosure.previewQuery.data.purpose}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-[10px] text-on-surface-variant">
                      User: {disclosure.previewQuery.data.user.username}
                    </p>
                    <Link
                      to={`/admin/bookings/${disclosure.debouncedHoveredId}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      {t("approvals.preview.viewDetails")}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AppLayout>
  );
};

