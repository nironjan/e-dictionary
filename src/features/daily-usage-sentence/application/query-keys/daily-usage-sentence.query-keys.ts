import type { DailyUsageSentenceListQuery } from "../../domain/types/daily-usage-sentence-query.type";

export const dailyUsageSentenceQueryKeys = {
  all: ["daily-usage-sentences"] as const,

  lists: () => [...dailyUsageSentenceQueryKeys.all, "list"] as const,

  list: (query: DailyUsageSentenceListQuery) =>
    [...dailyUsageSentenceQueryKeys.lists(), query] as const,

  details: () => [...dailyUsageSentenceQueryKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...dailyUsageSentenceQueryKeys.details(), id] as const,
};
