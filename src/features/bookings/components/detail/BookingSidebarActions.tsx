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
    <section className="rounded-3xl bg-surface-container-lowest p-6 border border-outline-variant/15 shadow-[0_4px_20px_-2px_rgba(24,28,30,0.04)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-[18px] text-primary">bolt</span>
        <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider font-headline">
          {t("bookings.detail.sections.actions")}
        </h3>
      </div>
      <div className="space-y-2.5">
        <button
          type="button"
          className="w-full h-11 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-outline-variant/15 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">event</span>
          {t("bookings.detail.actions.addToCalendar")}
        </button>
        <button
          type="button"
          className="w-full h-11 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-outline-variant/15 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">support_agent</span>
          {t("bookings.detail.actions.contactSupport")}
        </button>

        <div className="pt-3 mt-3 border-t border-outline-variant/15">
          <button
            type="button"
            disabled={!canCancel || isCancelling}
            onClick={onTogglePanel}
            className={cn(
              "w-full h-11 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2",
              canCancel && !isCancelling
                ? "text-error bg-error-container/10 hover:bg-error-container/20 border border-error/20 active:scale-[0.98]"
                : "text-on-surface-variant/40 bg-surface-container-low/40 cursor-not-allowed"
            )}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isCancelling ? "progress_activity" : "cancel"}
            </span>
            {isCancelling
              ? t("bookings.detail.actions.cancelling")
              : isPanelOpen
                ? t("bookings.detail.actions.cancelBookingClose")
                : t("bookings.detail.actions.cancelBooking")}
          </button>
          <p className="text-[11px] text-on-surface-variant/80 text-center mt-2.5 px-2 leading-relaxed">
            {t("bookings.detail.actions.cancelHint")}
          </p>

          {children}
        </div>
      </div>
    </section>
  );
}
