export interface DailyUsageSentenceListQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  languageCode?: string;
  translationLanguageCode?: string;
}
