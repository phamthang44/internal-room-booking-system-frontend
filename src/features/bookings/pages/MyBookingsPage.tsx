import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useMyBookings, type MyBookingsFilter } from "../hooks/useMyBookings";
import { BookingStatusTabs } from "../components/BookingStatusTabs";
import { ActiveReservoirCard } from "../components/ActiveReservoirCard";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { BookingHistoryGrid } from "../components/BookingHistoryGrid";

export interface MyBookingsPageProps {
  readonly className?: string;
}

export function MyBookingsPage({ className }: Readonly<MyBookingsPageProps>) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MyBookingsFilter>("all");
  const { data, isLoading, isError, filteredRecentActivityItems } = useMyBookings(filter);

  const header = useMemo(() => {
    return {
      title: "My Bookings",
      subtitle:
        "Manage your current reservations and review your academic activity history in the Scholarly Sanctuary.",
    };
  }, []);

  return (
    <AppLayout>
      <div className={cn("mx-auto max-w-6xl", className)}>
        {/* Header Section */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:justify-between md:items-end">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
              {header.title}
            </h2>
            <p className="text-on-surface-variant max-w-lg">{header.subtitle}</p>
          </div>
          <BookingStatusTabs value={filter} onChange={setFilter} />
        </div>

        {/* States (API-ready) */}
        {isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            Loading bookings…
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            Unable to load bookings. Please try again.
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Summary Stats (Top Row Asymmetric) */}
            <ActiveReservoirCard
              className="col-span-12 lg:col-span-4"
              title={data.summary.title}
              description={data.summary.description}
              reservedSlots={data.summary.reservedSlots}
            />

            <RecentActivityCard
              className="col-span-12 lg:col-span-8"
              title={data.recentActivity.title}
              downloadLabel={data.recentActivity.downloadLabel}
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
                ctaLabel={data.history.cta.label}
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

