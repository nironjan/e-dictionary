import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";

import type { SpecialExpressionTranslationForm } from "../../domain/types/special-expression-form.type";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface UpdateSpecialExpressionTranslationVariables {
  expressionId: string;
  translationId: string;
  data: SpecialExpressionTranslationForm;
}

export function useUpdateSpecialExpressionTranslationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expressionId,
      translationId,
      data,
    }: UpdateSpecialExpressionTranslationVariables) =>
      specialExpressionApi.updateTranslation(expressionId, translationId, data),

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
