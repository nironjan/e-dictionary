import type { SpecialExpressionListQuery } from "../../domain/types/special-expression-query.type";

export const specialExpressionQueryKeys = {
  all: ["special-expressions"] as const,

  lists: () => [...specialExpressionQueryKeys.all, "list"] as const,

  list: (query: SpecialExpressionListQuery) =>
    [...specialExpressionQueryKeys.lists(), query] as const,

  details: () => [...specialExpressionQueryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...specialExpressionQueryKeys.details(), id] as const,
};
