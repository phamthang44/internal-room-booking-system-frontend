import { useI18n } from "@shared/i18n/useI18n";
import type { UpcomingBookingItem } from "../../api/student-dashboard.api";
import { RoomIdentifier } from "@shared/components/RoomIdentifier";
import { formatDisplayDate } from "@shared/utils/date";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApiService } from "@features/bookings/api/bookings.api.service";
import { normalizeApiError } from "@shared/errors/normalizeApiError";

interface UpcomingListProps {
  upcomingList?: UpcomingBookingItem[];
}

export const UpcomingList = ({ upcomingList }: UpcomingListProps) => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const checkoutMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      return await bookingsApiService.checkoutBooking(bookingId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  if (!upcomingList || upcomingList.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {t("dashboard.upcomingBookings.title")}
          </h3>
        </div>
        <div className="bg-surface-container-lowest rounded-3xl p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 block mb-4">
            event_busy
          </span>
          <p className="text-on-surface-variant font-body">
            {t("dashboard.upcomingBookings.empty")}
          </p>
          <p className="text-sm text-on-surface-variant/70 mt-1">
            {t("dashboard.upcomingBookings.createNew")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <h3 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
          {t("dashboard.upcomingBookings.title")}
        </h3>
        <div className="flex gap-2">
          <button className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined" data-icon="filter_list">
              filter_list
            </span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {upcomingList.map((booking) => {
            const { statusClass, statusLabel } = getStatusStyle(booking.status, t);
            const iconConfig = getIconConfig(booking.status);
            const dateLabel = formatDisplayDate(booking.bookingDate, t, language);
            const statusUpper = (booking.status ?? "").toUpperCase();
            const canCheckIn = statusUpper === "APPROVED" || statusUpper === "CONFIRMED";
            // With checkout support, CHECKED_IN is only actionable for checkout while still in-use.
            // If backend starts returning checkoutTime in summary later, we can refine this.
            const canCheckout = statusUpper === "CHECKED_IN";

            return (
              <div
                key={booking.bookingId}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${iconConfig.bgClass}`}
                  >
                    <span
                      className="material-symbols-outlined"
                      data-icon={iconConfig.icon}
                    >
                      {iconConfig.icon}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-bold font-body text-on-surface">
                      {booking.title || `Booking #${booking.bookingId}`}
                    </h5>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <RoomIdentifier
                        name={
                          booking.classroomName || t("common.placeholders.tbd")
                        }
                        className="text-xs text-on-surface-variant font-body"
                        iconClassName="!text-[14px]"
                      />
                      {booking.buildingName && (
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 font-body ml-[-8px]">
                          - {booking.buildingName}
                        </p>
                      )}
                      <p className="text-xs text-on-surface-variant flex items-center gap-1 font-body">
                        <span
                          className="material-symbols-outlined text-[14px]"
                          data-icon="schedule"
                        >
                          schedule
                        </span>
                        {dateLabel}, {booking.timeSlotRange}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-6">
                  {canCheckIn ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/bookings/${booking.bookingId}/checkin`)}
                      className="hidden md:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-on-primary hover:opacity-90 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {t("bookings.checkin.actions.primary")}
                    </button>
                  ) : null}

                  {canCheckout ? (
                    <button
                      type="button"
                      disabled={checkoutMutation.isPending}
                      onClick={() => {
                        const id = Number(booking.bookingId);
                        if (!Number.isFinite(id)) return;
                        void checkoutMutation.mutateAsync(id).catch(() => undefined);
                      }}
                      className="hidden md:inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      title={
                        checkoutMutation.isError
                          ? normalizeApiError(checkoutMutation.error).message
                          : undefined
                      }
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {checkoutMutation.isPending ? "progress_activity" : "logout"}
                      </span>
                      {t("bookings.checkout.actions.primary")}
                    </button>
                  ) : null}

                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                  <button className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors">
                    <span
                      className="material-symbols-outlined"
                      data-icon="more_vert"
                    >
                      more_vert
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Helper Functions
function getStatusStyle(status: string, t: any) {
  const statusUpper = status.toUpperCase();

  if (statusUpper === "APPROVED" || statusUpper === "CONFIRMED") {
    return {
      statusClass: "bg-emerald-50 text-emerald-700",
      statusLabel: t("dashboard.upcomingBookings.status.confirmed"),
    };
  } else if (statusUpper === "PENDING" || statusUpper === "SUBMITTED") {
    return {
      statusClass: "bg-amber-50 text-amber-700",
      statusLabel: t("dashboard.upcomingBookings.status.pending"),
    };
  } else if (statusUpper === "CANCELLED") {
    return {
      statusClass: "bg-red-50 text-red-700",
      statusLabel: t("dashboard.upcomingBookings.status.cancelled"),
    };
  }

  return {
    statusClass: "bg-slate-50 text-slate-700",
    statusLabel: status,
  };
}

function getIconConfig(status: string) {
  const statusUpper = status.toUpperCase();

  if (statusUpper === "APPROVED" || statusUpper === "CONFIRMED") {
    return {
      icon: "groups",
      bgClass: "bg-primary-container",
    };
  } else if (statusUpper === "PENDING") {
    return {
      icon: "person_search",
      bgClass: "bg-slate-100 text-slate-400",
    };
  }

  return {
    icon: "laptop_mac",
    bgClass: "bg-secondary-container text-primary",
  };
}
