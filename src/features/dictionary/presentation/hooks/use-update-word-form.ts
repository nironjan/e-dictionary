"use client";

import {
  updateWordFormSchema,
  updateWordSchema,
  type UpdateWordInput,
} from "../../domain/schema/word.schema old";
import type { WordFormValues } from "../../domain/types/word-form-values";
import type { WordDetail } from "../../domain/types/admin-word.types";
import { useWordAppForm } from "../components/form/use-word-app-form";
import { useUpdateAdminWordMutation } from "../../application/mutation/word.mutation";

function toFormValues(word: WordDetail): WordFormValues {
  return {
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

export function useUpdateWordForm(word: WordDetail) {
  const updateWordMutation = useUpdateAdminWordMutation();

  const form = useWordAppForm({
    defaultValues: toFormValues(word),
    validators: { onSubmit: updateWordFormSchema },
    onSubmit: async ({ value }) => {
      const { id: _id, ...input } = value;
      await updateWordMutation.mutateAsync({
        id: word.id,
        input: input as UpdateWordInput,
      });
    },
  });

  return { form, updateWordMutation };
}
