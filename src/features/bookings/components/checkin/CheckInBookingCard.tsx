import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import type { BookingStatus } from "@/data/mockData";
import type { CheckInWindow } from "../../utils/checkInTime";
import { formatCountdownMMSS } from "../../utils/checkInTime";

export interface CheckInBookingCardProps {
  readonly status: BookingStatus;
  readonly roomTitle: string;
  readonly dateTimeLabel: string;
  readonly checkInWindow: CheckInWindow | null;
  readonly countdownLabel: string;
  readonly primaryActionLabel: string;
  readonly onPrimaryAction: () => void | Promise<void>;
  readonly isPrimaryActionLoading?: boolean;
  readonly secondaryActionLabel?: string;
  readonly onSecondaryAction?: () => void | Promise<void>;
  readonly policyTitle: string;
  readonly policyMessage: string;
  readonly policyTone?: "neutral" | "error" | "success";
  readonly className?: string;
}

const statusChipLabel = (status: BookingStatus): string => {
  return status;
};

export function CheckInBookingCard({
  status,
  roomTitle,
  dateTimeLabel,
  checkInWindow,
  countdownLabel,
  primaryActionLabel,
  onPrimaryAction,
  isPrimaryActionLoading,
  secondaryActionLabel,
  onSecondaryAction,
  policyTitle,
  policyMessage,
  policyTone = "neutral",
  className,
}: Readonly<CheckInBookingCardProps>) {
  const { t } = useI18n();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = checkInWindow ? globalThis.setInterval(() => setNow(Date.now()), 1000) : null;
    return () => {
      if (t) globalThis.clearInterval(t);
    };
  }, [checkInWindow]);

  const chipClass = useMemo(() => {
    if (status === "confirmed") {
      return "bg-tertiary-fixed text-on-tertiary-fixed";
    }
    if (status === "completed") {
      return "bg-tertiary-fixed/20 text-on-tertiary-container";
    }
    if (status === "pending") {
      return "bg-secondary-container text-on-secondary-container";
    }
    if (status === "cancelled" || status === "rejected") {
      return "bg-error-container text-on-error-container";
    }
    if (status === "inUse") {
      return "bg-primary-container text-on-primary-container";
    }
    return "bg-surface-container-high text-on-surface-variant";
  }, [status]);

  const policyClass = useMemo(() => {
    if (policyTone === "error") return "bg-error-container/30";
    if (policyTone === "success") return "bg-tertiary-fixed/15";
    return "bg-error-container/30";
  }, [policyTone]);

  const policyIcon = policyTone === "success" ? "check_circle" : "warning";
  const policyIconClass = policyTone === "success" ? "text-on-tertiary-container" : "text-error";

  const countdown = useMemo(() => {
    if (!checkInWindow) return null;
    const remaining = checkInWindow.expiresAt.getTime() - now;
    if (remaining <= 0) return "00:00";
    return formatCountdownMMSS(remaining);
  }, [checkInWindow, now]);

  return (
    <div
      className={cn(
        "bg-surface-container-lowest rounded-xl p-8 shadow-[0_8px_24px_rgba(24,28,30,0.04)] relative overflow-hidden",
        className,
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-bl-full -mr-8 -mt-8" />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 relative z-10">
        <div>
          <span
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4",
              chipClass,
            )}
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>
              check_circle
            </span>
            {status === "confirmed"
              ? t("bookings.checkin.status.confirmed")
              : status === "pending"
                ? t("bookings.checkin.status.pending")
                : status === "inUse"
                  ? t("bookings.checkin.status.inUse")
                  : status === "completed"
                    ? t("bookings.checkin.status.completed")
                    : status === "cancelled"
                      ? t("bookings.checkin.status.cancelled")
                      : status === "rejected"
                        ? t("bookings.checkin.status.rejected")
                        : statusChipLabel(status)}
          </span>

          <h2 className="text-3xl font-bold text-primary mb-2">{roomTitle}</h2>
          <div className="flex items-center gap-2 text-on-surface-variant font-medium">
            <span className="material-symbols-outlined text-primary">calendar_today</span>
            {dateTimeLabel}
          </div>
        </div>

        {countdown ? (
          <div className="flex flex-col items-center p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">
              {countdownLabel}
            </span>
            <span className="text-2xl font-mono font-bold text-error">{countdown}</span>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <button
          type="button"
          onClick={() => void onPrimaryAction()}
          disabled={Boolean(isPrimaryActionLoading) || status !== "confirmed"}
          className={cn(
            "flex items-center justify-center gap-3 py-4 px-6 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20",
            isPrimaryActionLoading || status !== "confirmed" ? "opacity-80 cursor-not-allowed" : "",
          )}
        >
          <span className="material-symbols-outlined">
            {isPrimaryActionLoading ? "progress_activity" : "location_on"}
          </span>
          {primaryActionLabel}
        </button>

        <button
          type="button"
          onClick={() => (onSecondaryAction ? void onSecondaryAction() : undefined)}
          disabled={!onSecondaryAction}
          className={cn(
            "flex items-center justify-center gap-3 py-4 px-6 bg-surface-container-high text-primary font-bold rounded-lg hover:bg-surface-container-highest transition-all",
            !onSecondaryAction ? "opacity-50 cursor-not-allowed" : "",
          )}
        >
          <span className="material-symbols-outlined">qr_code_scanner</span>
          {secondaryActionLabel ?? "Scan QR Code"}
        </button>
      </div>

      <div className={cn("flex items-start gap-3 p-4 rounded-lg", policyClass)}>
        <span className={cn("material-symbols-outlined mt-0.5", policyIconClass)}>{policyIcon}</span>
        <p className="text-sm text-on-error-container leading-relaxed">
          <strong>{policyTitle}</strong> {policyMessage}
        </p>
      </div>
    </div>
  );
}

