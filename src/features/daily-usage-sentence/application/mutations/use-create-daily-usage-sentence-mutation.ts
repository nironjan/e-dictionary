import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import type { DailyUsageSentenceFormValues } from "../../domain/schemas/daily-usage-sentence.schema";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

export const useCreateDailyUsageSentenceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DailyUsageSentenceFormValues) =>
      dailyUsageSentenceApi.create(data),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });
    },
  });
};
