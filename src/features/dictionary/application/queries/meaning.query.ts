import { useQuery } from "@tanstack/react-query";

import { meaningApi } from "../../infrastructure/meaning.api";
import type { QueryMeaningsDto } from "../../infrastructure/meaning.api";

export const MEANING_QUERY_KEY = ["dictionary", "meanings"] as const;

export function useMeanings(query: QueryMeaningsDto) {
  return useQuery({
    queryKey: [...MEANING_QUERY_KEY, query],
    queryFn: () => meaningApi.list(query),
    enabled: Boolean(query.wordId),
  });
}

export function useMeaning(id: string | undefined) {
  return useQuery({
    queryKey: [...MEANING_QUERY_KEY, "detail", id],
    queryFn: () => {
      if (!id) {
        throw new Error("Meaning ID is required");
      }

      return meaningApi.getById(id);
    },
    enabled: Boolean(id),
  });
}
