import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";

import type { SpecialExpressionFormValues } from "../../domain/schemas/special-expression.schema";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface UpdateSpecialExpressionVariables {
  id: string;
  data: SpecialExpressionFormValues;
}

export function useUpdateSpecialExpressionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateSpecialExpressionVariables) =>
      specialExpressionApi.update(id, data),

    onSuccess: async (expression) => {
      queryClient.setQueryData(
        specialExpressionQueryKeys.detail(expression.id),
        expression,
      );

      await queryClient.invalidateQueries({
        queryKey: specialExpressionQueryKeys.lists(),
      });
    },
  });
}
