import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

interface LoadingScreenProps {
  duration?: number; // Duration in milliseconds before redirecting
}

export const LoadingScreen = ({ duration = 3000 }: LoadingScreenProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress with easing
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = Math.random() * (15 - 5) + 5;
        return Math.min(prev + increment, 90);
      });
    }, 300);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setIsComplete(true);
    }, duration - 500);

    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate, duration]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="text-center space-y-8 px-6 max-w-md animate-fadeIn">
        {/* Enhanced Spinner */}
        <div className="flex justify-center">
          <div className="relative w-20 h-20">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-outline-variant opacity-30" />

            {/* Animated spinner */}
            <div
              className={`absolute inset-0 rounded-full border-4 border-transparent border-t-primary transition-transform duration-1000 ${isComplete ? "animate-none" : "animate-spin"}`}
              style={{
                borderTopColor: isComplete ? "transparent" : "rgb(0, 32, 69)",
                animation: isComplete ? "none" : "spin 1s linear infinite",
              }}
            />

            {/* Success checkmark */}
            {isComplete && (
              <svg
                className="absolute inset-0 w-full h-full text-primary animate-scaleIn"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2
            className={`text-2xl font-semibold text-on-surface transition-opacity duration-500 ${isComplete ? "opacity-0" : "opacity-100"}`}
          >
            {isComplete ? t("common.loading.ready") : t("common.loading.title")}
          </h2>
          <p
            className={`text-sm text-on-surface-variant transition-opacity duration-500 ${isComplete ? "opacity-0" : "opacity-100"}`}
          >
            {isComplete
              ? t("common.loading.redirecting")
              : t("common.loading.subtitle")}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-inverse-primary transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading Tips */}
        {!isComplete && (
          <div
            className="text-xs text-on-surface-variant space-y-1 animate-fadeIn"
            style={{ animationDelay: "0.5s" }}
          >
            <p className="opacity-70">{t("common.loading.initializing")}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
