import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { ReactNode } from "react";

interface BookingSidebarActionsProps {
  readonly canCancel: boolean;
  readonly isCancelling: boolean;
  readonly isPanelOpen: boolean;
  readonly onTogglePanel: () => void;
  readonly children?: ReactNode;
}

export function BookingSidebarActions({
  canCancel,
  isCancelling,
  isPanelOpen,
  onTogglePanel,
  children,
}: BookingSidebarActionsProps) {
  const { t } = useI18n();

  return (
    <section className="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl shadow-[0_8px_24px_rgba(24,28,30,0.04)]">
      <h3 className="text-sm font-bold text-on-surface mb-4 uppercase tracking-widest font-headline">
        {t("bookings.detail.sections.actions")}
      </h3>
      <div className="space-y-3">
        <button
          type="button"
          className="w-full h-12 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">event</span>
          {t("bookings.detail.actions.addToCalendar")}
        </button>
        <button
          type="button"
          className="w-full h-12 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">support_agent</span>
          {t("bookings.detail.actions.contactSupport")}
        </button>

        <div className="pt-4 mt-4 border-t border-outline-variant/10">
          <button
            type="button"
            disabled={!canCancel || isCancelling}
            onClick={onTogglePanel}
            className={cn(
              "w-full h-12 font-bold rounded-xl transition-all flex items-center justify-center gap-2",
              canCancel && !isCancelling
                ? "text-error hover:bg-error-container/10"
                : "text-on-surface-variant/50 cursor-not-allowed"
            )}
          >
            <span className="material-symbols-outlined">
              {isCancelling ? "progress_activity" : "cancel"}
            </span>
            {isCancelling
              ? t("bookings.detail.actions.cancelling")
              : isPanelOpen
                ? t("bookings.detail.actions.cancelBookingClose")
                : t("bookings.detail.actions.cancelBooking")}
          </button>
          <p className="text-[10px] text-on-surface-variant text-center mt-2 px-4 leading-normal">
            {t("bookings.detail.actions.cancelHint")}
          </p>

          {children}
        </div>
      </div>
    </section>
  );
}
