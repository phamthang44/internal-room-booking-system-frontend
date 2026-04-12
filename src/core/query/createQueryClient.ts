import {
  QueryClient,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { presentAppError } from "@shared/errors/presentAppError";

/**
 * React Query client with global error presentation:
 * - Mutations: toast on error unless `meta: { skipGlobalError: true }`
 * - Queries: toast only when `meta: { showGlobalError: true }` (default off — use inline UI)
 */
export const createAppQueryClient = () =>
  new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta?.skipGlobalError) return;
        if (!query.meta?.showGlobalError) return;
        presentAppError(error);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        if (mutation.meta?.skipGlobalError) return;
        presentAppError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  });
