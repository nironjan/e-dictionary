"use client";

import {
  useCreateLanguageMutation,
  useUpdateLanguageMutation,
} from "../../application/mutation/language.mutation";
import {
  defaultLanguageFormValues,
  languageFormSchema,
  type LanguageFormData,
} from "../../domain/schema/language.schema";
import { useEffect } from "react";
import { useToast } from "../../../../shared/hooks/use-toast";
import type { Language } from "../../domain/types/language.type";
import { useAppForm } from "../../../../shared/components/common/form/use-app-form";

type UseLanguageFormOptions = {
  language?: Language | null;
  open: boolean;
  onSuccess: () => void;
};

function getlanguageFormValues(
  language: Language | null | undefined,
): LanguageFormData {
  if (!language) {
    return defaultLanguageFormValues;
  }
  return {
    code: language.code,
    name: language.name,
    nativeName: language.nativeName ?? "",
    isActive: language.isActive,
    isRtl: language.isRtl,
    sortOrder: language.sortOrder ?? 0,
  };
}

export function useLanguageForm({
  language,
  open,
  onSuccess,
}: UseLanguageFormOptions) {
  const toast = useToast();

  const createMutation = useCreateLanguageMutation();
  const updateMutation = useUpdateLanguageMutation();

  const form = useAppForm({
    defaultValues: defaultLanguageFormValues,
    validators: {
      onSubmit: languageFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (language) {
          await updateMutation.mutateAsync({
            id: language.id,
            input: value,
          });
          toast.success("Language updated successfull.");
        } else {
          await createMutation.mutateAsync(value);
          toast.success("Language created successfull.");
        }
        onSuccess();
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again";
        toast.error(message);
      }
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    form.reset(getlanguageFormValues(language));
  }, [form, language, open]);

  return {
    form,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isEditing: Boolean(language),
  };
}
