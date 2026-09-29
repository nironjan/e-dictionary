import type { DailyUsageSentenceListQuery } from "../domain/types/daily-usage-sentence-query.type";

export function buildDailyUsageSentenceQuery(
  query: DailyUsageSentenceListQuery,
): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};

  if (query.page !== undefined) {
    params.page = query.page;
  }

  if (query.limit !== undefined) {
    params.limit = query.limit;
  }

  if (query.search?.trim()) {
    params.search = query.search.trim();
  }

  if (query.isActive !== undefined) {
    params.isActive = query.isActive;
  }

  if (query.isVerified !== undefined) {
    params.isVerified = query.isVerified;
  }

  if (query.languageCode) {
    params.languageCode = query.languageCode;
  }

  if (query.translationLanguageCode) {
    params.translationLanguageCode = query.translationLanguageCode;
  }

  return params;
}
