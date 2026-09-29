import { useMutation, useQueryClient } from "@tanstack/react-query";

import { specialExpressionQueryKeys } from "../query-keys/special-expression.query-keys";
import { specialExpressionApi } from "../../infrastruture/special-expression.api";

interface DeleteSpecialExpressionInput {
  id: string;
}

export function useDeleteSpecialExpressionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteSpecialExpressionInput) =>
      specialExpressionApi.remove(id),

    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: specialExpressionQueryKeys.lists(),
      });

      await queryClient.invalidateQueries({
        queryKey: specialExpressionQueryKeys.lists(),
      });
    },
  });
}
