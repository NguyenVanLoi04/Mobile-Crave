import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack QueryClient configured for React Native & Crave OSM Data Layer
 * Conforms to Section 15 Tech Stack of Crave plan.md
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data remains fresh for 2 hours (POIs & restaurants rarely change)
      staleTime: 1000 * 60 * 60 * 2,
      // Cached data stays in memory for 24 hours
      gcTime: 1000 * 60 * 60 * 24,
      // Retry failed queries twice with exponential backoff
      retry: 2,
      // Disable auto refetching on window focus in mobile environment
      refetchOnWindowFocus: false,
      // Disable refetch on reconnect unless explicitly requested
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});
