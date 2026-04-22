import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

interface BookingActionButtonsProps {
  readonly status: string;
  readonly isToday: boolean;
  readonly onCheckIn: () => void;
  readonly onCheckOut: () => void;
  readonly isCheckingOut: boolean;
  readonly checkoutError?: string | null;
}

export function BookingActionButtons({
  status,
  isToday,
  onCheckIn,
  onCheckOut,
  isCheckingOut,
  checkoutError,
}: BookingActionButtonsProps) {
  const { t } = useI18n();

  if (status === "confirmed") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={!isToday}
          title={!isToday ? t("bookings.detail.sameDayOnlyHint") : undefined}
          onClick={onCheckIn}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all",
            isToday
              ? "bg-primary text-on-primary hover:opacity-90 active:scale-95"
              : "cursor-not-allowed bg-surface-container-high text-on-surface-variant opacity-90",
          )}
        >
          <span className="material-symbols-outlined text-[18px]">location_on</span>
          {t("bookings.checkin.actions.primary")}
        </button>
        {!isToday && (
          <p className="text-center text-xs text-on-surface-variant">
            {t("bookings.detail.sameDayOnlyHint")}
          </p>
        )}
      </div>
    );
  }

  if (status === "inUse") {
    return (
      <div className="space-y-3">
        <button
          type="button"
          disabled={isCheckingOut || !isToday}
          title={!isToday ? t("bookings.detail.sameDayOnlyHint") : undefined}
          onClick={onCheckOut}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-3 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container",
            isCheckingOut || !isToday ? "opacity-70 cursor-not-allowed" : "",
          )}
        >
          <span className="material-symbols-outlined text-[18px]">
            {isCheckingOut ? "progress_activity" : "logout"}
          </span>
          {t("bookings.checkout.actions.primary")}
        </button>
        {!isToday && (
          <p className="text-center text-xs text-on-surface-variant">
            {t("bookings.detail.sameDayOnlyHint")}
          </p>
        )}
        {checkoutError && (
          <div className="rounded-xl border border-error-container bg-error-container/20 px-4 py-3 text-xs text-error">
            {checkoutError}
          </div>
        )}
      </div>
    );
  }

  return null;
}
