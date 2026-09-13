"use client";

import { useCurrentUserQuery } from "../../application/queries/auth.query";

export function useAuth() {
  const query = useCurrentUserQuery();
  const isLoading = query.isLoading;
  const isAuthenticated = !!query.data;

  return {
    user: query.data ?? null,
    isAuthenticated,
    isLoading,
    isFetching: query.isFetching,
    isReady: !isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
