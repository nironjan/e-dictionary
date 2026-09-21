import type { QueryWordsDto } from "../../domain/types/word.types";

export const wordQueryKeys = {
  all: ["words"] as const,

  lists: () => [...wordQueryKeys.all, "list"] as const,

  list: (query: QueryWordsDto) => [...wordQueryKeys.lists(), query] as const,

  details: () => [...wordQueryKeys.all, "detail"] as const,

  detail: (id: string | null) => [...wordQueryKeys.details(), id] as const,

  translationOptions: (query: QueryWordsDto) =>
    [...wordQueryKeys.all, "translation-options", query] as const,
};
