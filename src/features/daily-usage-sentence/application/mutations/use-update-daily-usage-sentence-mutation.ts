import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import type { DailyUsageSentenceFormValues } from "../../domain/schemas/daily-usage-sentence.schema";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

interface UpdateDailyUsageSentenceInput {
  id: string;
  data: DailyUsageSentenceFormValues;
}

export const useUpdateDailyUsageSentenceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateDailyUsageSentenceInput) =>
      dailyUsageSentenceApi.update(id, data),

    onSuccess: (updatedSentence) => {
      queryClient.setQueryData(
        dailyUsageSentenceQueryKeys.detail(updatedSentence.id),
        updatedSentence,
      );

      void queryClient.invalidateQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });
    },
  });
};
