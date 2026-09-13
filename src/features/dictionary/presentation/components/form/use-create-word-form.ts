/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateAdminWordMutation } from "../../../application/mutation/word.mutation";
import { createWordSchema } from "../../../domain/schema/word.schema";
import type { WordFormValues } from "../../../domain/types/word-form-values";
import { useWordAppForm } from "./use-word-app-form";

export const defaultCreateWordValues: WordFormValues = {
  languageId: "",
  text: "",
  phonetics: [],
  meanings: [],
  etymologies: [],
  sources: [],
  media: [],
  categoryIds: [],
};

export function useCreateWordForm(options?: {
  defaultValues?: WordFormValues;
  onSuccess?: (createdWord: any) => void;
}) {
  const createWordMutation = useCreateAdminWordMutation();

  const form = useWordAppForm({
    defaultValues: options?.defaultValues ?? defaultCreateWordValues,
    validators: { onSubmit: createWordSchema },
    onSubmit: async ({ value, formApi }) => {
      const { id: _id, version: _version, ...input } = value;
      const res = await createWordMutation.mutateAsync(input);
      if (options?.onSuccess) {
        options.onSuccess(res);
      }
      formApi.reset();
    },
  });

  return { form, createWordMutation };
}
