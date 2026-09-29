import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";

import type { SpecialExpressionTranslationForm } from "../../domain/types/special-expression-form.type";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface CreateSpecialExpressionTranslationVariables {
  expressionId: string;
  data: SpecialExpressionTranslationForm;
}

export function useCreateSpecialExpressionTranslationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      expressionId,
      data,
    }: CreateSpecialExpressionTranslationVariables) =>
      specialExpressionApi.addTranslation(expressionId, data),

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
