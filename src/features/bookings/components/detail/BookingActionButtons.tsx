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
      <div className="space-y-2.5">
        <button
          type="button"
          disabled={!isToday}
          title={!isToday ? t("bookings.detail.sameDayOnlyHint") : undefined}
          onClick={onCheckIn}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-bold transition-all shadow-xs",
            isToday
              ? "bg-primary text-on-primary hover:bg-primary/95 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98]"
              : "cursor-not-allowed bg-surface-container-high text-on-surface-variant/70 border border-outline-variant/20",
          )}
        >
          <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
          {t("bookings.checkin.actions.primary")}
          {isToday && (
            <span className="relative flex h-2 w-2 ml-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          )}
        </button>
        {!isToday && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant/80">
            <span className="material-symbols-outlined text-[15px]">info</span>
            <span>{t("bookings.detail.sameDayOnlyHint")}</span>
          </div>
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
            "w-full inline-flex items-center justify-center gap-2.5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-6 py-3.5 text-sm font-bold text-on-surface transition-all hover:bg-surface-container shadow-xs active:scale-[0.98]",
            isCheckingOut || !isToday ? "opacity-60 cursor-not-allowed" : "",
          )}
        >
          <span className={cn("material-symbols-outlined text-[20px]", isCheckingOut && "animate-spin")}>
            {isCheckingOut ? "progress_activity" : "logout"}
          </span>
          {t("bookings.checkout.actions.primary")}
        </button>
        {!isToday && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant/80">
            <span className="material-symbols-outlined text-[15px]">info</span>
            <span>{t("bookings.detail.sameDayOnlyHint")}</span>
          </div>
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
