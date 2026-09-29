import type { SpecialExpressionType } from "../schemas/special-expression.schema";

export interface SpecialExpressionTranslationForm {
  languageId: string;
  meaning: string;
  replacement?: string;
  literalMeaning?: string;
  example?: string;
  isVerified?: boolean;
  sortOrder?: number;
}

export interface SpecialExpressionFormValues {
  languageId: string;
  type: SpecialExpressionType;
  expression: string;
  meaning: string;
  replacement?: string;
  literalMeaning?: string;
  example?: string;
  notes?: string;
  categoryIds: string[];
  sortOrder?: number;
}
