export interface WordCategoryLanguageResponse {
  id: string;
  code: string;
  name: string;
  slug: string;
}

export interface WordCategoryTranslationResponse {
  id: string;
  language: WordCategoryLanguageResponse;
  name: string;
  slug: string;
  description: string | null;
}

export interface WordCategoryResponse {
  id: string;
  name: string;
  image: string | null;
  parentId: string | null;
  defaultLanguage: WordCategoryLanguageResponse;
  isActive: boolean;
  sortOrder: number;
  translations: WordCategoryTranslationResponse[];
  createdAt: string;
  updatedAt: string;
}
