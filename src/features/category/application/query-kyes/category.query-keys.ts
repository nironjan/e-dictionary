import type { CategoryListParams } from "../../domain/types/category.type";

export const categoryKeys = {
  all: ["categories"] as const,

  lists: () => [...categoryKeys.all, "list"] as const,

  list: (params: CategoryListParams) =>
    [...categoryKeys.lists(), params] as const,

  details: () => [...categoryKeys.all, "detail"] as const,

  detail: (id: string) => [...categoryKeys.details(), id] as const,

  translations: (categoryId: string) =>
    [...categoryKeys.detail(categoryId), "translations"] as const,
};
