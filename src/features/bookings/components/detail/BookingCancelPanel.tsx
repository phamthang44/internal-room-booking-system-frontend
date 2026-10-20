import { useI18n } from "@shared/i18n/useI18n";

interface BookingCancelPanelProps {
  readonly isOpen: boolean;
  readonly reason: string;
  readonly onReasonChange: (reason: string) => void;
  readonly isPending: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function BookingCancelPanel({
  isOpen,
  reason,
  onReasonChange,
  isPending,
  onConfirm,
  onCancel,
}: BookingCancelPanelProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="mt-3 rounded-2xl border border-error/20 bg-error-container/5 p-4 shadow-2xs">
      <label className="block text-xs font-bold text-error mb-2">
        {t("bookings.detail.actions.cancelReasonLabel")}
      </label>
      <textarea
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        rows={3}
        placeholder={t("bookings.detail.actions.cancelReasonPlaceholder")}
        className="w-full resize-none rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-error/30 focus:border-error"
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-10 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface text-xs font-bold hover:bg-surface-container transition-colors disabled:opacity-60"
          disabled={isPending}
        >
          {t("bookings.detail.actions.cancelReasonBack")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 h-10 rounded-xl bg-error text-on-error text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          disabled={isPending || reason.trim().length === 0}
        >
          {isPending
            ? t("bookings.detail.actions.cancelling")
            : t("bookings.detail.actions.cancelReasonConfirm")}
        </button>
      </div>
      <p className="mt-2 text-[10px] text-on-surface-variant/80 leading-normal">
        {t("bookings.detail.actions.cancelReasonNote")}
      </p>
    </div>
  );
}
