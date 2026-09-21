import { useMutation, useQueryClient } from "@tanstack/react-query";

import { meaningApi } from "../../infrastructure/meaning.api";
import { MEANING_QUERY_KEY } from "../queries/meaning.query";
import type { SetMeaningVerifiedDto } from "../../domain/types/word.types";
import { wordQueryKeys } from "../query-keys/word.query-keys";

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
        queryKey: wordQueryKeys.all,
      });

      if (meaning.wordId !== undefined) {
        queryClient.invalidateQueries({
          queryKey: wordQueryKeys.detail(meaning.wordId),
        });
      }
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
