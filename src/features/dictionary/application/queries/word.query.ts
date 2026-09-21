"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { QueryWordsDto, WordDetail } from "../../domain/types/word.types";

import { wordApi } from "../../infrastructure/admin-word-api";
import { wordQueryKeys } from "../query-keys/word.query-keys";

export function useWords(query: QueryWordsDto = {}) {
  return useQuery({
    queryKey: wordQueryKeys.list(query),
    queryFn: () => wordApi.list(query),
    placeholderData: keepPreviousData,
  });
}

export function useWord(id: string | null) {
  return useQuery({
    queryKey: wordQueryKeys.detail(id),
    queryFn: async (): Promise<WordDetail> => {
      if (id === null) {
        throw new Error("Word ID is required");
      }

      return wordApi.getById(id);
    },
    enabled: id !== null,
  });
}

/**
 * Paginated search for selecting a target word
 * in the direct word-to-word translation field.
 */
export function useWordTranslationOptions(
  query: QueryWordsDto,
  enabled = true,
) {
  return useQuery({
    queryKey: wordQueryKeys.translationOptions(query),
    queryFn: () => wordApi.list(query),
    enabled,
    placeholderData: keepPreviousData,
  });
}
