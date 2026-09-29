import type { SpecialExpressionType } from "../schemas/special-expression.schema";

export type SpecialExpressionVerifiedFilter = "all" | "verified" | "unverified";

export interface SpecialExpressionListFilters {
  search: string;
  type: SpecialExpressionType | "all";
  verification: SpecialExpressionVerifiedFilter;
}
