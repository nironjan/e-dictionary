"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateLanguageDto,
  UpdateLanguageDto,
} from "../../domain/types/language.type";
import { languageApi } from "../../infrastructure/language.api";
import { languageKeys } from "../query-kyes/language.query-keys";

export function useCreateLanguageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateLanguageDto) => languageApi.crerate(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: languageKeys.lists(),
      });
    },
  });
}

export function useUpdateLanguageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLanguageDto }) =>
      languageApi.update(id, input),
    onSuccess: async (language) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: languageKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: languageKeys.detail(language.id),
        }),
      ]);
    },
  });
}

export function useDeleteLanguageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => languageApi.delete(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: languageKeys.lists(),
        }),

        queryClient.removeQueries({
          queryKey: languageKeys.detail(id),
        }),
      ]);
    },
  });
}
