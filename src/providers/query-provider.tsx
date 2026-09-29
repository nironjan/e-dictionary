"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/api/api-client";

function handleUnauthorized(): void {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const search = window.location.search;

  if (pathname === "/login" || pathname === "/register") {
    return;
  }

  const redirect = encodeURIComponent(pathname + search);

  window.location.replace(`/login?redirect=${redirect}`);
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,

      retry: (failureCount, error) => {
        // Never retry authentication failures.
        // apiClient already attempts token refresh for 401 responses.
        if (isUnauthorizedError(error)) {
          return false;
        }

        return failureCount < 1;
      },

      refetchOnWindowFocus: false,
    },
  },

  queryCache: new QueryCache({
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorized();
      }
    },
  }),
});

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({
  children,
}: QueryProviderProps): React.ReactElement {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
