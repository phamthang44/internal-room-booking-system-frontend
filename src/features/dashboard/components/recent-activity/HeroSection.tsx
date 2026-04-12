import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

interface HeroSectionProps {
  name: string;
}

export const HeroSection = ({ name }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleCreateBooking = () => {
    navigate("/rooms");
  };

  const handleViewSchedule = () => {
    navigate("/bookings");
  };

  return (
    <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-primary text-white">
      <div className="relative z-10 max-w-2xl">
        <h2 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          {t("dashboard.greeting", { name })}
        </h2>
        <p className="font-body text-on-primary-container text-lg font-medium max-w-md">
          {t("dashboard.subtitle")}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleCreateBooking}
            className="bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95"
          >
            {t("dashboard.hero.createBooking")}
          </button>
          <button
            onClick={handleViewSchedule}
            className="bg-primary-container/30 backdrop-blur-md text-white px-6 py-3 rounded-xl font-bold text-sm border border-white/10 hover:bg-white/10 transition-all"
          >
            {t("dashboard.hero.viewSchedule")}
          </button>
        </div>
      </div>
      {/* Abstract Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-container/40 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
    </section>
  );
};
