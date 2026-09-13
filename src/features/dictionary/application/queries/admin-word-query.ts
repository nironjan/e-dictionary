"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { AdminWordListQuery } from "../../domain/types/admin-word-list";
import { adminWordKeys } from "../query-keys/admin-word-query-keys";
import { adminWordApi } from "../../infrastructure/admin-word-api";

export function useAdminWordListQuery(params: AdminWordListQuery) {
  return useQuery({
    queryKey: adminWordKeys.list(params),
    queryFn: () => adminWordApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useAdminWordQuery(id: string) {
  return useQuery({
    queryKey: adminWordKeys.detail(id),
    queryFn: () => adminWordApi.get(id),
    enabled: Boolean(id),
  });
}
