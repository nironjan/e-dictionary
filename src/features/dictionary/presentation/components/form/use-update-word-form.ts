"use client";

import {
  updateWordFormSchema,
  type UpdateWordInput,
} from "../../../domain/schema/word.schema";
import type { WordFormValues } from "../../../domain/types/word-form-values";
import type { WordDetail } from "../../../domain/types/admin-word.types";
import { useWordAppForm } from "./use-word-app-form";
import { useUpdateAdminWordMutation } from "../../../application/mutation/word.mutation";

export function toFormValues(word: WordDetail): WordFormValues {
  return {
    id: word.id,
    languageId: word.languageId,
    text: word.text,
    phonetics: word.phonetics ?? [],
    meanings: word.meanings ?? [],
    etymologies: word.etymologies ?? [],
    sources: word.sources ?? [],
    media: word.media ?? [],
    categoryIds: word.categoryIds ?? [],
    version: word.version,
  };
}

export function useUpdateWordForm(
  word: WordDetail,
  options?: { onSuccess?: (updated: WordDetail) => void },
) {
  const updateWordMutation = useUpdateAdminWordMutation();

  const form = useWordAppForm({
    defaultValues: toFormValues(word),
    validators: { onSubmit: updateWordFormSchema },
    onSubmit: async ({ value }) => {
      const { id: _id, ...input } = value;
      const res = await updateWordMutation.mutateAsync({
        id: word.id,
        input: input as UpdateWordInput,
      });
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
    },
  });

  return { form, updateWordMutation };
}
