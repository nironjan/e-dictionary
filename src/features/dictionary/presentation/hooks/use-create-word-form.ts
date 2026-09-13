"use client";

import { useCreateAdminWordMutation } from "../../application/mutation/word.mutation";
import { createWordSchema } from "../../domain/schema/word.schema old";
import type { WordFormValues } from "../../domain/types/word-form-values";
import { useWordAppForm } from "../components/form/use-word-app-form";

const defaultCreateWordValues: WordFormValues = {
  languageId: "",
  text: "",
  phonetics: [],
  meanings: [],
  etymologies: [],
  sources: [],
  media: [],
  categoryIds: [],
};

export function useCreateWordForm() {
  const createWordMutation = useCreateAdminWordMutation();

  const form = useWordAppForm({
    defaultValues: defaultCreateWordValues,
    validators: { onSubmit: createWordSchema },
    onSubmit: async ({ value, formApi }) => {
      const { id: _id, version: _version, ...input } = value;
      await createWordMutation.mutateAsync(input);
      formApi.reset();
    },
  });

  return { form, createWordMutation };
}
