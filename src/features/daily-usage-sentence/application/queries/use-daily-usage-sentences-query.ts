import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import type { DailyUsageSentenceListQuery } from "../../domain/types/daily-usage-sentence-query.type";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

export const useDailyUsageSentencesQuery = (
  query: DailyUsageSentenceListQuery = {},
) => {
  return useQuery({
    queryKey: dailyUsageSentenceQueryKeys.list(query),
    queryFn: () => dailyUsageSentenceApi.findAll(query),
    placeholderData: keepPreviousData,
  });
};
