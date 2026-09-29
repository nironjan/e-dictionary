import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

interface DeleteDailyUsageSentenceInput {
  id: string;
}

export const useDeleteDailyUsageSentenceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteDailyUsageSentenceInput) =>
      dailyUsageSentenceApi.remove(id),

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });

      void queryClient.invalidateQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });
    },
  });
};
