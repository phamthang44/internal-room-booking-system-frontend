import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@shared/components/AppLayout";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { useBookingDetail } from "../hooks/useBookingDetail";
import { useBookingCheckIn } from "../hooks/useBookingCheckIn";
import { CheckInHero } from "../components/checkin/CheckInHero";
import { CheckInBookingCard } from "../components/checkin/CheckInBookingCard";
import { SessionDetailsBento } from "../components/checkin/SessionDetailsBento";
import { LocationPreviewCard } from "../components/checkin/LocationPreviewCard";
import { HelpCard } from "../components/checkin/HelpCard";

export interface BookingCheckInPageProps {
  readonly className?: string;
}

export function BookingCheckInPage({ className }: Readonly<BookingCheckInPageProps>) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const id = bookingId ?? "";
  const { data, isLoading, isError, refetch } = useBookingDetail(id);
  const checkIn = useBookingCheckIn(id);

  const checkInWindow = useMemo(() => {
    if (!data?.checkInWindow) return null;
    const opensAt = new Date(data.checkInWindow.opensAtIso);
    const expiresAt = new Date(data.checkInWindow.expiresAtIso);
    if (Number.isNaN(opensAt.getTime()) || Number.isNaN(expiresAt.getTime())) return null;
    return { opensAt, expiresAt };
  }, [data]);

  const dateTimeLabel = useMemo(() => {
    if (!data) return "";
    return [data.schedule.dateLabel, data.schedule.timeLabel].filter(Boolean).join(" • ");
  }, [data]);

  const policyTone =
    checkIn.errorMessage ? ("error" as const) : checkIn.successMessage ? ("success" as const) : ("neutral" as const);

  const policyMessage =
    checkIn.errorMessage ?? checkIn.successMessage ?? t("bookings.checkin.policy.defaultMessage");

  return (
    <AppLayout>
      <div className={cn("max-w-screen-2xl mx-auto px-2 py-6 md:py-10", className)}>
        {isLoading ? (
          <div className="rounded-2xl bg-surface-container-lowest p-8 text-on-surface-variant">
            {t("bookings.checkin.loading")}
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-error-container bg-error-container/20 p-8 text-error">
            <p className="font-semibold">{t("bookings.detail.error.title")}</p>
            <p className="text-sm mt-1 text-on-surface-variant">{t("bookings.detail.error.subtitle")}</p>
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
          <>
            <CheckInHero
              title={t("bookings.checkin.hero.title")}
              subtitle={t("bookings.checkin.hero.subtitle")}
              className="mb-12"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-7 space-y-6">
                <CheckInBookingCard
                  status={data.status}
                  roomTitle={data.title}
                  dateTimeLabel={dateTimeLabel}
                  checkInWindow={checkInWindow}
                  countdownLabel={t("bookings.checkin.countdownLabel")}
                  primaryActionLabel={t("bookings.checkin.actions.primary")}
                  onPrimaryAction={checkIn.checkIn}
                  isPrimaryActionLoading={checkIn.isPending}
                  secondaryActionLabel={t("bookings.checkin.actions.secondary")}
                  policyTitle={t("bookings.checkin.policy.title")}
                  policyMessage={policyMessage}
                  policyTone={policyTone}
                />

                <SessionDetailsBento
                  purposeTitle={t("bookings.checkin.sections.purpose")}
                  purposeText={data.purpose}
                  attendeesTitle={t("bookings.checkin.sections.attendees")}
                  attendeesLabel={t("bookings.detail.attendeesCount", { count: data.attendeesCount })}
                  equipmentTitle={t("bookings.checkin.sections.equipment")}
                  equipmentTags={[
                    { label: t("bookings.checkin.equipment.projector"), icon: "videocam" },
                    { label: t("bookings.checkin.equipment.smartBoard"), icon: "tv" },
                    { label: t("bookings.checkin.equipment.highSpeedLan"), icon: "wifi" },
                  ]}
                />
              </div>

              <div className="lg:col-span-5 space-y-6">
                <LocationPreviewCard
                  imageUrl={data.map.imageUrl}
                  imageAlt={t("bookings.checkin.location.imageAlt")}
                  title={data.map.title || data.location.primary}
                  description={data.map.description || data.location.secondary || ""}
                  ctaLabel={data.map.ctaLabel || t("bookings.checkin.location.cta")}
                  onCtaClick={() => {
                    // TODO: wire to real floor plan route when available
                  }}
                />

                <HelpCard
                  title={t("bookings.checkin.help.title")}
                  subtitle={t("bookings.checkin.help.subtitle", { roomTitle: data.title })}
                  actions={[
                    {
                      label: t("bookings.checkin.help.contactSupport"),
                      icon: "support_agent",
                    },
                    {
                      label: t("bookings.checkin.help.faq"),
                      icon: "help",
                    },
                  ]}
                />

                <div className="border-2 border-dashed border-outline-variant p-6 rounded-xl flex items-center justify-center text-center opacity-60">
                  <div>
                    <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                      hourglass_empty
                    </span>
                    <p className="text-sm font-medium text-on-surface-variant">
                      {t("bookings.checkin.postCheckInHint")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

