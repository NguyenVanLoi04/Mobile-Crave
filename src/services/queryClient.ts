import { QueryClient } from '@tanstack/react-query';

/**
 * Standard TanStack React Query Client for Crave App
 * Configured with 5 min staleTime and error retry policies
 * Ready for future backend integration (NestJS)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (replaces cacheTime in v5)
      refetchOnWindowFocus: false,
    },
  },
});
