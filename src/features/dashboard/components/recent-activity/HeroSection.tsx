import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

interface HeroSectionProps { name: string; }

export const HeroSection = ({ name }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <section className="workspace-intro">
      <div>
        <h1>{t("dashboard.greeting", { name })}</h1>
        <p>{t("dashboard.subtitle")}</p>
      </div>
      <div className="workspace-actions">
        <button className="action-primary" onClick={() => navigate("/rooms")}>
          {t("dashboard.hero.createBooking")}
          <span className="action-arrow" aria-hidden="true">↗</span>
        </button>
        <button className="action-secondary" onClick={() => navigate("/schedule")}>{t("dashboard.hero.viewSchedule")}</button>
      </div>
    </section>
  );
};
