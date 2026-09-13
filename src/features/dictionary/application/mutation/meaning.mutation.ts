import { useMutation, useQueryClient } from "@tanstack/react-query";

import { meaningApi } from "../../infrastructure/meaning.api";
import { MEANING_QUERY_KEY } from "../queries/meaning.query";
import { WORD_QUERY_KEY } from "../queries/word.query";
import type { SetMeaningVerifiedDto } from "../../domain/types/word.types";

interface VerifyMeaningVariables {
  id: string;
  dto: SetMeaningVerifiedDto;
}

export function useVerifyMeaning() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: VerifyMeaningVariables) =>
      meaningApi.verify(id, dto),

    onSuccess: (meaning) => {
      queryClient.invalidateQueries({
        queryKey: MEANING_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: WORD_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: ["dictionary", "word", meaning.wordId],
      });
    },
  });
}

export function useDeleteMeaning() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => meaningApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEANING_QUERY_KEY });
    },
  });
}
