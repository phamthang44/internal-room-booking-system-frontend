import { useEffect, useState, useCallback } from "react";
import { useI18n } from "@shared/i18n/useI18n";

type HttpErrorStatus = 403 | 404;

interface HttpError {
  status: HttpErrorStatus;
  id: number; // unique key per event so multiple errors stack
}

/**
 * HttpErrorToast
 *
 * Listens on the `http:error` CustomEvent dispatched by the Axios response
 * interceptor whenever a 403 or 404 response is received.
 *
 * Renders a premium, dismissible toast notification in the bottom-right corner
 * without navigating away from the current page — preserving the user's context.
 *
 * Supports i18n via `useI18n` and auto-dismisses after 6 seconds.
 */
export const HttpErrorToast = () => {
  const { t } = useI18n();
  const [errors, setErrors] = useState<HttpError[]>([]);

  const removeError = useCallback((id: number) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const handleHttpError = (event: Event) => {
      const { status } = (event as CustomEvent<{ status: number }>).detail;
      if (status === 403 || status === 404) {
        const id = Date.now();
        setErrors((prev) => [...prev, { status, id }]);
        // Auto-dismiss after 6s
        setTimeout(() => removeError(id), 6000);
      }
    };

    window.addEventListener("http:error", handleHttpError);
    return () => window.removeEventListener("http:error", handleHttpError);
  }, [removeError]);

  if (errors.length === 0) return null;

  const iconMap: Record<HttpErrorStatus, string> = {
    403: "block",
    404: "search_off",
  };

  const colorMap: Record<
    HttpErrorStatus,
    { border: string; icon: string; badge: string }
  > = {
    403: {
      border: "border-amber-500/40",
      icon: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
    },
    404: {
      border: "border-blue-500/40",
      icon: "text-blue-400",
      badge: "bg-blue-500/20 text-blue-300",
    },
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
      aria-live="assertive"
      aria-label="Error notifications"
    >
      {errors.map(({ status, id }) => {
        const colors = colorMap[status];
        const titleKey = `common.errors.http.${status}.title`;
        const msgKey = `common.errors.http.${status}.message`;
        const dismissKey = "common.errors.http.dismiss";

        return (
          <div
            key={id}
            role="alert"
            className={`
              relative flex items-start gap-4 
              rounded-2xl border ${colors.border}
              bg-surface/95 backdrop-blur-xl
              px-5 py-4 shadow-2xl shadow-black/40
              min-w-[320px] max-w-[400px]
              animate-in slide-in-from-right-6 fade-in duration-300
            `}
            style={{
              background:
                "linear-gradient(135deg, rgba(30,30,40,0.97) 0%, rgba(20,20,30,0.97) 100%)",
            }}
          >
            {/* Accent line */}
            <div
              className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${
                status === 403 ? "bg-amber-400" : "bg-blue-400"
              }`}
            />

            {/* Icon */}
            <div
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                ${status === 403 ? "bg-amber-500/15" : "bg-blue-500/15"}
              `}
            >
              <span
                className={`material-symbols-outlined text-xl ${colors.icon}`}
              >
                {iconMap[status]}
              </span>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}
                >
                  {status}
                </span>
                <p className="text-sm font-semibold text-white truncate">
                  {t(titleKey)}
                </p>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                {t(msgKey)}
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => removeError(id)}
              aria-label={t(dismissKey)}
              className="
                shrink-0 mt-0.5 rounded-lg p-1
                text-on-surface-variant hover:text-white
                hover:bg-white/10 transition-all duration-150
              "
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
              <div
                className={`h-full ${status === 403 ? "bg-amber-400" : "bg-blue-400"} opacity-60`}
                style={{
                  animation: "shrink-x 6s linear forwards",
                  transformOrigin: "left",
                }}
              />
            </div>
          </div>
        );
      })}

      <style>{`
        @keyframes shrink-x {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
        @keyframes animate-in {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
