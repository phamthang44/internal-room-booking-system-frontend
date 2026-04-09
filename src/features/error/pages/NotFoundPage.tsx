import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

/**
 * NotFoundPage — displayed when the user navigates to an unknown URL path.
 *
 * Styled to match the "Academic Atelier / Scholarly Sanctuary" design system.
 * Uses the i18n hook so all copy is translated.
 */
export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%), #0f0f14",
      }}
    >
      {/* Decorative number */}
      <div className="relative mb-8 select-none">
        <span
          className="block text-[10rem] font-black leading-none tracking-tighter"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.6) 0%, rgba(139,92,246,0.3) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "blur(0px)",
          }}
          aria-hidden="true"
        >
          404
        </span>
        {/* Glowing underline accent */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 h-px w-36 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), transparent)",
          }}
        />
      </div>

      {/* Icon */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg">
        <span className="material-symbols-outlined text-3xl text-indigo-400">
          search_off
        </span>
      </div>

      {/* Heading */}
      <h1 className="mb-3 text-2xl font-bold text-white tracking-tight">
        {t("common.errors.http.404.title")}
      </h1>

      {/* Message */}
      <p className="mb-10 max-w-md text-sm text-on-surface-variant leading-relaxed">
        {t("common.errors.http.404.message")}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          id="not-found-back-button"
          onClick={() => navigate(-1)}
          className="
            inline-flex items-center gap-2 rounded-xl border border-white/10
            bg-white/5 px-5 py-2.5 text-sm font-medium text-white
            hover:bg-white/10 hover:border-white/20 transition-all duration-200
          "
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Go Back
        </button>
        <button
          id="not-found-dashboard-button"
          onClick={() => navigate("/dashboard")}
          className="
            inline-flex items-center gap-2 rounded-xl
            bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white
            hover:bg-indigo-500 active:scale-95 transition-all duration-200
            shadow-lg shadow-indigo-500/25
          "
        >
          <span className="material-symbols-outlined text-base">dashboard</span>
          {t("nav.dashboard")}
        </button>
      </div>
    </div>
  );
};
