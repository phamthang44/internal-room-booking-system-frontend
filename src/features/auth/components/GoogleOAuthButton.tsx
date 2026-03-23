import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

/**
 * Google OAuth Button Wrapper
 *
 * Combines:
 * - GoogleLogin library (from @react-oauth/google)
 * - useGoogleAuth hook (for authentication logic)
 * - GoogleLoginButton component (reusable UI button)
 *
 * Handles:
 * - ID Token extraction from Google credential
 * - Backend token exchange
 * - Error handling with specific messages
 * - State management
 */
export const GoogleOAuthButton = () => {
  const { authenticate } = useGoogleAuth();

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    // Extract ID Token from Google's response
    if (!credentialResponse.credential) {
      console.error("No credential in Google response");
      return;
    }

    // Send ID Token to backend for validation and exchange
    // The authenticate function handles:
    // - API call to POST /auth/google
    // - Error categorization
    // - State updates
    // - Navigation on success
    authenticate(credentialResponse.credential);
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  return (
    <div className="w-full">
      {/* Google OAuth Button from library - handles OAuth flow */}
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        width="100%"
        text="signin_with"
      />
    </div>
  );
};
