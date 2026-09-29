import type { PaginationMeta } from "../../../users/domain/types/user.types";

export interface DailyUsageSentenceTranslation {
  id: string;
  languageId: string;
  languageCode: string;
  text: string;
  isVerified: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyUsageSentenceCategory {
  id: string;
  name: string;
}

export interface DailyUsageSentence {
  id: string;
  slug: string | null;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: number;
  translations: DailyUsageSentenceTranslation[];
  categories: DailyUsageSentenceCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyUsageSentenceListResponse {
  data: DailyUsageSentence[];
  pagination: PaginationMeta;
}
