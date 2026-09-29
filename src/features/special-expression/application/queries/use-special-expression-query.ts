import { useQuery } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

export function useSpecialExpressionQuery(id: string) {
  return useQuery({
    queryKey: specialExpressionQueryKeys.detail(id),

    queryFn: () => specialExpressionApi.findOne(id),

    enabled: Boolean(id),
  });
}
