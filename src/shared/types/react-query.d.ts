import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: {
      /** When true, global toast is suppressed (use inline / local handling) */
      skipGlobalError?: boolean;
      /** When true, failed queries show the global toast (default is off) */
      showGlobalError?: boolean;
    };
    mutationMeta: {
      /** When true, global toast is suppressed (e.g. login form shows field errors) */
      skipGlobalError?: boolean;
    };
  }
}
