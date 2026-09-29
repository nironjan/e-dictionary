import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface DeleteSpecialExpressionTranslationVariables {
  expressionId: string;
  translationId: string;
}

export function useDeleteSpecialExpressionTranslationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expressionId,
      translationId,
    }: DeleteSpecialExpressionTranslationVariables) =>
      specialExpressionApi.removeTranslation(expressionId, translationId),

    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: specialExpressionQueryKeys.detail(variables.expressionId),
      });

      await queryClient.invalidateQueries({
        queryKey: specialExpressionQueryKeys.lists(),
      });
    },
  });
}
