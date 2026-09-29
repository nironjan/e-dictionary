"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { dailyUsageSentenceApi } from "../../infrastructure/daily-usage-sentence.api";
import type { DailyUsageSentenceTranslationForm } from "../../domain/types/daily-usage-sentence-form.type";
import { dailyUsageSentenceQueryKeys } from "../query-keys/daily-usage-sentence.query-keys";
import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";

interface AddDailyUsageSentenceTranslationInput {
  sentenceId: string;
  data: DailyUsageSentenceTranslationForm;
}

export const useAddDailyUsageSentenceTranslationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sentenceId, data }: AddDailyUsageSentenceTranslationInput) =>
      dailyUsageSentenceApi.addTranslation(sentenceId, data),

    onSuccess: (translation, { sentenceId }) => {
      queryClient.setQueryData<DailyUsageSentence>(
        dailyUsageSentenceQueryKeys.detail(sentenceId),
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            translations: [...current.translations, translation],
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey: dailyUsageSentenceQueryKeys.lists(),
      });
    },
  });
};
