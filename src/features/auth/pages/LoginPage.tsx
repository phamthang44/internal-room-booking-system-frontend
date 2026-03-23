import { LoginForm } from "../components/LoginForm";
import { GoogleOAuthButton } from "../components/GoogleOAuthButton";
import { AuthLayout } from "../components/AuthLayout";
import { useI18n } from "@shared/i18n/useI18n";

export const LoginPage = () => {
  const { t } = useI18n();

  return (
    <AuthLayout>
      <div>
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">
            {t("auth.login.title")}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {t("auth.login.subtitle")}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6">
          {/* Login Form */}
          <LoginForm />

          {/* Divider */}
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-outline uppercase tracking-tighter">
              {t("auth.login.divider")}
            </span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          {/* Google OAuth */}
          <GoogleOAuthButton />

          {/* Footer Text */}
          <p className="text-center text-xs text-on-surface-variant font-medium">
            {t("auth.login.footer")}
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
