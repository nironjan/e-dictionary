"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";

import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";
import type { DailyUsageSentenceTranslationForm } from "../../domain/types/daily-usage-sentence-form.type";

import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";

interface UpdateDailyUsageSentenceTranslationInput {
  sentenceId: string;
  translationId: string;
  data: DailyUsageSentenceTranslationForm;
}

export const useUpdateDailyUsageSentenceTranslationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sentenceId,
      translationId,
      data,
    }: UpdateDailyUsageSentenceTranslationInput) =>
      dailyUsageSentenceApi.updateTranslation(sentenceId, translationId, data),

    onSuccess: (updatedTranslation, { sentenceId }) => {
      queryClient.setQueryData<DailyUsageSentence>(
        dailyUsageSentenceQueryKeys.detail(sentenceId),
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            translations: current.translations.map((translation) =>
              translation.id === updatedTranslation.id
                ? updatedTranslation
                : translation,
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
