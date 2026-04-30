import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useI18n } from "@shared/i18n/useI18n";
import { AuthLayout } from "../components/AuthLayout";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

export const ResetPasswordPage = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";

  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  return (
    <AuthLayout>
      <div>
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
            {t("auth.resetPassword.title")}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {t("auth.resetPassword.subtitle")}
          </p>
        </div>

        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6">
          <ResetPasswordForm email={email} />

          <p className="text-center text-xs text-on-surface-variant font-medium">
            <Link
              to="/forgot-password"
              className="font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {t("auth.resetPassword.requestNewOtp")}
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
