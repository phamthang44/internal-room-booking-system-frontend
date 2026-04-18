import { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { useAppToastStore, type AppToastItem, type AppToastTone } from "@shared/errors/appToastStore";

const DISMISS_MS = 6000;

type ToneClasses = {
  border: string;
  side: string;
  iconWrap: string;
  icon: string;
  progress: string;
};

function getToneClasses(tone: AppToastTone): ToneClasses {
  switch (tone) {
    case "success":
      return {
        border: "border-tertiary-fixed/30 ring-1 ring-tertiary-fixed/15",
        side: "bg-tertiary-fixed",
        iconWrap: "bg-tertiary-fixed/25",
        icon: "text-on-tertiary-fixed-variant",
        progress: "bg-tertiary-fixed",
      };
    case "info":
      return {
        border: "border-primary-fixed/40 ring-1 ring-primary/10",
        side: "bg-primary",
        iconWrap: "bg-primary-fixed/50",
        icon: "text-primary",
        progress: "bg-primary-fixed-dim",
      };
    case "warning":
      return {
        border: "border-amber-500/30 ring-1 ring-amber-500/10",
        side: "bg-amber-600",
        iconWrap: "bg-amber-100",
        icon: "text-amber-900",
        progress: "bg-amber-500",
      };
    case "error":
    default:
      return {
        border: "border-error/25 ring-1 ring-error/10",
        side: "bg-error",
        iconWrap: "bg-error-container",
        icon: "text-on-error-container",
        progress: "bg-error",
      };
  }
}

function defaultIconForTone(tone: AppToastTone): string {
  switch (tone) {
    case "success":
      return "check_circle";
    case "info":
      return "info";
    case "warning":
      return "warning";
    case "error":
    default:
      return "error";
  }
}

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
  const toneClasses = getToneClasses(tone);
  const iconName = toast.materialIcon ?? defaultIconForTone(tone);

  useEffect(() => {
    const tmr = window.setTimeout(() => onDismiss(toast.id), DISMISS_MS);
    return () => clearTimeout(tmr);
  }, [toast.id, onDismiss]);

  const titleText = toast.plainTitle ?? t(toast.titleI18nKey);

  const bodyInner = (
    <>
      <p className="mb-1 text-sm font-semibold leading-snug text-on-surface">{titleText}</p>
      <p className="text-sm leading-relaxed text-on-surface-variant">{toast.message}</p>
      {toast.caption && (
        <p className="mt-1 text-xs text-on-surface-variant/85">{toast.caption}</p>
      )}
      {toast.traceId && (
        <p className="mt-2 font-mono text-[10px] text-on-surface-variant/80">
          {t("common.errors.toast.traceId")}: {toast.traceId}
        </p>
      )}
    </>
  );

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

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses.iconWrap} ${toast.pulseAccent ? "app-toast-icon-pulse" : ""}`}
      >
        <span className={`material-symbols-outlined text-[22px] ${toneClasses.icon}`}>{iconName}</span>
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        {toast.bookingId != null ? (
          <Link
            to={`/bookings/${toast.bookingId}`}
            className="-m-1 block rounded-xl p-1 text-left outline-none transition-colors hover:bg-surface-container/80 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {bodyInner}
          </Link>
        ) : (
          bodyInner
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
        @keyframes app-toast-icon-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.06); opacity: 0.92; }
        }
        .app-toast-enter {
          animation: app-toast-enter 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .app-toast-icon-pulse {
          animation: app-toast-icon-pulse 1.4s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};
