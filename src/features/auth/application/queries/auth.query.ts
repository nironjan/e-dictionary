"use client";

import { useQuery } from "@tanstack/react-query";
import { authKeys } from "../query-keys/auth.query-keys";
import { authApi } from "../../infrastructure/api/auth.api";
import type { AuthUser } from "../../types/auth.types";

export const useCurrentUserQuery = () => {
  return useQuery<AuthUser, Error>({
    queryKey: authKeys.me(),
    queryFn: () => authApi.profile(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};
