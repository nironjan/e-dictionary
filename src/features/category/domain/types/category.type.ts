import type { Language } from "../../../language/domain/types/language.type";

export interface CategoryTranslation {
  id: string;
  categoryId?: string;
  languageId?: string;
  language: Pick<Language, "id" | "code" | "name" | "slug">;
  name: string;
  slug: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string | null;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  defaultLanguageId?: string;
  defaultLanguage?: Pick<Language, "id" | "code" | "name" | "slug">;
  translations?: CategoryTranslation[];
  translationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryTranslationDto {
  languageId: string;
  name: string;
  slug?: string;
  description?: string;
}

export type UpdateCategoryTranslationDto =
  Partial<CreateCategoryTranslationDto>;

export interface CreateCategoryDto {
  defaultLanguageId?: string;
  parentId?: string | null;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
  translations?: CreateCategoryTranslationDto[];
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;
