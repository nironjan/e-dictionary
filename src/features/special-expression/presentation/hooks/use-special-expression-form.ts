"use client";

import { useMemo } from "react";

import { useAppForm } from "@/shared/components/common/form/use-app-form";
import { useToast } from "@/shared/hooks/use-toast";

import { useCreateSpecialExpressionMutation } from "../../application/mutations/use-create-special-expression-mutation";
import { useUpdateSpecialExpressionMutation } from "../../application/mutations/use-update-special-expression-mutation";

import {
  specialExpressionSchema,
  type SpecialExpressionFormValues,
} from "../../domain/schemas/special-expression.schema";

import type { SpecialExpression } from "../../domain/types/special-expression.type";
import { useLanguages } from "../../../language/application/queries/language.query";

interface UseSpecialExpressionFormOptions {
  expression?: SpecialExpression | null;
  open: boolean;
  onSuccess: () => void;
}

function getSpecialExpressionFormValues(
  expression: SpecialExpression | null | undefined,
  englishLanguageId: string,
): SpecialExpressionFormValues {
  if (!expression) {
    return {
      languageId: englishLanguageId,
      type: "one_word_substitution",
      expression: "",
      meaning: "",
      replacement: "",
      literalMeaning: "",
      example: "",
      notes: "",
      categoryIds: [],
      sortOrder: 0,
    };
  }

  return {
    languageId: expression.languageId,
    type: expression.type,
    expression: expression.expression,
    meaning: expression.meaning,
    replacement: expression.replacement ?? "",
    literalMeaning: expression.literalMeaning ?? "",
    example: expression.example ?? "",
    notes: expression.notes ?? "",
    categoryIds: expression.categories.map((category) => category.id),
    sortOrder: expression.sortOrder ?? 0,
  };
}

export function useSpecialExpressionForm({
  expression,
  open,
  onSuccess,
}: UseSpecialExpressionFormOptions) {
  const toast = useToast();

  const createMutation = useCreateSpecialExpressionMutation();
  const updateMutation = useUpdateSpecialExpressionMutation();

  const { data: languages = [], isLoading: isLanguageLoading } = useLanguages();

  const englishLanguageId = useMemo(
    () => languages.find((language) => language.code === "en")?.id ?? "",
    [languages],
  );

  const defaultValues = useMemo(
    () => getSpecialExpressionFormValues(expression, englishLanguageId),
    [expression, englishLanguageId],
  );

  const form = useAppForm({
    defaultValues,

    validators: {
      onSubmit: specialExpressionSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (expression) {
          await updateMutation.mutateAsync({
            id: expression.id,
            data: value,
          });

          toast.success("Special expression updated successfully");
        } else {
          await createMutation.mutateAsync(value);

          toast.success("Special expression created successfully");
        }

        onSuccess();
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.";

        toast.error(message);
      }
    },
  });

  return {
    form,
    isEditing: Boolean(expression),
    isSaving: createMutation.isPending || updateMutation.isPending,
    open,
    isEnglishLanguageLoading: isLanguageLoading,
  };
}
