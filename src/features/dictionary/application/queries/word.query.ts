"use client";

import { useQuery } from "@tanstack/react-query";
import type { QueryWordsDto, WordDetail } from "../../domain/types/word.types";
import { wordApi } from "../../infrastructure/admin-word-api";

export const WORD_QUERY_KEY = ["words"] as const;

export function useWords(query: QueryWordsDto = {}) {
  return useQuery({
    queryKey: [...WORD_QUERY_KEY, query],
    queryFn: () => wordApi.list(query),
  });
}

export function useWord(id: string | null) {
  return useQuery({
    queryKey: [...WORD_QUERY_KEY, "detail", id],
    queryFn: async (): Promise<WordDetail> => {
      if (id === null) {
        throw new Error("Word ID is required");
      }

      return wordApi.getById(id);
    },
    enabled: id !== null,
  });
}
