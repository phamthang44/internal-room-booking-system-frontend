import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

interface BookingCancelPanelProps {
  readonly isOpen: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly reason: string;
  readonly onReasonChange: (reason: string) => void;
  readonly isPending: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function BookingCancelPanel({
  isOpen,
  onOpenChange,
  reason,
  onReasonChange,
  isPending,
  onConfirm,
  onCancel,
}: BookingCancelPanelProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="mt-3 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4">
      <label className="block text-xs font-bold text-on-surface mb-2">
        {t("bookings.detail.actions.cancelReasonLabel")}
      </label>
      <textarea
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        rows={3}
        placeholder={t("bookings.detail.actions.cancelReasonPlaceholder")}
        className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-xs font-bold hover:bg-surface-container transition-colors disabled:opacity-60"
          disabled={isPending}
        >
          {t("bookings.detail.actions.cancelReasonBack")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 h-11 rounded-xl bg-error text-on-error text-xs font-bold hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isPending || reason.trim().length === 0}
        >
          {isPending
            ? t("bookings.detail.actions.cancelling")
            : t("bookings.detail.actions.cancelReasonConfirm")}
        </button>
      </div>
      <p className="mt-2 text-[10px] text-on-surface-variant leading-normal">
        {t("bookings.detail.actions.cancelReasonNote")}
      </p>
    </div>
  );
}
