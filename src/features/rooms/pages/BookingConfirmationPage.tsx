// ─────────────────────────────────────────────────────────────────────────────
// BookingConfirmationPage — Success screen after booking submission
// Route: /booking/success  (receives booking data via router state)
// Asymmetric 7/5 layout matching "Scholarly Sanctuary" Stitch design
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  School,
  CalendarDays,
  Clock,
  Info,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import type { BookingConfirmation } from "../../rooms/types/roomDetail.types";

// ── Summary row sub-component ─────────────────────────────────────────────────
const SummaryRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex gap-4">
    <div className="w-11 h-11 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="text-base font-headline font-bold text-on-surface leading-snug mt-0.5 truncate">
        {value}
      </p>
    </div>
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export const BookingConfirmationPage = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking as BookingConfirmation | undefined;

  // Guard: if arrived without booking data, redirect to rooms
  useEffect(() => {
    if (!booking) {
      navigate("/rooms", { replace: true });
    }
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto min-h-[calc(100vh-8rem)] flex items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* ── Left: Hero success section (7/12) ── */}
          <div className="md:col-span-7 space-y-8">
            {/* Icon + title */}
            <div className="space-y-5">
              {/* Animated success icon */}
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-full bg-tertiary-fixed/20 flex items-center justify-center">
                  <CheckCircle
                    size={44}
                    strokeWidth={1.5}
                    className="text-on-tertiary-fixed-variant"
                    style={{ fill: "rgba(136,249,176,0.2)" }}
                  />
                </div>
                {/* Pulse ring */}
                <span className="absolute inset-0 rounded-full border-2 border-tertiary-fixed/30 animate-ping opacity-60" />
              </div>

              <div>
                <h1 className="font-headline text-4xl sm:text-5xl font-extrabold tracking-tight text-primary leading-tight">
                  {t("bookingSuccess.title")}
                </h1>
                <p className="text-lg text-on-surface-variant mt-3 max-w-md leading-relaxed">
                  {t("bookingSuccess.subtitle")}
                </p>
              </div>
            </div>

            {/* Booking ID badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container border border-outline-variant/30">
              <span className="text-xs text-on-surface-variant uppercase tracking-widest font-medium">
                Booking ID
              </span>
              <span className="text-sm font-headline font-bold text-primary">
                #{booking.bookingId}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(`/bookings/${encodeURIComponent(String(booking.bookingId))}`)}
                className={cn(
                  "flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl",
                  "bg-gradient-to-r from-primary to-primary-container text-white",
                  "font-headline font-bold text-base",
                  "shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.015] active:scale-[0.98]",
                  "transition-all duration-200"
                )}
              >
                {t("bookingSuccess.goToBookings")}
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate("/rooms")}
                className={cn(
                  "flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl",
                  "font-headline font-bold text-base text-on-surface-variant",
                  "hover:bg-surface-container-high transition-colors duration-200"
                )}
              >
                {t("bookingSuccess.browseMore")}
              </button>
            </div>
          </div>

          {/* ── Right: Editorial summary card (5/12) ── */}
          <div className="md:col-span-5">
            <div className="relative bg-surface-container-lowest rounded-2xl p-8 shadow-[0_8px_32px_rgba(24,28,30,0.08)] overflow-hidden">
              {/* Decorative soft orb */}
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-secondary-fixed/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 bg-primary-fixed/20 rounded-full blur-2xl pointer-events-none" />

              {/* Summary title */}
              <p className="font-headline text-xs font-bold uppercase tracking-widest text-on-secondary-container mb-7 relative z-10">
                {t("bookingSuccess.summary.title")}
              </p>

              {/* Summary rows */}
              <div className="space-y-5 relative z-10">
                <SummaryRow
                  icon={<School size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />}
                  label={t("bookingSuccess.summary.room")}
                  value={`${booking.roomName} · ${booking.building.name}`}
                />
                <SummaryRow
                  icon={<CalendarDays size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />}
                  label={t("bookingSuccess.summary.date")}
                  value={booking.date}
                />
                <SummaryRow
                  icon={<Clock size={20} className="text-on-primary-fixed-variant" strokeWidth={1.5} />}
                  label={t("bookingSuccess.summary.time")}
                  value={booking.timeSlot}
                />
              </div>

              {/* Status */}
              <div className="mt-8 pt-6 border-t border-surface-container-low flex items-center justify-between relative z-10">
                <span className="text-sm font-medium text-on-surface-variant">
                  {t("bookingSuccess.summary.status")}
                </span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-fixed/20 border border-tertiary-fixed/30">
                  <Clock3 size={12} className="text-on-tertiary-fixed-variant" />
                  <span className="text-xs font-bold text-on-tertiary-fixed-variant uppercase tracking-wide">
                    {booking.status?.toUpperCase() === "PENDING"
                      ? t("bookingSuccess.statusLabel")
                      : booking.status}
                  </span>
                </div>
              </div>

              {/* Info note */}
              <div className="mt-5 flex items-start gap-3 p-4 bg-surface-container-low rounded-xl relative z-10">
                <Info
                  size={16}
                  className="text-on-secondary-container shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
                <p className="text-sm text-on-secondary-container leading-relaxed">
                  {t("bookingSuccess.info")}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
};
