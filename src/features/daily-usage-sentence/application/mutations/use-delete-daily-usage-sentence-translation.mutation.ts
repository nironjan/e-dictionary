"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";
import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";

interface DeleteDailyUsageSentenceTranslationInput {
  sentenceId: string;
  translationId: string;
}

export const useDeleteDailyUsageSentenceTranslationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sentenceId,
      translationId,
    }: DeleteDailyUsageSentenceTranslationInput) =>
      dailyUsageSentenceApi.removeTranslation(sentenceId, translationId),

    onSuccess: (_, { sentenceId, translationId }) => {
      queryClient.setQueryData<DailyUsageSentence>(
        dailyUsageSentenceQueryKeys.detail(sentenceId),
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            translations: current.translations.filter(
              (translation) => translation.id !== translationId,
            ),
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });
    },
  });
};
