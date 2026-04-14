import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { StatusChip } from "@shared/components/StatusChip";
import { cn } from "@shared/utils/cn";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { BookingTimeline } from "../components/BookingTimeline";

export interface BookingDetailPageProps {
  readonly className?: string;
}

export function BookingDetailPage({ className }: Readonly<BookingDetailPageProps>) {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();

  const { data, isLoading, isError, refetch } = useBookingDetail(bookingId ?? "");

  const chipStatus = useMemo(() => {
    if (!data) return null;
    if (data.status === "confirmed") return "confirmed" as const;
    if (data.status === "pending") return "pending" as const;
    if (data.status === "cancelled") return "cancelled" as const;
    return null;
  }, [data]);

  return (
    <AppLayout>
      <div className={cn("mx-auto max-w-5xl", className)}>
        {/* Loading / error */}
        {isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            Loading booking…
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            <p className="font-semibold">Unable to load booking details.</p>
            <p className="text-sm mt-1 text-on-surface-variant">
              The booking may not exist in mock data yet.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                Retry
              </button>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to My Bookings
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Status Card */}
              <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    {chipStatus ? (
                      <StatusChip
                        status={chipStatus}
                        className="px-3 py-1 text-xs font-bold tracking-wider uppercase"
                      />
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold tracking-wider rounded-full bg-surface-container-high text-on-surface-variant uppercase">
                        {data.status}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-on-surface tracking-tight leading-tight font-headline">
                      {data.title}
                    </h2>
                    <p className="text-xs text-on-surface-variant font-medium mt-1">
                      {data.bookingCode}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface-container-low rounded-xl text-primary">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-base font-medium text-on-surface">
                        {data.location.primary}
                      </p>
                      {data.location.secondary ? (
                        <p className="text-sm text-on-surface-variant">
                          {data.location.secondary}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-surface-container-low rounded-xl text-primary">
                      <span className="material-symbols-outlined">calendar_today</span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                        Date & Time
                      </p>
                      <p className="text-base font-medium text-on-surface">
                        {data.schedule.dateLabel}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {data.schedule.timeLabel}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Booking Purpose */}
              <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
                <h3 className="text-lg font-bold mb-4 text-on-surface font-headline">
                  Booking Purpose
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
                  {data.purpose}
                </p>
              </section>

              {/* Attendees (simple count only) */}
              <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-on-surface font-headline">
                    Attendees
                  </h3>
                  <span className="text-sm font-medium text-primary bg-primary-fixed px-2 py-1 rounded">
                    {data.attendeesCount} People
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  Attendee details are hidden in this version.
                </p>
              </section>

              {/* Timeline */}
              <BookingTimeline title="Booking History" events={data.timeline} />
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Map / Location Visual */}
              <section className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
                <div className="h-48 w-full bg-surface-container-high">
                  <img
                    alt="Map of location"
                    className="w-full h-full object-cover"
                    src={data.map.imageUrl}
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-sm font-bold text-on-surface mb-1 font-headline">
                    {data.map.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {data.map.description}
                  </p>
                  <button
                    type="button"
                    className="mt-4 w-full py-2 px-4 bg-surface-container-low hover:bg-surface-container-high text-primary text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">directions</span>
                    {data.map.ctaLabel}
                  </button>
                </div>
              </section>

              {/* Actions */}
              <section className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
                <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-widest font-headline">
                  Actions
                </h3>
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">event</span>
                    {data.actions.addToCalendarLabel}
                  </button>
                  <button
                    type="button"
                    className="w-full h-12 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">support_agent</span>
                    {data.actions.contactSupportLabel}
                  </button>

                  <div className="pt-4 mt-4 border-t border-outline-variant/10">
                    <button
                      type="button"
                      disabled={!data.canCancel}
                      className={cn(
                        "w-full h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2",
                        data.canCancel
                          ? "text-error hover:bg-error-container/10"
                          : "text-on-surface-variant/50 cursor-not-allowed"
                      )}
                    >
                      <span className="material-symbols-outlined">cancel</span>
                      {data.actions.cancelLabel}
                    </button>
                    <p className="text-[10px] text-on-surface-variant text-center mt-2 px-4 leading-normal">
                      {data.actions.cancelHint}
                    </p>
                  </div>
                </div>
              </section>

              {/* Pro-tip */}
              {data.proTip ? (
                <section className="bg-primary-container p-6 rounded-2xl text-on-primary-container">
                  <h3 className="text-sm font-bold mb-2 flex items-center gap-2 font-headline">
                    <span className="material-symbols-outlined text-lg">info</span>
                    {data.proTip.title}
                  </h3>
                  <p className="text-xs leading-relaxed opacity-90">
                    {data.proTip.message}
                  </p>
                </section>
              ) : null}

              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to My Bookings
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

