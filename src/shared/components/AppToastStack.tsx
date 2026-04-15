import { useEffect, useCallback } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { useAppToastStore, type AppToastItem } from "@shared/errors/appToastStore";

const DISMISS_MS = 6000;

const ToastRow = ({
  toast,
  onDismiss,
  stackIndex,
}: {
  toast: AppToastItem;
  onDismiss: (id: number) => void;
  /** Later items slide in with a slight stagger */
  stackIndex: number;
}) => {
  const { t } = useI18n();
  const tone = toast.tone ?? "error";
  const toneClasses =
    tone === "success"
      ? {
          border: "border-tertiary-fixed/30 ring-1 ring-tertiary-fixed/15",
          side: "bg-tertiary-fixed",
          iconWrap: "bg-tertiary-fixed/25",
          icon: "text-on-tertiary-fixed-variant",
          progress: "bg-tertiary-fixed",
        }
      : {
          border: "border-error/25 ring-1 ring-error/10",
          side: "bg-error",
          iconWrap: "bg-error-container",
          icon: "text-on-error-container",
          progress: "bg-error",
        };

  useEffect(() => {
    const tmr = window.setTimeout(() => onDismiss(toast.id), DISMISS_MS);
    return () => clearTimeout(tmr);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`app-toast-enter relative flex min-w-[320px] max-w-[400px] items-start gap-4 rounded-2xl border bg-surface-container-lowest px-5 py-4 overflow-hidden shadow-[0_10px_40px_-10px_rgba(24,28,30,0.18)] ${toneClasses.border}`}
      style={{
        animationDelay: `${Math.min(stackIndex, 4) * 60}ms`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden rounded-b-2xl bg-surface-container">
        <div
          className={`h-full rounded-r-full ${toneClasses.progress}`}
          style={{
            animation: "app-toast-shrink 6s linear forwards",
            transformOrigin: "left",
          }}
        />
      </div>

      <div
        className={`absolute bottom-3 left-0 top-3 w-1 rounded-full ${toneClasses.side}`}
        aria-hidden
      />

      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses.iconWrap}`}>
        <span className={`material-symbols-outlined text-[22px] ${toneClasses.icon}`}>
          {tone === "success" ? "check_circle" : "error"}
        </span>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="mb-1 text-sm font-semibold leading-snug text-on-surface">
          {t(toast.titleI18nKey)}
        </p>
        <p className="text-sm leading-relaxed text-on-surface-variant">{toast.message}</p>
        {toast.traceId && (
          <p className="mt-2 font-mono text-[10px] text-on-surface-variant/80">
            {t("common.errors.toast.traceId")}: {toast.traceId}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={t("common.errors.http.dismiss")}
        className="mt-0.5 shrink-0 rounded-lg p-1.5 text-on-surface-variant transition-colors duration-200 hover:bg-surface-container hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  );
};

/**
 * Global toast stack driven by `presentAppError` / React Query caches.
 */
export const AppToastStack = () => {
  const { t } = useI18n();
  const toasts = useAppToastStore((s) => s.toasts);
  const remove = useAppToastStore((s) => s.remove);

  const onDismiss = useCallback(
    (id: number) => {
      remove(id);
    },
    [remove],
  );

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
      aria-live="assertive"
      aria-label={t("common.errors.toast.ariaLabel")}
    >
      {toasts.map((toast, index) => (
        <ToastRow
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          stackIndex={index}
        />
      ))}

      <style>{`
        @keyframes app-toast-shrink {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        @keyframes app-toast-enter {
          from {
            opacity: 0;
            transform: translateX(1.25rem) scale(0.94);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .app-toast-enter {
          animation: app-toast-enter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
      `}</style>
    </div>
  );
};
