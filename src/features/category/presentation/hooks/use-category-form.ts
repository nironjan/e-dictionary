"use client";

import { useMemo } from "react";

import { useToast } from "@/shared/hooks/use-toast";
import { useAppForm } from "@/shared/components/common/form/use-app-form";

import {
  categoryFormSchema,
  defaultCategoryFormValues,
  type CategoryFormData,
} from "../../domain/schema/category.schema";

import type {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "../../domain/types/category.type";

import {
  useCreateCategory,
  useUpdateCategory,
} from "../../application/mutation/category.mutation";

type UseCategoryFormOptions = {
  category?: Category | null;
  defaultLanguageId?: string;
  open: boolean;
  onSuccess: () => void;
};

function getCategoryFormValues(
  category: Category | null | undefined,
  defaultLanguageId: string,
): CategoryFormData {
  if (!category) {
    return {
      ...defaultCategoryFormValues,
      defaultLanguageId,
    };
  }

  const categoryDefaultLanguageId =
    category.defaultLanguageId ??
    category.defaultLanguage?.id ??
    defaultLanguageId;

  const defaultTranslation = category.translations?.find(
    (translation) =>
      (translation.languageId ?? translation.language?.id) ===
      categoryDefaultLanguageId,
  );

  return {
    name: defaultTranslation?.name ?? category.name ?? "",
    image: category.image ?? "",
    parentId: category.parentId ?? null,
    defaultLanguageId: categoryDefaultLanguageId,
    isActive: category.isActive,
    sortOrder: category.sortOrder ?? 0,
  };
}

export function useCategoryForm({
  category,
  defaultLanguageId = "",
  open,
  onSuccess,
}: UseCategoryFormOptions) {
  const toast = useToast();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();

  const defaultValues = useMemo(
    () => getCategoryFormValues(category, defaultLanguageId),
    [category, defaultLanguageId],
  );

  const form = useAppForm({
    defaultValues,

    validators: {
      onSubmit: categoryFormSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (category) {
          const updateDto: UpdateCategoryDto = {
            name: value.name,
            image: value.image || undefined,
            parentId: value.parentId,
            defaultLanguageId: value.defaultLanguageId,
            isActive: value.isActive,
            sortOrder: value.sortOrder,
          };

          await updateMutation.mutateAsync({
            id: category.id,
            input: updateDto,
          });

          toast.success("Category updated successfully");
        } else {
          const createDto: CreateCategoryDto = {
            defaultLanguageId: value.defaultLanguageId,
            parentId: value.parentId,
            name: value.name,
            image: value.image || undefined,
            isActive: value.isActive,
            sortOrder: value.sortOrder,
            translations: [
              {
                languageId: value.defaultLanguageId,
                name: value.name.trim(),
              },
            ],
          };

          await createMutation.mutateAsync(createDto);

          toast.success("Category created successfully");
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
    isEditing: Boolean(category),
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
