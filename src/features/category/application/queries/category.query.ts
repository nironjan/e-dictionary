"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { categoryApi } from "../../infrastructure/category.api";
import { categoryKeys } from "../query-kyes/category.query-keys";
import type { CategoryListParams } from "../../domain/types/category.type";

export const CATEGORY_QUERY_KEY = ["categories"] as const;

export function useCategories(params: CategoryListParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: Boolean(id),
  });
}
