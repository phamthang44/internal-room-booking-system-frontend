import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleLogin } from "../hooks/useGoogleLogin";
import { useAuthStore } from "../hooks/useAuthStore";
import { useI18n } from "@shared/i18n/useI18n";
import { useEffect, useRef, useState } from "react";
import { GoogleLoginButton } from "@shared/components/GoogleLoginButton";

/**
 * Google OAuth Button Wrapper
 *
 * Combines:
 * - GoogleLogin library (from @react-oauth/google)
 * - useGoogleLogin hook (for authentication logic)
 *
 * Handles:
 * - ID Token extraction from Google credential
 * - Backend token exchange
 * - Error handling with detailed logging
 * - State management
 *
 * Note: The 403 "origin not allowed" error comes from Google's configuration.
 * Check your Google OAuth app settings:
 * 1. Client ID matches VITE_GOOGLE_CLIENT_ID
 * 2. Current domain is added to Authorized JavaScript Origins
 * 3. Redirect URI is added to Authorized redirect URIs
 */
export const GoogleOAuthButton = () => {
  const { googleLogin, isLoading } = useGoogleLogin();
  const { t } = useI18n();
  const { error, setError, isLoading: isAuthStoreLoading } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [buttonWidth, setButtonWidth] = useState(360);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const isSubmitting = isLoading || isAuthStoreLoading;

  useEffect(() => {
    if (error) {
      setIsDialogOpen(true);
    }
  }, [error]);

  useEffect(() => {
    if (!buttonContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextWidth = Math.max(280, Math.floor(entry.contentRect.width));
      setButtonWidth(nextWidth);
    });

    resizeObserver.observe(buttonContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setError(null);
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    // Extract ID Token from Google's response
    if (!credentialResponse.credential) {
      setError(t("auth.login.oauth.error.invalidToken"));
      return;
    }

    // Send ID Token to backend for validation and exchange
    // The authenticate function handles:
    // - API call to POST /auth/google
    // - Error categorization
    // - State updates
    // - Navigation on success
    googleLogin(credentialResponse);
  };

  const handleGoogleError = () => {
    setError(t("auth.login.oauth.error.invalidToken"));
  };

  return (
    <div className="w-full">
      <div ref={buttonContainerRef} className="relative">
        <div className={isSubmitting ? "opacity-80" : ""} aria-hidden="true">
          <GoogleLoginButton
            onClick={() => {}}
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? t("auth.login.oauth.loading")
              : t("auth.login.oauth.google")}
          </GoogleLoginButton>
        </div>

        <div
          className={
            isSubmitting
              ? "absolute inset-0 pointer-events-none opacity-0"
              : "absolute inset-0 opacity-0"
          }
        >
          <div className="flex h-full w-full items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width={String(buttonWidth)}
              text="continue_with"
              shape="pill"
              logo_alignment="left"
            />
          </div>
        </div>
      </div>

      {isDialogOpen && error && (
        <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4 macos-modal-backdrop">
          <div className="w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-container-lowest shadow-2xl overflow-hidden macos-modal-window">
            <div className="h-1 w-full bg-gradient-to-r from-red-400 via-orange-300 to-red-400" />

            <div className="p-6">
              <h3 className="text-lg font-bold text-on-surface tracking-tight">
                {t("auth.login.oauth.dialog.title")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                {error}
              </p>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark transition-colors macos-tap"
                >
                  {t("auth.login.oauth.dialog.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
