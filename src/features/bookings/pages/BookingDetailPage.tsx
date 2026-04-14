import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { myBookingsMockData } from "@/data/mockData";

export interface BookingDetailPageProps {
  readonly className?: string;
}

export function BookingDetailPage({ className }: Readonly<BookingDetailPageProps>) {
  const navigate = useNavigate();
  const { bookingId } = useParams<{ bookingId: string }>();

  const booking = useMemo(() => {
    if (!bookingId) return null;
    const activity =
      myBookingsMockData.recentActivity.items.find((b) => b.id === bookingId) ??
      null;
    if (activity) return { kind: "activity" as const, activity };

    const history =
      myBookingsMockData.history.items.find((b) => b.id === bookingId) ?? null;
    if (history) return { kind: "history" as const, history };

    return null;
  }, [bookingId]);

  return (
    <AppLayout>
      <div className={["mx-auto max-w-4xl", className].filter(Boolean).join(" ")}>
        <div className="mb-6">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-on-surface">
            Booking Details
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Review your booking information and status.
          </p>
        </div>

        {!booking ? (
          <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6">
            <p className="text-on-surface font-medium">Booking not found.</p>
            <p className="text-on-surface-variant text-sm mt-1">
              The booking ID may be invalid, or this booking is not available in mock
              data.
            </p>
            <button
              type="button"
              onClick={() => navigate("/bookings")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to My Bookings
            </button>
          </div>
        ) : booking.kind === "activity" ? (
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-on-surface-variant">Room</p>
                <p className="text-lg font-semibold text-on-surface truncate">
                  {booking.activity.roomCode} — {booking.activity.roomName}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {booking.activity.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-xs text-on-surface-variant">Date</p>
                <p className="mt-1 text-sm font-semibold text-on-surface">
                  {booking.activity.dateLabel}
                </p>
              </div>
              <div className="rounded-2xl bg-surface-container-low p-4">
                <p className="text-xs text-on-surface-variant">Time</p>
                <p className="mt-1 text-sm font-semibold text-on-surface">
                  {booking.activity.time.startTime} - {booking.activity.time.endTime}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/rooms")}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                Browse Rooms
              </button>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Back to My Bookings
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-on-surface-variant">Booking</p>
                <p className="text-lg font-semibold text-on-surface truncate">
                  {booking.history.roomLabel}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {booking.history.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 rounded-2xl bg-surface-container-low p-4">
              <p className="text-xs text-on-surface-variant">When</p>
              <p className="mt-1 text-sm font-semibold text-on-surface">
                {booking.history.dateTimeLabel}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigate("/rooms")}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                Browse Rooms
              </button>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-95 transition-all"
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

