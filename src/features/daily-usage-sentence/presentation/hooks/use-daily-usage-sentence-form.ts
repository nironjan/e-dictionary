"use client";

import { useMemo } from "react";

import { useAppForm } from "@/shared/components/common/form/use-app-form";
import { useToast } from "@/shared/hooks/use-toast";

import { useCreateDailyUsageSentenceMutation } from "../../application/mutations/use-create-daily-usage-sentence-mutation";
import { useUpdateDailyUsageSentenceMutation } from "../../application/mutations/use-update-daily-usage-sentence-mutation";

import {
  dailyUsageSentenceSchema,
  type DailyUsageSentenceFormValues,
} from "../../domain/schemas/daily-usage-sentence.schema";

import type { DailyUsageSentence } from "../../domain/types/daily-usage-sentence.type";

interface UseDailyUsageSentenceFormOptions {
  sentence?: DailyUsageSentence | null;
  open: boolean;
  onSuccess: () => void;
}

function getDailyUsageSentenceFormValues(
  sentence: DailyUsageSentence | null | undefined,
): DailyUsageSentenceFormValues {
  if (!sentence) {
    return {
      slug: "",
      isVerified: false,
      isActive: true,
      sortOrder: 0,
      categoryIds: [],
    };
  }

  return {
    slug: sentence.slug ?? "",
    isVerified: sentence.isVerified,
    isActive: sentence.isActive,
    sortOrder: sentence.sortOrder ?? 0,
    categoryIds: sentence.categories.map((category) => category.id),
  };
}

export function useDailyUsageSentenceForm({
  sentence,
  open,
  onSuccess,
}: UseDailyUsageSentenceFormOptions) {
  const toast = useToast();

  const createMutation = useCreateDailyUsageSentenceMutation();
  const updateMutation = useUpdateDailyUsageSentenceMutation();

  const defaultValues = useMemo(
    () => getDailyUsageSentenceFormValues(sentence),
    [sentence],
  );

  const form = useAppForm({
    defaultValues,

    validators: {
      onSubmit: dailyUsageSentenceSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (sentence) {
          await updateMutation.mutateAsync({
            id: sentence.id,
            data: value,
          });

          toast.success("Daily usage sentence updated successfully");
        } else {
          await createMutation.mutateAsync(value);

          toast.success("Daily usage sentence created successfully");
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
    isEditing: Boolean(sentence),
    isSaving: createMutation.isPending || updateMutation.isPending,
    open,
  };
}
