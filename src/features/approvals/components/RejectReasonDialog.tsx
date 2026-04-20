import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";

export interface RejectReasonDialogProps {
  readonly open: boolean;
  readonly title?: string;
  readonly onClose: () => void;
  readonly onConfirm: (reason: string) => void | Promise<void>;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly disabled?: boolean;
}

const MAX_LEN = 500;

export function RejectReasonDialog({
  open,
  title = "Provide Rejection Reason",
  onClose,
  onConfirm,
  confirmLabel = "Confirm Rejection",
  cancelLabel = "Cancel",
  disabled,
}: RejectReasonDialogProps) {
  const [value, setValue] = useState("");
  const trimmed = useMemo(() => value.trim(), [value]);
  const tooLong = trimmed.length > MAX_LEN;
  const canConfirm = trimmed.length > 0 && !tooLong && !disabled;

  useEffect(() => {
    if (open) setValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      role="presentation"
      onClick={() => !disabled && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-surface-container-lowest p-6 shadow-2xl border border-outline-variant/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-rose-600"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              info
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-rose-600">
              {title}
            </span>
          </div>
          <button
            type="button"
            className={cn(
              "text-on-surface-variant hover:text-on-surface p-1 rounded-lg",
              disabled && "opacity-50 pointer-events-none",
            )}
            onClick={onClose}
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <textarea
            className={cn(
              "w-full min-h-[96px] rounded-xl bg-surface-container-low border border-outline-variant/20 p-3 text-sm",
              "placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/40",
              disabled && "opacity-60",
            )}
            placeholder="E.g., Room maintenance scheduled during this slot, or please choose a smaller venue."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={MAX_LEN + 50}
            disabled={disabled}
          />
          <div className="flex items-center justify-between">
            <p className={cn("text-[11px] text-on-surface-variant", tooLong && "text-error")}>
              {trimmed.length}/{MAX_LEN}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className={cn(
                  "px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors",
                  disabled && "opacity-50 pointer-events-none",
                )}
                onClick={onClose}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold",
                  canConfirm
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-200"
                    : "bg-surface-container-high text-on-surface-variant cursor-not-allowed",
                )}
                disabled={!canConfirm}
                onClick={() => void onConfirm(trimmed)}
              >
                <span className="material-symbols-outlined text-sm">block</span>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

