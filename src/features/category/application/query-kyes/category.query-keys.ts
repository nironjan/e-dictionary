import type { AdminCategoryListQuery } from "../../domain/types/admin-category-list.type";

export const categoryKeys = {
  all: ["categories"] as const,

  lists: (params?: AdminCategoryListQuery) =>
    [...categoryKeys.all, "list", params] as const,

  list: (params: AdminCategoryListQuery) =>
    [...categoryKeys.lists(params)] as const,

  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: string) => [...categoryKeys.details(), id] as const,

  translations: (categoryId: string) =>
    [...categoryKeys.detail(categoryId), "translations"] as const,
};
