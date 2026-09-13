import type { Language } from "../../../language/domain/types/language.type";

export type CategoryActiveFilter = "all" | "active" | "inactive";

export interface AdminCategoryListFilters {
  search: string;
  activation: CategoryActiveFilter;
}

export interface AdminCategoryListItem {
  id: string;
  name: string;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  defaultLanguage: Language;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategoryListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminCategoryListResponse {
  data: AdminCategoryListItem[];
  pagination: AdminCategoryListPagination;
}

export interface AdminCategoryListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}
