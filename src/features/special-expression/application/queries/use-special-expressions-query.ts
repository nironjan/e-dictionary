import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";

import type { SpecialExpressionListQuery } from "../../domain/types/special-expression-query.type";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

export function useSpecialExpressionsQuery(query: SpecialExpressionListQuery) {
  return useQuery({
    queryKey: specialExpressionQueryKeys.list(query),

    queryFn: () => specialExpressionApi.findAll(query),

    placeholderData: keepPreviousData,
  });
}
