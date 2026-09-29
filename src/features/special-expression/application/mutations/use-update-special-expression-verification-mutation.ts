import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface UpdateSpecialExpressionVerificationVariables {
  id: string;
  isVerified: boolean;
}

export function useUpdateSpecialExpressionVerificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      isVerified,
    }: UpdateSpecialExpressionVerificationVariables) =>
      specialExpressionApi.updateVerification(id, isVerified),

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
