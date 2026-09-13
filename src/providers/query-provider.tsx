"use client";

import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/api/api-client";

function handleUnauthorized() {
  if (typeof window === "undefined") return;

  const pathname = window.location.pathname;
  const search = window.location.search;

  // Don't bounce from auth pages themselves
  if (pathname === "/login" || pathname === "/register") return;

  const redirect = encodeURIComponent(pathname + search);
  window.location.href = `/login?redirect=${redirect}`;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
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

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
