import apiClient from "../../../lib/api/api-client";
import type {
  AdminCategoryListQuery,
  AdminCategoryListResponse,
} from "../domain/types/admin-category-list.type";
import type {
  Category,
  CategoryListParams,
  CategoryListResponse,
  CategoryTranslation,
  CreateCategoryDto,
  CreateCategoryTranslationDto,
  UpdateCategoryDto,
  UpdateCategoryTranslationDto,
} from "../domain/types/category.type";

import { CATEGORY_ENDPOINTS } from "./category.endpoints";

const ADMIN_CATEGORY_ENDPOINT = CATEGORY_ENDPOINTS.admin.list;

function buildQueryString(params: AdminCategoryListQuery): string {
  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }
  if (params.search?.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.isActive !== undefined) {
    searchParams.set("isActive", String(params.isActive));
  }

  const queryString = searchParams.toString();
  return queryString
    ? `${ADMIN_CATEGORY_ENDPOINT}?${queryString}`
    : ADMIN_CATEGORY_ENDPOINT;
}

export const categoryApi = {
  list: (params: CategoryListParams = {}): Promise<CategoryListResponse> =>
    apiClient.get<CategoryListResponse>(buildQueryString(params)),

  getById: (id: string): Promise<Category> =>
    apiClient.get<Category>(CATEGORY_ENDPOINTS.admin.byId(id)),

  create: (input: CreateCategoryDto): Promise<Category> =>
    apiClient.post<Category>(CATEGORY_ENDPOINTS.admin.create, input),

  update: (id: string, input: UpdateCategoryDto): Promise<Category> =>
    apiClient.patch<Category>(CATEGORY_ENDPOINTS.admin.update(id), input),

  delete: (id: string): Promise<void> =>
    apiClient.delete<void>(CATEGORY_ENDPOINTS.admin.delete(id)),

  // ---------------------------------------------------------------------------
  // Nested translations — only needed if you want to mutate translations
  // outside of the parent PATCH. With the current backend both work.
  // ---------------------------------------------------------------------------

  addTranslation: (
    categoryId: string,
    input: CreateCategoryTranslationDto,
  ): Promise<CategoryTranslation> =>
    apiClient.post<CategoryTranslation>(
      CATEGORY_ENDPOINTS.admin.translations.create(categoryId),
      input,
    ),

  updateTranslation: (
    categoryId: string,
    translationId: string,
    input: UpdateCategoryTranslationDto,
  ): Promise<CategoryTranslation> =>
    apiClient.patch<CategoryTranslation>(
      CATEGORY_ENDPOINTS.admin.translations.update(categoryId, translationId),
      input,
    ),

  removeTranslation: (
    categoryId: string,
    translationId: string,
  ): Promise<void> =>
    apiClient.delete<void>(
      CATEGORY_ENDPOINTS.admin.translations.delete(categoryId, translationId),
    ),
};
