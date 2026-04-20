import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@shared/components/AppLayout";
import { adminBookingsApiService } from "@features/adminBookings";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";

export const AdminBookingDetailPage = () => {
  const params = useParams();
  const bookingId = useMemo(() => Number(params.bookingId), [params.bookingId]);
  const enabled = Number.isFinite(bookingId) && bookingId > 0;
  const { t } = useI18n();

  const query = useQuery({
    queryKey: ["admin", "bookings", "detail", bookingId],
    queryFn: () => adminBookingsApiService.getDetail(bookingId),
    enabled,
    staleTime: 1000 * 30,
  });

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {!enabled ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-6 text-error">
            {t("adminBookings.detail.invalidId")}
          </div>
        ) : query.isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
            <p className="text-sm font-semibold text-on-surface-variant">
              {t("adminBookings.detail.loading")}
            </p>
          </div>
        ) : query.isError ? (
          <div className="rounded-2xl border border-error/30 bg-error-container/20 p-6 text-error">
            {t("adminBookings.detail.loadFailed")}
          </div>
        ) : !query.data ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 text-on-surface-variant">
            {t("adminBookings.detail.empty")}
          </div>
        ) : (
          <>
            <header className="flex flex-col gap-1">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminBookings.detail.header.bookingId", { id: query.data.id })}
              </p>
              <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
                {query.data.adminClassroom.roomName}
              </h1>
              <p className="text-sm text-on-surface-variant">
                {query.data.bookingDate}
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("adminBookings.detail.sections.purpose")}
                </p>
                <p className="mt-2 text-sm text-on-surface">{query.data.purpose}</p>
              </div>

              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("adminBookings.detail.sections.roomLoad")}
                </p>
                <p className="mt-2 text-2xl font-extrabold text-primary">
                  {query.data.adminClassroom.requestedAttendees}/
                  {query.data.adminClassroom.capacity}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {t("adminBookings.detail.actualAttendees", {
                    count: query.data.adminClassroom.actualAttendees,
                  })}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminBookings.detail.sections.timeSlots")}
              </p>
              <div className="mt-3 space-y-2">
                {query.data.timeSlots.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-on-surface">
                        {s.slotName}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {s.startTime.slice(0, 5)} - {s.endTime.slice(0, 5)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                      #{s.id}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminBookings.detail.sections.audit")}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminBookings.detail.audit.created")}
                  </p>
                  <p className="mt-1 text-sm text-on-surface">
                    {query.data.audit.createdAt}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {t("adminBookings.detail.audit.by", { name: query.data.audit.createdBy })}
                  </p>
                </div>
                <div className="rounded-xl bg-surface-container-low p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    {t("adminBookings.detail.audit.updated")}
                  </p>
                  <p className="mt-1 text-sm text-on-surface">
                    {query.data.audit.updatedAt}
                  </p>
                  <p className="mt-1 text-xs text-on-surface-variant">
                    {t("adminBookings.detail.audit.by", { name: query.data.audit.updatedBy })}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("adminBookings.detail.sections.user")}
              </p>
              <div className="mt-3 rounded-xl bg-surface-container-low p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-on-surface">
                    {query.data.user.username}
                  </p>
                  {query.data.user.status ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        query.data.user.status === "AVAILABLE" ||
                          query.data.user.status === "ACTIVE"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : "bg-surface-container-high text-on-surface-variant",
                      )}
                    >
                      {t(
                        `adminBookings.userStatus.${query.data.user.status}` as
                          | "adminBookings.userStatus.AVAILABLE"
                          | "adminBookings.userStatus.ACTIVE",
                      )}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-on-surface-variant">{query.data.user.email}</p>
                <p className="mt-2 text-xs text-on-surface-variant">
                  {t("adminBookings.detail.studentCode", { code: query.data.user.studentCode })}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

