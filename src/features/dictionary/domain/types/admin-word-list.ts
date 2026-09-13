export type WordVerificationFilter = "all" | "verified" | "unverified";

export type WordLanguageFilter = "all" | string;

export interface AdminWordListFilters {
  search: string;
  languageCode: WordLanguageFilter;
  verification: WordVerificationFilter;
}

export interface AdminWordLanguage {
  id: string;
  code: string;
  name: string;
}

export interface AdminWordListItem {
  id: string;
  text: string;
  language: AdminWordLanguage;
  isVerified: boolean;
  version: number;
  updatedAt: string;
}

export interface AdminWordListPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminWordListResponse {
  data: AdminWordListItem[];
  pagination: AdminWordListPagination;
}

export interface AdminWordListQuery {
  page?: number;
  limit?: number;
  search?: string;
  languageCode?: string;
  isVerified?: boolean;
}
