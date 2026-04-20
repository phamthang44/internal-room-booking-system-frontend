import { useEffect } from "react";
import { cn } from "@shared/utils/cn";

export interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly description?: string;
  readonly confirmLabel: string;
  readonly cancelLabel: string;
  readonly tone?: "neutral" | "danger";
  readonly busy?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = "neutral",
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={() => !busy && onCancel()}
    >
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-outline-variant/20",
          "bg-surface-container-lowest/80 shadow-2xl backdrop-blur-md",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <h2 className="font-headline text-lg font-extrabold text-on-surface">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
          ) : null}

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={cn(
                "h-11 rounded-xl px-5 text-sm font-bold text-on-primary disabled:opacity-50",
                tone === "danger"
                  ? "bg-error hover:opacity-95"
                  : "bg-primary hover:opacity-95",
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

