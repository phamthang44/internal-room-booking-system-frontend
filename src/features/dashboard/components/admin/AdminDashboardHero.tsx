import { useNavigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";

export function AdminDashboardHero() {
  const navigate = useNavigate();
  const { t } = useI18n();
  return (
    <section className="workspace-intro">
      <div>
        <h1>{t("adminDashboard.hero.title")}</h1>
        <p>{t("adminDashboard.hero.subtitle")}</p>
      </div>
      <div className="workspace-actions">
        <button type="button" className="action-primary" onClick={() => navigate("/admin/approvals")}>
          {t("adminDashboard.hero.actions.goToApprovals")}
          <span className="action-arrow" aria-hidden="true">↗</span>
        </button>
        <button type="button" className="action-secondary" onClick={() => navigate("/admin/rooms")}>{t("adminDashboard.hero.actions.manageRooms")}</button>
      </div>
    </section>
  );
}
