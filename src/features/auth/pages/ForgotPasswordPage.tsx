import { Link } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { AuthLayout } from "../components/AuthLayout";
import { ForgotPasswordForm } from "../components/ForgotPasswordForm";

export const ForgotPasswordPage = () => {
  const { t } = useI18n();

  return (
    <AuthLayout>
      <div>
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
            {t("auth.forgotPassword.title")}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {t("auth.forgotPassword.subtitle")}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6">
          <ForgotPasswordForm />

          <p className="text-center text-xs text-on-surface-variant font-medium">
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t("auth.forgotPassword.backToLogin")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
