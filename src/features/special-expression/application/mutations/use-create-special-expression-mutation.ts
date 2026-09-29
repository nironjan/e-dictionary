import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";

import type { SpecialExpressionFormValues } from "../../domain/schemas/special-expression.schema";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

export function useCreateSpecialExpressionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SpecialExpressionFormValues) =>
      specialExpressionApi.create(data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: specialExpressionQueryKeys.lists(),
      });
    },
  });
}
