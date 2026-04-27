import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

export function AdminDashboardHero() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-primary text-white">
      <div className="relative z-10 max-w-3xl">
        <h2 className="font-headline text-2xl md:text-4xl font-extrabold tracking-tight mb-2">
          {t("adminDashboard.hero.title")}
        </h2>
        <p className="font-body text-on-primary-container text-sm md:text-base font-medium max-w-2xl">
          {t("adminDashboard.hero.subtitle")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/approvals")}
            className="bg-white text-primary px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
          >
            {t("adminDashboard.hero.actions.goToApprovals")}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/rooms")}
            className="bg-primary-container/30 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/10 transition-all"
          >
            {t("adminDashboard.hero.actions.manageRooms")}
          </button>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-container/40 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl" />
    </section>
  );
}

