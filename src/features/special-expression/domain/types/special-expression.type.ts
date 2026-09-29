import type { SpecialExpressionType } from "../schemas/special-expression.schema";

export interface SpecialExpressionCategory {
  id: string;
}

export interface SpecialExpressionTranslation {
  id: string;
  languageId: string;
  languageCode: string;
  meaning: string;
  replacement: string | null;
  literalMeaning: string | null;
  example: string | null;
  isVerified: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SpecialExpression {
  id: string;
  languageId: string;
  type: SpecialExpressionType;
  expression: string;
  meaning: string;
  replacement: string | null;
  literalMeaning: string | null;
  example: string | null;
  notes: string | null;
  isVerified: boolean;
  sortOrder: number;
  translations: SpecialExpressionTranslation[];
  categories: SpecialExpressionCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface SpecialExpressionListResponse {
  data: SpecialExpression[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
