// English translations
export const en = {
  auth: {
    login: {
      title: "Welcome Back",
      subtitle: "Access your scholarly dashboard",
      email: {
        label: "Email or Username",
        placeholder: "e.g. j.smith@university.edu",
        error: {
          required: "Email is required",
          invalid: "Please enter a valid email",
        },
      },
      password: {
        label: "Password",
        placeholder: "••••••••",
        error: {
          required: "Password is required",
          minLength: "Password must be at least 8 characters",
        },
      },
      forgotPassword: "Forgot Password?",
      submit: {
        signIn: "Sign In",
        signing: "Signing in...",
      },
      divider: "Or continue with",
      oauth: {
        google: "Continue with Google",
        loading: "Signing in with Google...",
        error: {
          userNotFound:
            "Your account is not registered. Please contact the administrator.",
          invalidToken: "Google authentication failed. Please try again.",
          network: "Network error. Please check your connection and try again.",
          unknown: "Google sign in failed. Please try again.",
        },
      },
      footer: "Restricted access for University Staff and Students only.",
      errors: {
        unknown: "An error occurred. Please try again.",
      },
    },
  },
  common: {
    appName: "Scholarly Sanctuary",
    layout: {
      leftPanel: {
        title: "Quiet spaces for deep focus.",
        description:
          "Experience a sophisticated booking environment designed for the modern academic lifestyle.",
      },
    },
    errors: {
      unknown: "An error occurred. Please try again.",
    },
    language: "Language",
    help: "Help",
    security: "Security Policy",
    terms: "Terms of Service",
    support: "IT Support",
    copyright: "© 2026 University Academic Atelier. All rights reserved.",
  },
} as const;
