import { useQuery } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

export const useDailyUsageSentenceQuery = (id: string | undefined) => {
  return useQuery({
    queryKey: id
      ? dailyUsageSentenceQueryKeys.detail(id)
      : dailyUsageSentenceQueryKeys.details(),

    queryFn: () => {
      if (!id) {
        throw new Error("Daily usage sentence ID is required");
      }

      return dailyUsageSentenceApi.findOne(id);
    },

    enabled: Boolean(id),
  });
};
