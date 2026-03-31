import { useI18n } from "@shared/i18n/useI18n";
import { StatusChip } from "@shared/components/StatusChip";
import { SkeletonBlock } from "@shared/components/SkeletonBlock";
import type { UpcomingBooking } from "../types/dashboard.types";

const formatDate = (
  iso: string,
  startTime: string,
  endTime: string,
  todayLabel: string,
  locale: string
): string => {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const label = isToday
    ? todayLabel
    : date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return `${label}, ${startTime} – ${endTime}`;
};

interface BookingListItemProps {
  booking: UpcomingBooking;
  todayLabel: string;
  locale: string;
}

export const BookingListItem = ({
  booking,
  todayLabel,
  locale,
}: BookingListItemProps) => (
  <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest px-4 py-3.5 shadow-[0_1px_6px_rgba(24,28,30,0.05)] transition-shadow hover:shadow-[0_2px_12px_rgba(24,28,30,0.08)]">
    <div className="h-full w-0.5 self-stretch rounded-full bg-gradient-to-b from-primary to-primary-container" />

    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className="truncate font-headline text-sm font-semibold text-on-surface">
        {booking.title}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">meeting_room</span>
          {booking.roomName}
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">schedule</span>
          {formatDate(booking.date, booking.startTime, booking.endTime, todayLabel, locale)}
        </span>
      </div>
    </div>

    <StatusChip status={booking.status} />
  </div>
);

const ItemSkeleton = () => (
  <div className="flex items-center gap-4 rounded-xl bg-surface-container-lowest px-4 py-3.5">
    <SkeletonBlock className="h-12 w-0.5 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
    <SkeletonBlock className="h-5 w-20 rounded-full" />
  </div>
);

interface UpcomingBookingsSectionProps {
  bookings?: UpcomingBooking[];
  isLoading: boolean;
  error: Error | null;
}

export const UpcomingBookingsSection = ({
  bookings,
  isLoading,
  error,
}: UpcomingBookingsSectionProps) => {
  const { t, language } = useI18n();
  const locale = language === "vi" ? "vi-VN" : "en-US";

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-headline text-lg font-semibold text-on-surface">
          {t("dashboard.upcomingBookings.title")}
        </h2>
        <a
          href="/bookings"
          className="text-sm font-medium text-primary hover:underline"
        >
          {t("dashboard.upcomingBookings.viewAll")}
        </a>
      </div>

      <div className="space-y-2.5">
        {isLoading ? (
          <>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </>
        ) : error ? (
          <div className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
            {t("dashboard.upcomingBookings.loadError")}
          </div>
        ) : bookings?.length ? (
          bookings.map((b) => (
            <BookingListItem
              key={b.id}
              booking={b}
              todayLabel={t("dashboard.upcomingBookings.today")}
              locale={locale}
            />
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-lowest py-10 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">
              event_busy
            </span>
            <p className="text-sm font-medium text-on-surface-variant">
              {t("dashboard.upcomingBookings.empty")}
            </p>
            <a
              href="/rooms"
              className="mt-1 text-sm font-semibold text-primary hover:underline"
            >
              {t("dashboard.upcomingBookings.browseRooms")}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
