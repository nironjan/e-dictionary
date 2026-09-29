import type { SpecialExpressionListQuery } from "../domain/types/special-expression-query.type";

export function buildSpecialExpressionQuery(
  query: SpecialExpressionListQuery,
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

  if (query.type) {
    params.type = query.type;
  }

  if (query.categoryId) {
    params.categoryId = query.categoryId;
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
