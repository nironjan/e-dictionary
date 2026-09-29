export interface DailyUsageSentenceTranslationForm {
  id?: string;
  languageId: string;
  text: string;
  isVerified: boolean;
  sortOrder: number;
}

export interface DailyUsageSentenceForm {
  slug?: string;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: number;
  categoryIds: string[];
}
