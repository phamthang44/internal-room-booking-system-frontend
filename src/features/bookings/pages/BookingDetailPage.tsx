import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { normalizeApiError } from "@shared/errors/normalizeApiError";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { BookingTimeline } from "../components/BookingTimeline";
import { bookingsApiService } from "../api/bookings.api.service";
import { useBookingCheckout } from "../hooks/useBookingCheckout";
import { isBookingDateToday } from "@shared/utils/date";

// Sub-components
import { BookingSummaryCard } from "../components/detail/BookingSummaryCard";
import { BookingActionButtons } from "../components/detail/BookingActionButtons";
import { BookingPurposeSection } from "../components/detail/BookingPurposeSection";
import { BookingAttendeesSection } from "../components/detail/BookingAttendeesSection";
import { BookingLocationMap } from "../components/detail/BookingLocationMap";
import { BookingSidebarActions } from "../components/detail/BookingSidebarActions";
import { BookingCancelPanel } from "../components/detail/BookingCancelPanel";
import { BookingProTip } from "../components/detail/BookingProTip";

export interface BookingDetailPageProps {
  readonly className?: string;
}

export function BookingDetailPage({ className }: Readonly<BookingDetailPageProps>) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { bookingId } = useParams<{ bookingId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useBookingDetail(bookingId ?? "");
  const checkout = useBookingCheckout(bookingId ?? "");
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState<string | null>(null);
  const [cancelErrorMessage, setCancelErrorMessage] = useState<string | null>(null);
  const [cancelPanelOpen, setCancelPanelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const id = Number(bookingId);
      if (!Number.isFinite(id)) {
        throw new Error("Invalid booking id");
      }
      const reason = cancelReason.trim();
      if (!reason) {
        throw new Error(t("bookings.detail.actions.cancelReasonRequired"));
      }
      return await bookingsApiService.cancelBooking(id, reason);
    },
    onMutate: () => {
      setCancelSuccessMessage(null);
      setCancelErrorMessage(null);
    },
    onSuccess: async (message) => {
      const msg = message ?? t("bookings.detail.actions.cancelSuccessFallback");
      setCancelSuccessMessage(msg);
      presentAppSuccess(msg);
      setCancelPanelOpen(false);
      setCancelReason("");
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      await refetch();
    },
    onError: (err) => {
      const normalized = normalizeApiError(err);
      setCancelErrorMessage(normalized.message);
    },
  });

  const chipStatus = useMemo(() => {
    if (!data) return null;
    if (data.status === "confirmed") return "confirmed" as const;
    if (data.status === "pending") return "pending" as const;
    if (data.status === "cancelled") return "cancelled" as const;
    if (data.status === "rejected") return "rejected" as const;
    return null;
  }, [data]);

  const bookingIsToday = useMemo(() => {
    if (!data) return false;
    const raw = data.schedule.dateIso ?? data.schedule.dateLabel;
    return isBookingDateToday(raw);
  }, [data]);

  const handleCancelToggle = () => {
    if (!data?.canCancel || cancelMutation.isPending) return;
    setCancelSuccessMessage(null);
    setCancelErrorMessage(null);
    setCancelPanelOpen((v) => !v);
  };

  return (
    <AppLayout>
      <div className={cn("mx-auto max-w-5xl px-4 py-6 sm:px-6 md:py-8 lg:px-8", className)}>
        {/* Loading / error */}
        {isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            {t("bookings.detail.loading")}
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            <p className="font-semibold">{t("bookings.detail.error.title")}</p>
            <p className="text-sm mt-1 text-on-surface-variant">
              {t("bookings.detail.error.subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">refresh</span>
                {t("bookings.detail.retry")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("bookings.detail.backToList")}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary Card */}
              <BookingSummaryCard
                status={data.status}
                chipStatus={chipStatus}
                title={data.title}
                bookingCode={data.bookingCode}
                location={data.location}
                schedule={data.schedule}
              >
                <BookingActionButtons
                  status={data.status}
                  isToday={bookingIsToday}
                  isCheckingOut={checkout.isPending}
                  checkoutError={checkout.errorMessage}
                  onCheckIn={() => navigate(`/bookings/${data.id}/checkin`)}
                  onCheckOut={() => void checkout.checkout()}
                />
              </BookingSummaryCard>

              {/* Booking Purpose */}
              <BookingPurposeSection purpose={data.purpose} />

              {/* Attendees */}
              <BookingAttendeesSection attendeesCount={data.attendeesCount} />

              {/* Timeline */}
              <BookingTimeline title={t("bookings.detail.sections.history")} events={data.timeline} />
            </div>

            {/* Right column */}
            <div className="space-y-8">
              {/* Map / Location Visual */}
              <BookingLocationMap map={data.map} />

              {/* Actions */}
              <BookingSidebarActions
                canCancel={data.canCancel}
                isCancelling={cancelMutation.isPending}
                isPanelOpen={cancelPanelOpen}
                onTogglePanel={handleCancelToggle}
              >
                <BookingCancelPanel
                  isOpen={cancelPanelOpen}
                  isPending={cancelMutation.isPending}
                  reason={cancelReason}
                  onReasonChange={setCancelReason}
                  onOpenChange={setCancelPanelOpen}
                  onConfirm={() => void cancelMutation.mutateAsync()}
                  onCancel={() => {
                    setCancelPanelOpen(false);
                    setCancelReason("");
                    setCancelErrorMessage(null);
                  }}
                />

                {cancelSuccessMessage && (
                  <div className="mt-3 rounded-xl border border-tertiary-fixed/30 bg-tertiary-fixed/15 px-4 py-3 text-xs text-on-surface">
                    {cancelSuccessMessage}
                  </div>
                )}
                {cancelErrorMessage && (
                  <div className="mt-3 rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-xs text-error">
                    {cancelErrorMessage}
                  </div>
                )}
              </BookingSidebarActions>

              {/* Pro-tip */}
              {data.proTip && (
                <BookingProTip title={data.proTip.title} message={data.proTip.message} />
              )}

              <button
                type="button"
                onClick={() => navigate("/bookings")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("bookings.detail.backToList")}
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}


