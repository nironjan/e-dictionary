"use client";

import { useEffect } from "react";

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

  // When editing, prefer the default-language translation's name
  // (the category.name is a projection of it anyway).
  const defaultTranslation = category.translations?.find(
    (t) =>
      (t.languageId ?? t.language?.id) ===
      (category.defaultLanguageId ?? category.defaultLanguage?.id),
  );

  return {
    name: defaultTranslation?.name ?? category.name,
    image: category.image ?? "",
    parentId: category.parentId ?? null,
    defaultLanguageId:
      category.defaultLanguage?.id ??
      category.defaultLanguageId ??
      defaultLanguageId,
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

  const form = useAppForm({
    defaultValues: defaultCategoryFormValues,

    validators: {
      onSubmit: categoryFormSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        if (category) {
          // ✅ Update: strip `name` (derived from default translation).
          //    Also strip `translations` — this endpoint doesn't accept it.
          const updateDto: UpdateCategoryDto = {
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
          // ✅ Create: name lives inside `translations[]`, not at top level.
          //    The translation matching `defaultLanguageId` becomes canonical.
          const createDto: CreateCategoryDto = {
            defaultLanguageId: value.defaultLanguageId,
            parentId: value.parentId,
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

  useEffect(() => {
    if (!open) {
      return;
    }

    form.reset(getCategoryFormValues(category, defaultLanguageId));
  }, [category, defaultLanguageId, form, open]);

  return {
    form,
    isEditing: Boolean(category),
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
