import type { SpecialExpressionType } from "../schemas/special-expression.schema";

export interface SpecialExpressionListQuery {
  page?: number;
  limit?: number;
  search?: string;
  type?: SpecialExpressionType;
  categoryId?: string;
  isVerified?: boolean;
  languageCode?: string;
  translationLanguageCode?: string;
}
