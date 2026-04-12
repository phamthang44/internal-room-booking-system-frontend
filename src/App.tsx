import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Router } from "@core/routing";
import { createAppQueryClient } from "@core/query";
import { I18nProvider } from "@shared/i18n/useI18n";

const queryClient = createAppQueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  if (!googleClientId && import.meta.env.DEV) {
    console.warn("VITE_GOOGLE_CLIENT_ID environment variable is not set");
  }

  return (
    <I18nProvider>
      <GoogleOAuthProvider clientId={googleClientId || ""}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </I18nProvider>
  );
}

export default App;
